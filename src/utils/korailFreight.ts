/**
 * 한국철도공사(KORAIL) 화물 운임료 책정 표준 규정
 */

export interface GeneralCargoCalculationInput {
  cargoCategory: 'general';
  item: string;         // 품목명 (e.g. 'JP8', '프로필렌', '황산', '비료류 / 사업용', '국내무연탄', '시멘트', '변압기', '광석', '유연탄', '철강', '기타품목')
  distanceKm: number;   // 수송거리 (km)
  weightTon: number;    // 화물중량 (t)
  carCount?: number;    // 화차 량수 (량, 기본 1량)
  minWeightPerCarTon?: number; // 1량 당 최저 중량 (기본 15톤)
}

export interface ContainerCargoCalculationInput {
  cargoCategory: 'container';
  containerSize: string; // 규격 ('20ft', '40ft', '45ft' 등)
  distanceKm: number;    // 수송거리 (km)
  quantity?: number;     // 컨테이너 개수 (개, 기본 1개)
  isEmptyContainer?: boolean; // 공 컨테이너 여부 (74% 적용)
}

export type KorailFreightCalculationInput = GeneralCargoCalculationInput | ContainerCargoCalculationInput;

// 품목별 운임 단가 (1톤·1km 기준)
export const GENERAL_CARGO_UNIT_RATES: Record<string, number> = {
  'JP8': 140.0,
  '프로필렌': 67.8,
  '황산': 67.1,
  '비료류 / 사업용': 65.1,
  '비료류/사업용': 65.1,
  '비료류': 65.1,
  '국내무연탄': 60.4,
  '시멘트': 59.0,
  '변압기': 57.2,
  '광석': 51.5,
  '유연탄': 50.7,
  '철강': 47.5,
  '기타품목': 45.9,
};

// 컨테이너 규격별 운임 단가 (1개·1km 기준)
export const CONTAINER_UNIT_RATES: Record<string, number> = {
  '20ft': 516,
  '20 ft': 516,
  '20ft Standard': 516,
  '20ft High Cube': 516,
  '20ft Tank Container': 516,
  '40ft': 800,
  '40 ft': 800,
  '40ft Standard': 800,
  '40ft High Cube': 800,
  '40ft Reefer (냉동/냉장)': 800,
  '45ft': 946,
  '45 ft': 946,
  '45ft High Cube': 946,
};

export interface ParcelCargoCalculationInput {
  cargoCategory?: 'parcel';
  weightKg: number;       // 화물 개당 실중량 (kg)
  sizeSumCm: number;      // 박스 세 변의 합 (가로+세로+높이 cm, 예: 80, 100, 120, 160)
  quantity: number;       // 박스/화물 수량 (개)
  regionZone: 'same_region' | 'other_region' | 'island'; // 배송 권역 (동일권역, 타권역, 제주/도서산간)
  widthCm?: number;       // 가로 (cm, 선택)
  lengthCm?: number;      // 세로 (cm, 선택)
  heightCm?: number;      // 높이 (cm, 선택)
}

export interface ParcelCargoResult {
  basePricePerItem: number;       // 규격/무게별 개당 기본 택배 운임 (원)
  volumetricWeightKg: number;    // 부피중량 (kg)
  chargedWeightKg: number;       // 최종 적용 청구중량 (Max(실중량, 부피중량))
  regionExtraPerItem: number;    // 권역/지역 추가 운임 (개당)
  finalPricePerItem: number;     // 개당 최종 택배비 (원)
  quantity: number;              // 총 수량 (개)
  grossTotalBeforeDiscount: number; // 할인 전 총 금액 (원)
  discountRate: number;          // 다량 할인율 (0 ~ 0.15)
  discountAmount: number;        // 다량 할인 금액 (원)
  finalTotalCost: number;        // 최종 소량 화물/택배비 (원)
  weightGradeLabel: string;      // 무게 구간 표기 (예: "10kg 이하 (중형)")
  sizeGradeLabel: string;        // 부피 규격 표기 (예: "120cm 이하 (8호)")
  recommendationNote: string;    // 소량 화물 -> LCL/용차 추천 알림 가이드
}

/**
 * 소량 화물 / 택배 / LCL 운임 산출 공식
 * (무게, 부피, 수량, 배송 지역에 따른 정밀 계산)
 */
export function calculateParcelFreight(input: ParcelCargoCalculationInput): ParcelCargoResult {
  const qty = Math.max(1, Math.round(input.quantity || 1));
  const realWeightKg = Math.max(0.1, input.weightKg || 1);

  // 1. 부피중량 (Volumetric Weight) 산출: (가로x세로x높이 cm) / 6000
  let volumetricWeightKg = 0;
  if (input.widthCm && input.lengthCm && input.heightCm) {
    volumetricWeightKg = Math.round(((input.widthCm * input.lengthCm * input.heightCm) / 6000) * 10) / 10;
  } else {
    // 세 변의 합 기반 근사 부피중량 산출
    const cm = input.sizeSumCm || 80;
    const side = cm / 3;
    volumetricWeightKg = Math.round(((side * side * side) / 6000) * 10) / 10;
  }

  // 2. 적용 청구 무게 = Max(실중량, 부피중량)
  const chargedWeightKg = Math.max(realWeightKg, volumetricWeightKg);

  // 3. 무게 및 규격 구간에 따른 개당 기본 택배 운임 산정
  let basePricePerItem = 4000;
  let weightGradeLabel = '2kg 이하 (초소형)';
  let sizeGradeLabel = '80cm 이하 (극소형)';

  if (chargedWeightKg <= 2 && (input.sizeSumCm || 80) <= 80) {
    basePricePerItem = 4000;
    weightGradeLabel = '2kg 이하 (초소형)';
    sizeGradeLabel = '80cm 이하';
  } else if (chargedWeightKg <= 5 && (input.sizeSumCm || 100) <= 100) {
    basePricePerItem = 5000;
    weightGradeLabel = '5kg 이하 (소형)';
    sizeGradeLabel = '100cm 이하';
  } else if (chargedWeightKg <= 10 && (input.sizeSumCm || 120) <= 120) {
    basePricePerItem = 6500;
    weightGradeLabel = '10kg 이하 (중형)';
    sizeGradeLabel = '120cm 이하';
  } else if (chargedWeightKg <= 20 && (input.sizeSumCm || 160) <= 160) {
    basePricePerItem = 8500;
    weightGradeLabel = '20kg 이하 (대형)';
    sizeGradeLabel = '160cm 이하';
  } else if (chargedWeightKg <= 30) {
    basePricePerItem = 11000;
    weightGradeLabel = '30kg 이하 (특대형)';
    sizeGradeLabel = '160cm 초과 특수포장';
  } else {
    // 30kg 초과
    const extraKg = Math.ceil(chargedWeightKg - 30);
    basePricePerItem = 12000 + extraKg * 500;
    weightGradeLabel = `${chargedWeightKg}kg (초과 화물)`;
    sizeGradeLabel = '특수 규격 화물';
  }

  // 4. 배송 권역에 따른 개당 할증료
  let regionExtraPerItem = 0;
  if (input.regionZone === 'other_region') {
    regionExtraPerItem = 1000; // 타권역
  } else if (input.regionZone === 'island') {
    regionExtraPerItem = 4000; // 제주/도서산간
  }

  const finalPricePerItem = basePricePerItem + regionExtraPerItem;
  const grossTotalBeforeDiscount = finalPricePerItem * qty;

  // 5. 수량에 따른 다량 발송 할인율
  let discountRate = 0;
  if (qty >= 50) {
    discountRate = 0.15; // 50개 이상 15% 할인
  } else if (qty >= 20) {
    discountRate = 0.10; // 20~49개 10% 할인
  } else if (qty >= 5) {
    discountRate = 0.05; // 5~19개 5% 할인
  }

  const discountAmount = Math.round(grossTotalBeforeDiscount * discountRate);
  const finalTotalCost = grossTotalBeforeDiscount - discountAmount;

  // 6. 물량/무게 기준 모드 전환 권장 가이드 생성
  const totalWeightTon = (chargedWeightKg * qty) / 1000;
  let recommendationNote = '단건/소량 물품으로 일반 소화물 택배 배송이 가장 효율적입니다.';

  if (qty >= 30 || totalWeightTon >= 0.3) {
    recommendationNote = `⚠️ 총 수량 ${qty}개 / 총 중량 ${(totalWeightTon * 1000).toFixed(0)}kg으로 물량이 상당합니다! 개별 택배로 전송 시 총 ${finalTotalCost.toLocaleString()}원이 부과되나, [카카오 T 1톤 용차] 또는 [KORAIL LCL 소량 화물 혼적] 이용 시 약 20~35% 운임을 절감하실 수 있습니다.`;
  } else if (chargedWeightKg >= 25) {
    recommendationNote = '💡 단품 무게가 25kg 이상 고중량이므로 택배 파손/할증 위험이 있습니다. 다마스/라보 소형 화물 배송을 고려해 보세요.';
  }

  return {
    basePricePerItem,
    volumetricWeightKg,
    chargedWeightKg,
    regionExtraPerItem,
    finalPricePerItem,
    quantity: qty,
    grossTotalBeforeDiscount,
    discountRate,
    discountAmount,
    finalTotalCost,
    weightGradeLabel,
    sizeGradeLabel,
    recommendationNote,
  };
}

export interface KorailFreightResult {
  pureFreight: number;          // 100원 단위 반올림 처리된 철도 순수 운임료 (원)
  unitRate: number;             // 적용된 단가 (원)
  effectiveDistanceKm: number;  // 반올림 및 최저거리(100km) 적용된 수송거리 (km)
  effectiveWeightTon: number;   // 반올림 및 최저중량 적용된 중량 (톤)
  formulaDescription: string;   // 계산 공식 설명
  vatAmount: number;            // 부가가치세 별도 (10%)
}

/**
 * KORAIL 철도 화물 운임 산출 공식
 */
export function calculateKorailFreight(input: KorailFreightCalculationInput): KorailFreightResult {
  // 수송거리: 1km 단위 (1km 미만 반올림)
  const roundedDist = Math.max(1, Math.round(input.distanceKm));

  if (input.cargoCategory === 'container') {
    // [컨테이너 화물]
    // 최저 운임: 컨테이너 규격별 100km에 해당하는 운임 적용
    const effectiveDistanceKm = Math.max(100, roundedDist);
    const quantity = Math.max(1, input.quantity || 1);

    // 규격 판정 및 운임 단가 (1개·1km 기준)
    const sz = (input.containerSize || '').toLowerCase();
    let baseUnitRate = 516; // 기본 20ft
    if (sz.includes('45')) {
      baseUnitRate = 946;
    } else if (sz.includes('40')) {
      baseUnitRate = 800;
    } else {
      baseUnitRate = 516;
    }

    // 공 컨테이너: 화물을 넣지 않은 빈 컨테이너는 위 운임 단가의 74% 적용
    const unitRate = input.isEmptyContainer ? Math.round(baseUnitRate * 0.74 * 10) / 10 : baseUnitRate;

    // 공식: 운임 = 운임 단가 × 수송거리(km) × 개수
    const rawFare = unitRate * effectiveDistanceKm * quantity;

    // 운임: 100원 단위 (100원 미만 반올림)
    const pureFreight = Math.round(rawFare / 100) * 100;
    const vatAmount = Math.round((pureFreight * 0.1) / 100) * 100;

    return {
      pureFreight,
      unitRate,
      effectiveDistanceKm,
      effectiveWeightTon: 0,
      formulaDescription: `컨테이너 (${input.containerSize || '20ft'}, ${quantity}개${input.isEmptyContainer ? ', 공컨테이너 74%' : ''}) : 단가 ${unitRate}원 × 거리 ${effectiveDistanceKm}km × ${quantity}개 = ${pureFreight.toLocaleString()}원 (VAT 별도)`,
      vatAmount,
    };
  } else {
    // [일반화물 (1량 단위)]
    // 화물중량: 1톤 단위 (1톤 미만 반올림)
    const roundedWeight = Math.max(1, Math.round(input.weightTon));
    const carCount = Math.max(1, input.carCount || 1);
    
    // 1량의 최저중량에 못 미칠 경우 별도로 정한 중량 적용 (1량 당 최저중량 15톤 기본)
    const minWeightPerCarTon = input.minWeightPerCarTon || 15;
    const effectiveWeightTon = Math.max(roundedWeight, carCount * minWeightPerCarTon);

    // 품목 매칭 (단가 1톤·1km 기준)
    let unitRate = 45.9; // 기타품목 기본
    const itemName = input.item || '';
    
    for (const [key, rate] of Object.entries(GENERAL_CARGO_UNIT_RATES)) {
      if (itemName.includes(key)) {
        unitRate = rate;
        break;
      }
    }

    // 공식: 운임 = 운임 단가 × 수송거리(km) × 화물중량(t)
    const rawFare = unitRate * roundedDist * effectiveWeightTon;

    // 운임: 100원 단위 (100원 미만 반올림)
    const pureFreight = Math.round(rawFare / 100) * 100;
    const vatAmount = Math.round((pureFreight * 0.1) / 100) * 100;

    return {
      pureFreight,
      unitRate,
      effectiveDistanceKm: roundedDist,
      effectiveWeightTon,
      formulaDescription: `일반화물 (${itemName || '기타'}, ${carCount}량 ${effectiveWeightTon}톤) : 단가 ${unitRate}원 × 거리 ${roundedDist}km × 중량 ${effectiveWeightTon}t = ${pureFreight.toLocaleString()}원 (VAT 별도)`,
      vatAmount,
    };
  }
}
