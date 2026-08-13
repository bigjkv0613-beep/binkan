import React, { useState } from 'react';
import { Language } from '../types';
import {
  Leaf,
  Award,
  TreePine,
  Truck,
  Train,
  Building2,
  Users,
  Calculator,
  CheckCircle2,
  Info,
  FileText
} from 'lucide-react';

interface EsgSectionProps {
  lang?: Language;
}

export const EsgSection: React.FC<EsgSectionProps> = ({ lang = 'KO' }) => {
  const isEng = lang === 'ENG';
  
  // Calculator State
  const [cargoWeightTon, setCargoWeightTon] = useState<number>(100);
  const [distanceKm, setDistanceKm] = useState<number>(400);
  const [showBasisDetail, setShowBasisDetail] = useState<boolean>(true);

  // Certificate State
  const [certCompanyName, setCertCompanyName] = useState<string>('(주)한국환경물류통상');

  // Exact Carbon Savings Calculation based on Ministry of Environment / GIR factors
  // Road truck: 136.5 g CO2 / ton·km
  // Rail freight train: 23.2 g CO2 / ton·km
  // Difference: 113.3 g CO2 / ton·km = 0.1133 kg CO2 / ton·km
  const roadFactor = 136.5; // g CO2/ton·km
  const railFactor = 23.2;  // g CO2/ton·km
  const gramSavedPerTonKm = roadFactor - railFactor; // 113.3 g
  const co2SavedKg = (gramSavedPerTonKm * cargoWeightTon * distanceKm) / 1000;
  
  // Pine Tree Equivalent: 1 pine tree absorbs ~6.6kg CO2/year
  const pineTreesCount = Math.round(co2SavedKg / 6.6);

  return (
    <div className="pb-8 bg-[#F1F6F7] min-h-screen text-slate-900">
      
      {/* 1. Header Banner - Deep Green (Full Width Top Banner) */}
      <div className="w-full bg-[#00381A] text-white py-10 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-10 shadow-xl relative overflow-hidden border-b border-emerald-800/40">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative z-10 space-y-4 max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black border border-white/30 backdrop-blur-md">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>GREEN LOGISTICS · 친환경 ESG 경영</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              지속 가능한 미래를 여는 <span className="text-emerald-300 underline decoration-white/40">친환경 철도물류</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-white/95 font-medium leading-relaxed break-words">
              철도수송은 도로 수송 대비 탄소 배출량을 최대 83% 이상 감축할 수 있는 가장 확실한 녹색 물류 솔루션입니다. KORAIL Binkan과 함께 ESG 물류 혁신을 시작하세요.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white space-y-1">
                <span className="text-xs text-white/80 block font-bold">탄소 배출 감축율</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">83.0%↓</span>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white space-y-1">
                <span className="text-xs text-white/80 block font-bold">에너지 효율성</span>
                <span className="text-2xl sm:text-3xl font-black text-white">4.5배 <span className="text-xs font-normal text-white/80">높음</span></span>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white space-y-1">
                <span className="text-xs text-white/80 block font-bold">Scope 3 온실가스</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-300">공인 인증서</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 mt-8 lg:mt-10 space-y-8 lg:space-y-10">

        {/* 2. Road vs Rail Comparison & ESG Values */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Comparison Card - 3D White Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/80 flex flex-col justify-between space-y-6 text-slate-900 hover:shadow-2xl transition-all">
            <div>
              <span className="text-xs font-black text-[#005C2B] uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 mb-3 inline-block">
                EMISSION COMPARISON · 탄소 배출 비교
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                도로 vs 철도 수송 탄소 배출 절감 효과
              </h2>
            </div>

            <div className="space-y-6 py-2">
              {/* Road */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold text-slate-700">
                  <span className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-slate-500" />
                    <span>도로 수송 (화물 트럭: 136.5g CO₂/ton·km)</span>
                  </span>
                  <span className="text-slate-600 font-bold">100% (기준)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-2xl h-9 overflow-hidden p-1 border border-slate-200">
                  <div className="bg-slate-700 h-full rounded-xl w-full flex items-center justify-end px-4 text-xs font-black text-white">
                    136.5g CO₂ (100%)
                  </div>
                </div>
              </div>

              {/* Rail */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold text-slate-900">
                  <span className="flex items-center gap-2">
                    <Train className="w-5 h-5 text-[#005C2B]" />
                    <span>철도 수송 (화물 열차: 23.2g CO₂/ton·km)</span>
                  </span>
                  <span className="text-[#005C2B] font-bold">17.0% (83.0% 감축)</span>
                </div>
                <div className="w-full bg-emerald-50 rounded-2xl h-9 overflow-hidden p-1 border border-emerald-200">
                  <div className="bg-[#005C2B] h-full rounded-xl w-[17%] min-w-[60px] flex items-center justify-end px-2 text-xs font-black text-white shadow-md">
                    23.2g
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/80 flex items-center space-x-3 text-slate-800">
              <CheckCircle2 className="w-6 h-6 text-[#005C2B] flex-shrink-0" />
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed break-words">
                철도 화물 수송으로 전환 시 톤·km 당 113.3g의 CO₂를 절감할 수 있으며, 기업 ESG 평가 및 Scope 3 공시 대응에 직결됩니다.
              </p>
            </div>
          </div>

          {/* ESG 3 Pillars - 3D White Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 sm:gap-5 h-full">
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/70 border border-slate-200/80 flex-1 flex flex-col justify-center space-y-2 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black italic text-emerald-800">Environment</span>
                <Leaf className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 break-words">
                온실가스 감축, 에너지 효율 향상, 탄소중립 실현 기여
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/70 border border-slate-200/80 flex-1 flex flex-col justify-center space-y-2 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black italic text-sky-800">Social</span>
                <Users className="w-6 h-6 text-sky-600" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 break-words">
                도로 교통 혼잡 완화, 교통사고 위험 감소, 공공 안전 확보
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/70 border border-slate-200/80 flex-1 flex flex-col justify-center space-y-2 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-black italic text-amber-800">Governance</span>
                <Building2 className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 break-words">
                투명한 정시 운송 관리, 공공 물류망 안정성 확보, 친환경 공급망 구축
              </p>
            </div>
          </div>

        </div>

        {/* 3. Carbon Savings Calculator - 3D White Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/80 space-y-8 text-slate-900">
          <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#005C2B]">
              <Calculator className="w-6 h-6 text-[#005C2B]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                탄소 절감량 실시간 계산기
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                화물 중량과 운송 거리를 설정하여 철도 수송 전환 시 기대되는 탄소 절감 효과를 실시간으로 확인하세요.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80">
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-800 mb-2">
                  <span>화물 중량 (톤)</span>
                  <span className="text-[#005C2B] font-black font-mono text-base">{cargoWeightTon} Ton</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={cargoWeightTon}
                  onChange={(e) => setCargoWeightTon(Number(e.target.value))}
                  className="w-full accent-[#005C2B] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>10 Ton</span>
                  <span>250 Ton</span>
                  <span>500 Ton</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm font-bold text-slate-800 mb-2">
                  <span>운송 거리 (km)</span>
                  <span className="text-[#005C2B] font-black font-mono text-base">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#005C2B] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>50 km</span>
                  <span>400 km</span>
                  <span>800 km</span>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-6 bg-emerald-50/80 text-slate-900 p-6 rounded-2xl border border-emerald-200/80 shadow-md space-y-4">
              <span className="text-xs font-extrabold text-[#005C2B] block uppercase tracking-wider">
                철도 수송 전환 절감 성과 (ESTIMATED SAVINGS)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-sm">
                  <span className="text-xs text-slate-600 block font-bold mb-1">CO₂ 탄소 절감량</span>
                  <strong className="text-2xl sm:text-3xl font-black text-[#005C2B] font-mono">
                    {co2SavedKg.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} <span className="text-sm font-bold text-slate-700">kg</span>
                  </strong>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-sm">
                  <span className="text-xs text-slate-600 block font-bold mb-1">소나무 식재 대체 효과</span>
                  <strong className="text-2xl sm:text-3xl font-black text-[#005C2B] font-mono flex items-center gap-1.5">
                    <TreePine className="w-6 h-6 text-emerald-600" />
                    {pineTreesCount.toLocaleString()} <span className="text-sm font-bold text-slate-700">그루</span>
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Calculation Basis & Formula Info Box */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <Info className="w-5 h-5 text-[#005C2B]" />
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  탄소 절감량 산출 근거 및 계산 공식 안내
                </h3>
              </div>
              <button
                onClick={() => setShowBasisDetail(!showBasisDetail)}
                className="text-xs text-[#005C2B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showBasisDetail ? '간단히 보기' : '자세히 보기'}
              </button>
            </div>

            {showBasisDetail && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed pt-1">
                {/* Formula */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="font-black text-[#005C2B] flex items-center gap-1.5 text-xs">
                    <Calculator className="w-4 h-4 text-[#005C2B]" />
                    탄소 절감량 계산식
                  </span>
                  <p className="text-slate-800 font-medium font-mono text-[11px] leading-snug bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    [ (도로 트럭 배출 계수 - 철도 열차 배출 계수) × 화물 중량(Ton) × 운송 거리(km) ] ÷ 1,000
                  </p>
                </div>

                {/* Emission Factors */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="font-black text-[#005C2B] flex items-center gap-1.5 text-xs">
                    <FileText className="w-4 h-4 text-[#005C2B]" />
                    적용 배출 계수 (환경부 / GIR 기준)
                  </span>
                  <ul className="text-slate-700 space-y-1 font-medium text-[11px]">
                    <li className="flex justify-between">
                      <span>• 도로 화물 트럭:</span>
                      <strong className="text-slate-900 font-mono">136.5g CO₂ / ton·km</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>• 철도 화물 열차:</span>
                      <strong className="text-[#005C2B] font-mono">23.2g CO₂ / ton·km</strong>
                    </li>
                    <li className="text-[#005C2B] font-bold text-right pt-0.5">
                      ➔ 철도 수송 시 약 83.0% 온실가스 감축
                    </li>
                  </ul>
                </div>

                {/* Pine Tree Standard */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <span className="font-black text-[#005C2B] flex items-center gap-1.5 text-xs">
                    <TreePine className="w-4 h-4 text-[#005C2B]" />
                    소나무 식재 효과 산정 기준
                  </span>
                  <p className="text-slate-700 font-medium text-[11px]">
                    30년생 중부지방 소나무 1그루당 연간 CO₂ 흡수량 <strong className="text-[#005C2B] font-mono">약 6.6kg</strong>을 기준으로 환산하여 산출합니다. (국립산림과학원 공시 데이터 기준)
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 5. Certificate Request - 3D White Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/80 text-slate-900 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left w-full lg:w-auto">
            <div className="inline-flex items-center space-x-2 text-[#005C2B] text-xs font-black bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Award className="w-4 h-4 text-[#005C2B]" />
              <span>ESG CERTIFICATE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              녹색철도 ESG 탄소감축 인증서 발급
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium break-words max-w-xl">
              기업의 철도 화물 이용 실적을 검증하여 Scope 3 공인 제출용 ESG 인증서를 발급해 드립니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <input
              type="text"
              value={certCompanyName}
              onChange={(e) => setCertCompanyName(e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-bold bg-slate-50 text-slate-900 placeholder-slate-400 w-full sm:w-64 focus:bg-white focus:outline-none focus:border-[#005C2B] focus:ring-2 focus:ring-emerald-500/20"
              placeholder="기업명을 입력하세요"
            />
            <button
              onClick={() => alert(`[발급 신청] ${certCompanyName} 대상 ESG 탄소감축 인증서 발급 신청이 접수되었습니다.`)}
              className="px-6 py-3.5 bg-[#005C2B] hover:bg-[#004721] text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-900/20 flex-shrink-0 transition-all cursor-pointer w-full sm:w-auto text-center"
            >
              인증서 신청
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
