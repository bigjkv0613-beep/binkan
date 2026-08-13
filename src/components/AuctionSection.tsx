import React, { useState, useEffect, useRef } from 'react';
import { AuctionItem, BidHistory, Language } from '../types';
import { INITIAL_AUCTIONS } from '../data/mockData';
import { 
  Sparkles, Clock, Flame, Tag, TrendingDown, CheckCircle2, 
  ArrowDownRight, UserCheck, Building2, Store, ShieldCheck, 
  Zap, Box, Truck, CreditCard, Calculator, Info, Check, ArrowRight,
  ChevronRight, ChevronLeft, Calendar, MapPin, Package, Shield, TruckIcon,
  Search, ChevronDown, ArrowRightLeft, X, AlertTriangle, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateKorailFreight } from '../utils/korailFreight';

export interface RailStation {
  id: string;
  name: string;
  region: string;
  type: 'ICD' | '철도물류역' | '항만연계역';
  code: string;
  desc: string;
}

export const MAJOR_RAIL_STATIONS: RailStation[] = [
  { id: 'ST-01', name: '의왕ICD', region: '수도권', type: 'ICD', code: 'UW-ICD', desc: '수도권 대표 내륙컨테이너기지' },
  { id: 'ST-02', name: '오봉역', region: '수도권', type: '철도물류역', code: 'OB-ST', desc: '수도권 주요 철도 화물 취급역' },
  { id: 'ST-03', name: '부산신항역', region: '영남권', type: '항만연계역', code: 'BSN-ST', desc: '부산신항 해양컨테이너 연계역' },
  { id: 'ST-04', name: '부산진역', region: '영남권', type: '철도물류역', code: 'BSJ-ST', desc: '부산 도심 및 항만물류 거점' },
  { id: 'ST-05', name: '대전조차장역', region: '충청권', type: '철도물류역', code: 'DJ-ST', desc: '중부권 철도 물류 허브' },
  { id: 'ST-06', name: '광양항역', region: '호남권', type: '항만연계역', code: 'GYH-ST', desc: '광양항 컨테이너 및 철강 수송' },
  { id: 'ST-07', name: '신광양항역', region: '호남권', type: '항만연계역', code: 'SGY-ST', desc: '광양항 신부두 연계 물류역' },
  { id: 'ST-08', name: '도담역', region: '충청권', type: '철도물류역', code: 'DD-ST', desc: '충북 시멘트·벌크 화물 기지' },
  { id: 'ST-09', name: '충주역', region: '충청권', type: '철도물류역', code: 'CJ-ST', desc: '충북 중부권 화물 거점' },
  { id: 'ST-10', name: '인천항역', region: '수도권', type: '항만연계역', code: 'ICH-ST', desc: '인천항 수출입 화물 연계' },
  { id: 'ST-11', name: '동해역', region: '강원권', type: '철도물류역', code: 'DH-ST', desc: '강원 시멘트, 광물, 무연탄' },
  { id: 'ST-12', name: '괴동역', region: '영남권', type: '철도물류역', code: 'GD-ST', desc: '포항 제철·철강화물 전문역' },
  { id: 'ST-13', name: '약목역', region: '영남권', type: 'ICD', code: 'YM-ST', desc: '영남권 내륙물류기지 (약목ICD)' },
  { id: 'ST-14', name: '울산신항역', region: '영남권', type: '항만연계역', code: 'USH-ST', desc: '울산 석유화학 및 자동차부품' },
  { id: 'ST-15', name: '태화강역', region: '영남권', type: '철도물류역', code: 'THG-ST', desc: '울산 산업단지 철도물류' },
  { id: 'ST-16', name: '군산옥구역', region: '호남권', type: '항만연계역', code: 'GSO-ST', desc: '군산항 및 산업단지 물류' },
  { id: 'ST-17', name: '신창원역', region: '영남권', type: '철도물류역', code: 'SCW-ST', desc: '창원 중공업 및 철도차량' },
  { id: 'ST-18', name: '동익산역', region: '호남권', type: '철도물류역', code: 'DIS-ST', desc: '호남권 화물 분기 허브' },
  { id: 'ST-19', name: '광주송정역', region: '호남권', type: '철도물류역', code: 'GJS-ST', desc: '호남 중심권 화물 수송' },
  { id: 'ST-20', name: '장항역', region: '충청권', type: '철도물류역', code: 'JH-ST', desc: '충남 서해안 화물 기지' },
];

export const getDistanceBetweenStations = (origin: string, dest: string): number => {
  const o = (origin || '').trim();
  const d = (dest || '').trim();

  if (!o || !d) return 300;

  if ((o.includes('의왕') || o.includes('오봉')) && (d.includes('부산신항') || d.includes('부산진'))) return 380;
  if ((d.includes('의왕') || d.includes('오봉')) && (o.includes('부산신항') || o.includes('부산진'))) return 380;

  if ((o.includes('의왕') || o.includes('오봉')) && (d.includes('광양') || d.includes('신광양'))) return 340;
  if ((d.includes('의왕') || d.includes('오봉')) && (o.includes('광양') || o.includes('신광양'))) return 340;

  if (o.includes('대전') && (d.includes('부산신항') || d.includes('부산진'))) return 280;
  if (d.includes('대전') && (o.includes('부산신항') || o.includes('부산진'))) return 280;

  if ((o.includes('충주') && d.includes('도담')) || (o.includes('도담') && d.includes('충주'))) return 120;
  if (o.includes('괴동') && (d.includes('의왕') || d.includes('오봉'))) return 350;
  if (o.includes('인천') && d.includes('부산')) return 410;
  if (o.includes('약목') && d.includes('부산')) return 150;
  if ((o.includes('울산') || o.includes('태화강')) && (d.includes('의왕') || d.includes('오봉'))) return 370;

  const findStation = (name: string) => MAJOR_RAIL_STATIONS.find(s => s.name === name || name.includes(s.name) || s.name.includes(name));
  const stOrigin = findStation(o);
  const stDest = findStation(d);

  if (stOrigin && stDest) {
    if (stOrigin.name === stDest.name) return 100;
    if (stOrigin.region === stDest.region) return 120;
    if ((stOrigin.region === '수도권' && stDest.region === '영남권') || (stOrigin.region === '영남권' && stDest.region === '수도권')) return 380;
    if ((stOrigin.region === '수도권' && stDest.region === '호남권') || (stOrigin.region === '호남권' && stDest.region === '수도권')) return 340;
    if ((stOrigin.region === '충청권' && stDest.region === '영남권') || (stOrigin.region === '영남권' && stDest.region === '충청권')) return 260;
    if ((stOrigin.region === '수도권' && stDest.region === '충청권') || (stOrigin.region === '충청권' && stDest.region === '수도권')) return 160;
  }

  return 320;
};

interface SearchableStationSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  badgeText?: string;
  accentColor?: 'green' | 'blue';
  isEng?: boolean;
}

const SearchableStationSelect: React.FC<SearchableStationSelectProps> = ({
  label,
  value,
  onChange,
  placeholder,
  badgeText,
  accentColor = 'green',
  isEng = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultPlaceholder = isEng
    ? 'Search station/ICD (e.g. Uiwang, Obong, Busan)'
    : '역 이름 또는 ICD 검색 (예: 의왕ICD, 오봉역, 부산신항역)';

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStations = MAJOR_RAIL_STATIONS.filter((st) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      st.name.toLowerCase().includes(q) ||
      st.region.toLowerCase().includes(q) ||
      st.type.toLowerCase().includes(q) ||
      st.desc.toLowerCase().includes(q) ||
      st.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (stationName: string) => {
    setQuery(stationName);
    onChange(stationName);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange(newQuery);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setIsOpen(true);
  };

  const ringColorClass = accentColor === 'green' 
    ? 'focus-within:ring-2 focus-within:ring-[#005C2B] focus-within:border-[#005C2B]' 
    : 'focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600';

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
          <MapPin className={`w-3.5 h-3.5 ${accentColor === 'green' ? 'text-[#005C2B]' : 'text-blue-600'}`} />
          <span>{label}</span>
        </label>
        {badgeText && (
          <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {badgeText}
          </span>
        )}
      </div>

      <div
        className={`relative flex items-center bg-white border border-slate-300 rounded-2xl shadow-sm transition-all duration-200 ${ringColorClass}`}
      >
        <div className="pl-3.5 text-slate-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          placeholder={placeholder || defaultPlaceholder}
          className="w-full py-3 pl-2.5 pr-16 bg-transparent text-sm font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />

        <div className="absolute right-2 flex items-center space-x-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              title={isEng ? 'Clear search' : '검색어 지우기'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
            title={isEng ? 'Toggle list' : '목록 열기/닫기'}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown List Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100"
          >
            <div className="p-2.5 bg-slate-50 text-[11px] font-extrabold text-slate-500 flex items-center justify-between border-b border-slate-100">
              <span>
                {isEng
                  ? `Select Rail Terminal / ICD (${filteredStations.length} found)`
                  : `철도물류역 / ICD 선택 (${filteredStations.length}개 검색됨)`}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {isEng ? 'Direct keyboard entry allowed' : '직접 키보드로 입력 가능'}
              </span>
            </div>

            {filteredStations.length > 0 ? (
              filteredStations.map((st) => {
                const isSelected = value === st.name;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelect(st.name)}
                    className={`w-full text-left p-3 flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50/80 text-emerald-950 font-black' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black">{st.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                          st.type === 'ICD' 
                            ? 'bg-blue-100 text-blue-800' 
                            : st.type === '항만연계역' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {st.type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {st.region}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {st.desc}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#005C2B] flex-shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                  검색 결과에 일치하는 추천역이 없습니다.
                </p>
                {query.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSelect(query.trim())}
                    className="w-full p-2.5 bg-emerald-50 text-[#005C2B] border border-emerald-200 rounded-xl text-xs font-black hover:bg-emerald-100 transition-colors"
                  >
                    + '{query.trim()}' (직접 입력 역명으로 지정하기)
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AuctionSectionProps {
  lang?: Language;
}

export const AuctionSection: React.FC<AuctionSectionProps> = ({ lang = 'KO' }) => {
  const isEng = lang === 'ENG';
  // Step Wizard State (1: 수송 유형, 2: 노선 및 화물, 3: 수량 및 날짜, 4: 부가서비스 및 최종견적)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 1단계: 수송 유형 선택 ('enterprise': 전세 화물 FCL, 'sme': 소량 화물 LCL)
  const [userType, setUserType] = useState<'enterprise' | 'sme'>('enterprise');

  // 2단계: 노선 및 화물 정보 (Searchable Dropdown State)
  const [originStation, setOriginStation] = useState<string>('의왕ICD');
  const [destinationStation, setDestinationStation] = useState<string>('부산신항역');
  const [cargoType, setCargoType] = useState<string>('수출입 컨테이너 (General Box)');

  // 3단계: 수량/용량 및 출발 희망일
  // 전세 화물 (FCL) State
  const [entCarCount, setEntCarCount] = useState<number>(5); // 화차 수량 (1량 단위)
  const [entWeight, setEntWeight] = useState<number>(120);   // 화물 중량 (1톤 단위)
  const [entDistance, setEntDistance] = useState<number>(380); // 수송 거리 (km, 최저 100km 기준)

  // Auto calculate distance whenever origin or destination changes
  useEffect(() => {
    const dist = getDistanceBetweenStations(originStation, destinationStation);
    setEntDistance(dist);
  }, [originStation, destinationStation]);

  const handleSwapStations = () => {
    const temp = originStation;
    setOriginStation(destinationStation);
    setDestinationStation(temp);
  };

  // 소량 화물 (LCL) State
  const [smeQuantity, setSmeQuantity] = useState<number>(4);        // 화물 수량 (개/파레트)
  const [smeUnitCbm, setSmeUnitCbm] = useState<number>(1.5);        // 개당 부피 (CBM)
  const [smeUnitWeight, setSmeUnitWeight] = useState<number>(300);   // 개당 중량 (kg)

  // 총 부피 및 총 중량 계산
  const totalSmeCbm = Number((smeQuantity * smeUnitCbm).toFixed(2));
  const totalSmeWeight = Math.round(smeQuantity * smeUnitWeight);

  // 기존 호환 변수
  const smeCbm = totalSmeCbm;
  const smeWeight = totalSmeWeight;

  // 출발 및 복귀 희망일 State (왕복 지원)
  const defaultDepartureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultReturnDate = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [departureDate, setDepartureDate] = useState<string>(defaultDepartureDate);
  const [departureTime, setDepartureTime] = useState<string>('14:00'); // 가는 날 출발 예정 시각

  const [returnDate, setReturnDate] = useState<string>(defaultReturnDate);   // 오는 날 복귀 예정일
  const [returnTime, setReturnTime] = useState<string>('14:00');   // 오는 날 복귀 예정 시각

  const [isUrgent5hToggle, setIsUrgent5hToggle] = useState<boolean>(false); // 5시간 이내 긴급 수송 수동 선택

  // 4단계: 부가 서비스 (카카오 T 연계) 및 왕복 할인
  const [kakaoFirstMile, setKakaoFirstMile] = useState<boolean>(true); // 카카오 T 퀵/화물 퍼스트마일
  const [kakaoLastMile, setKakaoLastMile] = useState<boolean>(true);   // 카카오 T 라스트마일
  const [safetyInsurance, setSafetyInsurance] = useState<boolean>(true); // 안심 보장 보험 (기본 무료)
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);      // 왕복 운송 예약 (20% 할인 적용)

  // departureDate 변경 시 returnDate 자동 최소 조정 (가는 날보다 뒤로 설정)
  useEffect(() => {
    if (departureDate && returnDate && returnDate < departureDate) {
      const dep = new Date(departureDate);
      dep.setDate(dep.getDate() + 3);
      setReturnDate(dep.toISOString().split('T')[0]);
    }
  }, [departureDate]);

  // Auctions & Bidding Board State
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(200000);
  const [bidQuantity, setBidQuantity] = useState<number>(2);
  const [companyName, setCompanyName] = useState<string>('(주)동서글로벌물류');

  const [bidHistories, setBidHistories] = useState<BidHistory[]>([
    {
      id: 'BH-01',
      auctionId: 'AUC-2026-0801',
      company: 'CJ대한통운(주)',
      bidAmountTeu: 245000,
      quantityTeu: 4,
      timestamp: '3분 전',
    },
    {
      id: 'BH-02',
      auctionId: 'AUC-2026-0801',
      company: 'LX판토스',
      bidAmountTeu: 260000,
      quantityTeu: 6,
      timestamp: '12분 전',
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState<boolean>(false);
  const [hasEmptySlot, setHasEmptySlot] = useState<boolean>(true); // 빈칸 유무 상태 (true: 빈칸 있음, false: 빈칸 없음)
  const [showNoSlotModal, setShowNoSlotModal] = useState<boolean>(false); // 빈칸 없음 및 대체 카드 안내 모달
  const [isSlotSelectionPage, setIsSlotSelectionPage] = useState<boolean>(false); // 특가 신청 시 인근 시간대 유휴공간 목록 화면 오픈 여부
  const [submittedEcoResult, setSubmittedEcoResult] = useState<{
    treesSaved: number;
    routeText: string;
    typeText: string;
    amountText: string;
    scheduleText: string;
  } | null>(null);

  // Countdown timer effect
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newRemaining: { [key: string]: string } = {};
      auctions.forEach((auc) => {
        const diffMs = new Date(auc.endsAt).getTime() - Date.now();
        if (diffMs <= 0) {
          newRemaining[auc.id] = '경매 마감';
        } else {
          const mins = Math.floor(diffMs / (1000 * 60));
          const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
          newRemaining[auc.id] = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
      });
      setTimeRemaining(newRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctions]);

  // -------------------------------------------------------------
  // 출발 5시간 전~출발 시점 유휴공간 '빈칸 특가' 오픈 여부 판정 로직
  // (여유 있게 미리 예약: 정상 운임 가격 / 출발 5시간 전~출발 시점: 빈칸 특가 할인)
  // -------------------------------------------------------------
  const isOpenSpecialDiscount = (() => {
    if (isUrgent5hToggle) return true; // 수동으로 5시간 이내 직전 예약 특가 선택 시
    if (!departureDate) return false;
    try {
      const now = Date.now();
      
      // 1. 가는 날 체크: 출발 시점과 현재 시간 차이 (hours)
      const depTargetStr = `${departureDate}T${departureTime || '12:00'}:00`;
      const depTargetTime = new Date(depTargetStr).getTime();
      const depDiffHours = (depTargetTime - now) / (1000 * 60 * 60);
      
      // 출발 5시간 전부터 출발 시점까지 (0 <= depDiffHours <= 5) 남아있는 유휴공간에 빈칸 특가 적용
      if (depDiffHours >= 0 && depDiffHours <= 5) return true;

      // 2. 왕복 선택 시 오는 날 체크
      if (isRoundTrip && returnDate) {
        const retTargetStr = `${returnDate}T${returnTime || '12:00'}:00`;
        const retTargetTime = new Date(retTargetStr).getTime();
        const retDiffHours = (retTargetTime - now) / (1000 * 60 * 60);
        if (retDiffHours >= 0 && retDiffHours <= 5) return true;
      }

      return false;
    } catch {
      return false;
    }
  })();

  // -------------------------------------------------------------
  // Calculations for Step 4 & Summaries (KORAIL Official Freight Rate Engine)
  // -------------------------------------------------------------
  const actualEntDistance = Math.max(100, Math.round(entDistance || 100));

  // 1. Enterprise / FCL Calculation (Full Wagon / Container)
  const isContainerCargo = cargoType.includes('컨테이너');

  const entFreightResult = calculateKorailFreight(
    isContainerCargo
      ? {
          cargoCategory: 'container',
          containerSize: '20ft',
          distanceKm: actualEntDistance,
          quantity: entCarCount,
          isEmptyContainer: false,
        }
      : {
          cargoCategory: 'general',
          item: cargoType,
          distanceKm: actualEntDistance,
          weightTon: entWeight,
          carCount: entCarCount,
        }
  );

  const entStandardFreight = entFreightResult.pureFreight;
  const entDiscountRate = 0.35; // 35% 할인
  const entMinBidFreight = Math.round((entStandardFreight * (1 - entDiscountRate)) / 100) * 100;
  const entSavings = entStandardFreight - entMinBidFreight;

  // 2. SME / LCL Calculation
  const weightInTon = smeWeight / 1000;
  const chargeableCbm = Math.max(smeCbm, Math.ceil(weightInTon * 3.5)); // 1톤 = 약 3.5 CBM 표준 환산
  // 수량 및 부피/중량(chargeableCbm) 비례 LCL 점유율 산정
  const lclRatio = Math.min(1, Math.max(0.08, chargeableCbm / 30));
  const lclBaseResult = calculateKorailFreight({
    cargoCategory: 'container',
    containerSize: '20ft',
    distanceKm: actualEntDistance,
    quantity: 1,
  });
  const smeStandardFreight = Math.round((lclBaseResult.pureFreight * lclRatio) / 100) * 100;
  const smeDiscountRate = 0.38; // 38% 할인
  const smeMinBidFreight = Math.round((smeStandardFreight * (1 - smeDiscountRate)) / 100) * 100;
  const smeSavings = smeStandardFreight - smeMinBidFreight;

  // 3. 편도 기준 기본 운임 및 특가 할인액 결정 (출발 5시간 전~출발 시점 유휴공간 특가)
  const oneWayStandardFreight = userType === 'enterprise' ? entStandardFreight : smeStandardFreight;
  
  // 출발 5시간 전~출발 시점 유휴공간에만 빈칸 특가 적용 (미리 여유 있게 예약 시 정상 운임 가격)
  const oneWaySpecialFreight = isOpenSpecialDiscount ? (userType === 'enterprise' ? entMinBidFreight : smeMinBidFreight) : oneWayStandardFreight;
  const oneWaySpecialSavings = isOpenSpecialDiscount ? (userType === 'enterprise' ? entSavings : smeSavings) : 0;

  // 4. 왕복 수송 (2회) 여부 및 20% 추가 할인 산정 (철도 운임료 100원 단위 반올림 적용)
  const tripMultiplier = isRoundTrip ? 2 : 1;
  const totalStandardFreight = oneWayStandardFreight * tripMultiplier; // 기존 표준 철도 운임료
  const totalSpecialFreight = oneWaySpecialFreight * tripMultiplier; // 특가/정상 철도 순수 운임료
  const totalSpecialSavings = oneWaySpecialSavings * tripMultiplier;

  // 왕복 운송 선택 시: 카카오 T 연계 배송비 등 부대비용을 제외한 "철도 순수 운임료(totalSpecialFreight)"에 한해 20% 추가 할인 (100원 단위 반올림)
  const roundTripDiscountAmount = isRoundTrip ? Math.round((totalSpecialFreight * 0.20) / 100) * 100 : 0;
  const finalTransportFreight = totalSpecialFreight - roundTripDiscountAmount;

  // 5. Kakao T Addons Fee (카카오 T 연계 택배/배송비 - 화물 수량 및 무게 실시간 연동)
  // LCL 소량 화물의 경우, 수량(smeQuantity)과 총 무게(smeWeight)에 비례한 택배/픽업 연계비 산정
  const lclKakaoSingleFee = Math.round((
    smeQuantity * Math.max(6000, 14000 - smeQuantity * 350) + Math.floor(smeWeight / 100) * 1200
  ) / 100) * 100;

  const kakaoSingleMileFee = (userType === 'enterprise') ? 35000 : lclKakaoSingleFee;

  const kakaoAddonFee = (kakaoFirstMile ? kakaoSingleMileFee : 0) + (kakaoLastMile ? kakaoSingleMileFee : 0);

  // 최종 결제 견적 금액 (철도 할인가 + 부대비용, 100원 단위)
  const totalFinalEstimate = finalTransportFreight + kakaoAddonFee;

  // Handlers for Navigation
  const handleNextStep = () => {
    setIsSlotSelectionPage(false);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setIsSlotSelectionPage(false);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit Final Special Bid Application (4단계 완료 - [신청하기])
  const handleCompleteBidApplication = () => {
    setIsSubmittingApp(true);
    setSubmittedEcoResult(null);
    setShowNoSlotModal(false);
    setIsSlotSelectionPage(false);

    const calculatedTrees = Math.max(16, Math.round((userType === 'enterprise' ? entWeight : smeWeight) * (actualEntDistance || 100) * 0.00085 * (isRoundTrip ? 2 : 1)));
    const routeText = `${originStation || '의왕ICD'} ➔ ${destinationStation || '부산신항역'} (${actualEntDistance}km)`;
    const typeText = `${userType === 'enterprise' ? '전세 화물 (FCL)' : '소량 화물 (LCL)'} (${isRoundTrip ? '🔄 왕복 수송' : '➡️ 편도 수송'})`;
    const amountText = `${totalFinalEstimate.toLocaleString()}원`;
    const scheduleText = isRoundTrip
      ? `가는 날: ${departureDate} ${departureTime} / 오는 날: ${returnDate} ${returnTime}`
      : `출발일: ${departureDate} ${departureTime}`;

    // 1.5초 매칭 로딩 후 운임 타입 판정
    setTimeout(() => {
      setIsSubmittingApp(false);

      // 1. 빈칸 유무 테스트에서 빈칸 없음인 경우 -> 빈칸 없음 안내 및 대체 공간 목록 모달
      if (!hasEmptySlot) {
        setShowNoSlotModal(true);
        return;
      }

      // 2. [특가 운임 신청인 경우 (isOpenSpecialDiscount === true)]
      // 바로 4단계에서 유휴 공간 선택 화면 (isSlotSelectionPage = true)으로 전환
      if (isOpenSpecialDiscount) {
        setIsSlotSelectionPage(true);
        setToastMessage(`[유휴 공간 조회 성공] 신청하신 노선 인근의 실시간 빈칸 특가 열차 목록이 열렸습니다.`);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        // 3. [정상 운임 신청인 경우 (isOpenSpecialDiscount === false)]
        // 기존처럼 바로 사전 예약 정상 완료 처리 및 친환경 ESG 성과 모달 출력
        setSubmittedEcoResult({
          treesSaved: calculatedTrees,
          routeText,
          typeText: `${typeText} (정상 사전 예약)`,
          amountText,
          scheduleText,
        });

        const newHist: BidHistory = {
          id: `BH-${Date.now()}`,
          auctionId: auctions[0]?.id || 'AUC-2026-0801',
          company: userType === 'enterprise' ? '(주)동서글로벌물류 (전세)' : '유한회사 한성물류 (소량)',
          bidAmountTeu: userType === 'enterprise' ? Math.round(entMinBidFreight / entCarCount) : smeMinBidFreight,
          quantityTeu: userType === 'enterprise' ? entCarCount : 1,
          timestamp: '방금 전',
        };
        setBidHistories((prev) => [newHist, ...prev]);

        setToastMessage(`[사전 예약 정상 완료] ${typeText} / ${routeText} (${amountText}) 예약이 확정되었습니다.`);
        setTimeout(() => {
          setToastMessage(null);
        }, 5000);
      }
    }, 1500);
  };

  // 인근 시간대 유휴 공간 슬롯 선택 확정 핸들러
  const handleConfirmSpecialSlot = (slot: {
    time: string;
    dateStr: string;
    label: string;
    discountText: string;
    remainingTeu: number;
  }) => {
    setIsSlotSelectionPage(false);
    setDepartureTime(slot.time);

    setIsSubmittingApp(true);
    setToastMessage(`[유휴 공간 확정] ${slot.dateStr} ${slot.time} (${slot.label}) 빈칸 특가로 최종 신청합니다.`);

    setTimeout(() => {
      setIsSubmittingApp(false);

      const calculatedTrees = Math.max(16, Math.round((userType === 'enterprise' ? entWeight : smeWeight) * (actualEntDistance || 100) * 0.00085 * (isRoundTrip ? 2 : 1)));
      const routeText = `${originStation || '의왕ICD'} ➔ ${destinationStation || '부산신항역'} (${actualEntDistance}km)`;
      const typeText = `${userType === 'enterprise' ? '전세 화물 (FCL)' : '소량 화물 (LCL)'} (${isRoundTrip ? '🔄 왕복 수송' : '➡️ 편도 수송'})`;
      const amountText = `${totalFinalEstimate.toLocaleString()}원`;
      const scheduleText = isRoundTrip
        ? `가는 날: ${departureDate} ${slot.time} / 오는 날: ${returnDate} ${returnTime}`
        : `출발일: ${slot.dateStr} ${slot.time}`;

      setSubmittedEcoResult({
        treesSaved: calculatedTrees,
        routeText,
        typeText: `${typeText} [🔥 ${slot.label} - ${slot.discountText}]`,
        amountText,
        scheduleText,
      });

      const newHist: BidHistory = {
        id: `BH-${Date.now()}`,
        auctionId: auctions[0]?.id || 'AUC-2026-0801',
        company: userType === 'enterprise' ? '(주)동서글로벌물류 (전세)' : '유한회사 한성물류 (소량)',
        bidAmountTeu: userType === 'enterprise' ? Math.round(entMinBidFreight / entCarCount) : smeMinBidFreight,
        quantityTeu: userType === 'enterprise' ? entCarCount : 1,
        timestamp: '방금 전',
      };
      setBidHistories((prev) => [newHist, ...prev]);

      setToastMessage(`[빈칸 특가 확정 완료] ${slot.dateStr} ${slot.time} 유휴 공간 특가 신청이 완료되었습니다!`);
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }, 1200);
  };

  // 대체 유휴 공간 선택 처리 핸들러
  const handleSelectAlternativeSlot = (alt: {
    origin: string;
    dest: string;
    time: string;
    dateStr: string;
  }) => {
    setShowNoSlotModal(false);
    setOriginStation(alt.origin);
    setDestinationStation(alt.dest);
    setDepartureTime(alt.time);
    setHasEmptySlot(true); // 선택한 대체 빈칸으로 적용 후 성공 상태 전환

    setToastMessage(`[대체 빈칸 선택 완료] ${alt.origin} ➔ ${alt.dest} (${alt.dateStr} ${alt.time}) 유휴 공간으로 재신청합니다.`);

    // 0.5초 후 바로 매칭 로딩 실행 후 완료 모달
    setTimeout(() => {
      setIsSubmittingApp(true);
      setTimeout(() => {
        setIsSubmittingApp(false);
        const calculatedTrees = Math.max(16, Math.round((userType === 'enterprise' ? entWeight : smeWeight) * (actualEntDistance || 100) * 0.00085 * (isRoundTrip ? 2 : 1)));
        const routeText = `${alt.origin} ➔ ${alt.dest} (${actualEntDistance}km)`;
        const typeText = `${userType === 'enterprise' ? '전세 화물 (FCL)' : '소량 화물 (LCL)'} (${isRoundTrip ? '🔄 왕복 수송' : '➡️ 편도 수송'})`;
        const amountText = `${totalFinalEstimate.toLocaleString()}원`;
        const scheduleText = isRoundTrip
          ? `가는 날: ${departureDate} ${alt.time} / 오는 날: ${returnDate} ${returnTime}`
          : `출발일: ${alt.dateStr} ${alt.time}`;

        setSubmittedEcoResult({
          treesSaved: calculatedTrees,
          routeText,
          typeText,
          amountText,
          scheduleText,
        });
      }, 1500);
    }, 300);
  };

  const handleOpenBidModal = (auc: AuctionItem) => {
    setSelectedAuction(auc);
    setBidAmount(auc.currentLowestBid - 10000);
    if (userType === 'enterprise') {
      setBidQuantity(Math.min(entCarCount, auc.availableTeu));
      setCompanyName('(주)동서글로벌물류 (전세 화물)');
    } else {
      setBidQuantity(1);
      setCompanyName('유한회사 한성물류 (소량 화물)');
    }
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    if (bidAmount >= selectedAuction.currentLowestBid) {
      setToastMessage(`입찰가는 현재 최저가 (${selectedAuction.currentLowestBid.toLocaleString()}원)보다 낮아야 합니다.`);
      return;
    }

    const updated = auctions.map((auc) => {
      if (auc.id === selectedAuction.id) {
        return {
          ...auc,
          currentLowestBid: bidAmount,
          totalBids: auc.totalBids + 1,
        };
      }
      return auc;
    });

    setAuctions(updated);

    const newHist: BidHistory = {
      id: `BH-${Date.now()}`,
      auctionId: selectedAuction.id,
      company: companyName,
      bidAmountTeu: bidAmount,
      quantityTeu: bidQuantity,
      timestamp: '방금 전',
    };
    setBidHistories([newHist, ...bidHistories]);

    setToastMessage(`[${userType === 'enterprise' ? '전세 화물' : '소량 화물'} 역경매 입찰 성공] ${selectedAuction.routeTitle}에 최저가 입찰이 등록되었습니다!`);
    setSelectedAuction(null);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const stepTitles = [
    {
      num: 1,
      title: isEng ? 'Step 1 (Select Type)' : '1단계 (수송 유형 선택)',
      subtitle: isEng ? 'Charter FCL vs Consolidated LCL' : '전세 화물(FCL) vs 소량 화물(LCL)',
    },
    {
      num: 2,
      title: isEng ? 'Step 2 (Route & Cargo)' : '2단계 (노선 및 화물 정보)',
      subtitle: isEng ? 'Origin/Destination & Category' : '출발·도착 노선 및 화물 종류',
    },
    {
      num: 3,
      title: isEng ? 'Step 3 (Quantity & Date)' : '3단계 (수량 및 날짜 설정)',
      subtitle: isEng ? 'Wagons/Weight & Departure' : '화차 수량/톤수·CBM 및 출발일',
    },
    {
      num: 4,
      title: isEng ? 'Step 4 (Add-ons & Quote)' : '4단계 (부가 서비스 및 최종 견적)',
      subtitle: isEng ? 'Kakao T Link & Discount' : '카카오 T 연계 & 특가 요약',
    },
  ];

  return (
    <div className="pb-16 bg-[#F1F6F7] text-slate-800 min-h-screen">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#005C2B] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-emerald-400 font-extrabold text-sm flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Full-width Section Header Banner (Normal 4-step wizard header, hidden on slot selection page) */}
      {!isSlotSelectionPage && (
        <div className="w-full bg-[#0A1329] text-white py-10 px-4 sm:px-6 lg:px-10 border-b border-slate-800 shadow-xl mb-8">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 max-w-3xl z-10">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                <span>KORAIL REVERSE AUCTION MARKETPLACE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-3">
                <span>{isEng ? 'Apply for Vacancy Discount' : '빈칸 특가로 신청하기'}</span>
                <span className="bg-[#005C2B] text-emerald-200 text-xs px-3.5 py-1.5 rounded-full font-bold border border-emerald-400/50 shadow-md">
                  {isEng ? 'One-Click 4-Step Bidding Process' : '원클릭 4단계 입찰 프로세스'}
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                {isEng
                  ? 'Easily select remaining wagon capacity and TEU slots with our 4-step bidding process to check vacancy discount rates.'
                  : '화물열차의 잔여 여유 선로 및 TEU 슬롯을 4단계 맞춤 입찰 프로세스로 간편하게 선택하고 빈칸 특가 최저가 견적을 확인하세요.'}
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-lg flex-shrink-0 z-10">
              <Flame className="w-9 h-9 text-orange-400 animate-pulse" />
              <div>
                <div className="text-xs text-slate-300 font-bold">
                  {isEng ? 'Ending Soon Vacancy Deals' : '마감 임박 빈칸 특가'}
                </div>
                <div className="text-xl font-black text-emerald-300">
                  {isEng ? '4 Live Deals Active' : '실시간 4건 진행 중'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={isSlotSelectionPage ? "w-full px-4 sm:px-8 lg:px-12 space-y-6 pt-2 pb-12" : "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8"}>

        {/* STEP PROGRESS BAR (4단계 진행 상황 바 - 유휴 공간 선택 화면일 때는 숨김) */}
        {!isSlotSelectionPage && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stepTitles.map((st) => {
                const isActive = currentStep === st.num;
                const isCompleted = currentStep > st.num;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => {
                      setIsSlotSelectionPage(false);
                      setCurrentStep(st.num);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 border flex items-center space-x-3 cursor-pointer ${
                      isActive
                        ? 'bg-[#0A1329] text-white border-[#0A1329] shadow-lg ring-2 ring-[#0A1329]/20 font-bold'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md'
                        : isCompleted
                        ? 'bg-[#005C2B] text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4 text-white" /> : st.num}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="text-xs sm:text-sm font-extrabold truncate">
                        {st.title}
                      </div>
                      <div className={`text-[11px] truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {st.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* WIZARD CONTAINER WITH SMOOTH STEP TRANSITIONS */}
        <div className={isSlotSelectionPage ? "w-full space-y-6" : "bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-2xl space-y-8 min-h-[520px] flex flex-col justify-between"}>
          
          <AnimatePresence mode="wait">
            {/* STEP 1: 수송 유형 선택 ('전세 화물(FCL)'과 '소량 화물(LCL)' 커다란 탭 버튼 두 개만) */}
            {!isSlotSelectionPage && currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8 my-auto py-4"
              >
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-extrabold border border-blue-200">
                    <Building2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isEng ? 'Step 1 (Select Freight Type)' : '1단계 (수송 유형 선택)'}</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {isEng ? 'Please select your transport mode' : '수송 유형을 선택해 주세요'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {isEng
                      ? "Choose between 'Charter Freight (FCL)' and 'Consolidated Freight (LCL)' based on your shipment size."
                      : "'전세 화물(FCL)'과 '소량 화물(LCL)' 중 필요하신 수송 규모를 선택하세요."}
                  </p>
                </div>

                {/* 1단계: '전세 화물(FCL)'과 '소량 화물(LCL)' 중 하나를 선택하는 커다란 탭 버튼 두 개만 화면 중앙 배치 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Tab Button 1: 전세 화물 (FCL) */}
                  <button
                    type="button"
                    onClick={() => setUserType('enterprise')}
                    className={`p-8 rounded-3xl text-left transition-all duration-300 border-2 cursor-pointer flex flex-col justify-between space-y-6 shadow-md relative overflow-hidden group ${
                      userType === 'enterprise'
                        ? 'bg-emerald-50/90 text-slate-900 border-emerald-500 shadow-xl ring-4 ring-emerald-500/20 transform -translate-y-1'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-4.5 rounded-2xl ${
                        userType === 'enterprise' ? 'bg-[#005C2B] text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Building2 className="w-10 h-10" />
                      </div>
                      {userType === 'enterprise' && (
                        <span className="bg-[#005C2B] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                          <Check className="w-4 h-4" /> {isEng ? 'Selected' : '선택됨'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-extrabold tracking-widest text-[#005C2B] uppercase">
                        FCL FULL CARGO LOAD
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                        {isEng ? 'Charter Freight (FCL)' : '전세 화물 (FCL)'}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-700">
                        {isEng
                          ? 'Full wagon/container charter bidding (For bulk & large shipments)'
                          : '화차 및 컨테이너 전체 공간 전세 입찰 (대량 화물 전용)'}
                      </p>
                    </div>

                    <div className={`p-4 rounded-2xl text-xs space-y-2 ${
                      userType === 'enterprise' ? 'bg-emerald-100/70 border border-emerald-300/80 text-emerald-950' : 'bg-slate-50 border border-slate-200 text-slate-600'
                    }`}>
                      <div className="font-extrabold flex items-center gap-1.5 text-[#005C2B]">
                        <CheckCircle2 className="w-4 h-4 text-[#005C2B]" />
                        {isEng ? 'Key Features' : '주요 특징'}
                      </div>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>{isEng ? '1 wagon / block train charter shipping' : '1량 및 블록 단위 전체 화차 전세 수송'}</li>
                        <li>{isEng ? 'Up to 35% discount off standard tariff' : '표준 운임표 대비 최대 35% 특가 할인'}</li>
                        <li>{isEng ? 'Fixed line slot assignment supported' : '전용선로 고정 슬롯 배치 지원'}</li>
                      </ul>
                    </div>
                  </button>

                  {/* Tab Button 2: 소량 화물 (LCL) */}
                  <button
                    type="button"
                    onClick={() => setUserType('sme')}
                    className={`p-8 rounded-3xl text-left transition-all duration-300 border-2 cursor-pointer flex flex-col justify-between space-y-6 shadow-md relative overflow-hidden group ${
                      userType === 'sme'
                        ? 'bg-amber-50/90 text-slate-900 border-amber-500 shadow-xl ring-4 ring-amber-500/20 transform -translate-y-1'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`p-4.5 rounded-2xl ${
                        userType === 'sme' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Store className="w-10 h-10" />
                      </div>
                      {userType === 'sme' && (
                        <span className="bg-amber-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                          <Check className="w-4 h-4" /> {isEng ? 'Selected' : '선택됨'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-extrabold tracking-widest text-amber-800 uppercase">
                        LCL LESS THAN CONTAINER LOAD
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                        {isEng ? 'Consolidated Freight (LCL)' : '소량 화물 (LCL)'}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-700">
                        {isEng
                          ? 'Share train vacancy space & consolidated special rate bidding'
                          : '화물열차 잔여 여유 공간(빈칸) 공유 및 합적 특가 입찰'}
                      </p>
                    </div>

                    <div className={`p-4 rounded-2xl text-xs space-y-2 ${
                      userType === 'sme' ? 'bg-amber-100/70 border border-amber-300/80 text-amber-950' : 'bg-slate-50 border border-slate-200 text-slate-600'
                    }`}>
                      <div className="font-extrabold flex items-center gap-1.5 text-amber-800">
                        <Zap className="w-4 h-4 text-amber-700" />
                        {isEng ? 'Key Features' : '주요 특징'}
                      </div>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>{isEng ? 'Flexible consolidation starting from 1 CBM' : '1 CBM 소량 단위 자유로운 합적 신청'}</li>
                        <li>{isEng ? 'Up to 38% discount when matched with vacant slots' : '잔여 공간(빈칸) 매칭 시 38%↓ 특가'}</li>
                        <li>{isEng ? '100% bidding deposit waived' : '입찰 보증금 100% 면제 혜택'}</li>
                      </ul>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: 노선 및 화물 정보 */}
            {!isSlotSelectionPage && currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-extrabold border border-blue-200">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isEng ? 'Step 2 (Route & Cargo Info)' : '2단계 (노선 및 화물 정보)'}</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {isEng ? 'Select Origin/Destination & Cargo Category' : '출발지/목적지 노선 및 화물 종류 선택'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {isEng
                      ? 'Search or select stations and ICDs nationwide or type directly to specify your route.'
                      : '전국 철도물류역 및 ICD를 검색/선택하거나 직접 입력하여 출발지와 목적지를 지정하세요.'}
                  </p>
                </div>

                {/* 5시간 마감 규정 안내 렌더링 */}
                <div className="max-w-4xl mx-auto bg-amber-50/90 border-2 border-amber-300 p-4 sm:p-5 rounded-3xl flex items-start space-x-3.5 text-amber-950 shadow-sm">
                  <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-700 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-xs sm:text-sm space-y-1">
                    <div className="font-extrabold text-amber-950 flex items-center gap-2">
                      <span>⏱️ {isEng ? 'Idle Space Finalization Rule (5h before departure)' : '화물열차 유휴공간 확정(5시간 전) & 빈칸 특가 규정 안내'}</span>
                      <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        {isEng ? 'Required Rule' : '필독 규정'}
                      </span>
                    </div>
                    <p className="leading-relaxed text-amber-900/90 font-medium">
                      {isEng ? (
                        <>Freight train idle spaces and tracks are finalized <strong>5 hours prior to departure</strong>. Advance bookings apply <strong>standard tariffs</strong>, while remaining idle slots within 5 hours of departure open with <strong>vacancy special discounts (up to 38% off)</strong>.</>
                      ) : (
                        <>화물열차의 유휴공간 및 잔여 선로는 <strong>당일 운행 출발 5시간 전</strong>에 최종 확정됩니다. 여유 있게 미리 예약하시는 건은 <strong>'정상 운임 가격'</strong>이 적용되며, <strong>출발 5시간 전부터 출발 시점까지 남은 유휴공간에 한해 할인된 '빈칸 특가 (최대 38% 할인)'</strong> 예약이 오픈 적용됩니다.</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Section 1: Route Dropdowns */}
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <label className="block text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4.5 h-4.5 text-[#005C2B]" />
                        <span>{isEng ? 'Autocomplete Origin / Destination Select' : '자동완성 검색형 출발지 / 목적지 선택 (Dropdown)'}</span>
                      </label>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        {isEng ? 'Supports major ICDs & rail terminals' : '전국 주요 ICD 및 철도물류역 지원'}
                      </span>
                    </div>

                    {/* Dropdowns Row with Swap Button */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5">
                        <SearchableStationSelect
                          label={isEng ? 'Origin (Station / ICD)' : '출발지 (출발역 / ICD)'}
                          value={originStation}
                          onChange={(val) => setOriginStation(val)}
                          placeholder={isEng ? 'e.g., Uiwang ICD, Obong, Daejeon' : '예: 의왕ICD, 오봉역, 대전조차장'}
                          badgeText={isEng ? 'Origin' : '출발역'}
                          accentColor="green"
                          isEng={isEng}
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-center py-1">
                        <button
                          type="button"
                          onClick={handleSwapStations}
                          className="p-3 bg-white hover:bg-[#0A1329] text-slate-700 hover:text-white border border-slate-300 hover:border-[#0A1329] rounded-2xl shadow-sm transition-all duration-200 flex items-center gap-1.5 text-xs font-extrabold cursor-pointer group"
                          title={isEng ? 'Swap Origin / Destination' : '출발지 / 목적지 서로 바꾸기'}
                        >
                          <ArrowRightLeft className="w-4 h-4 text-[#005C2B] group-hover:text-emerald-400 transition-colors" />
                          <span className="hidden md:inline text-[11px]">{isEng ? 'Swap' : '맞교환'}</span>
                        </button>
                      </div>

                      <div className="md:col-span-5">
                        <SearchableStationSelect
                          label={isEng ? 'Destination (Station / ICD)' : '목적지 (도착역 / ICD)'}
                          value={destinationStation}
                          onChange={(val) => setDestinationStation(val)}
                          placeholder={isEng ? 'e.g., Busan Port, Gwangyang' : '예: 부산신항역, 광양항역, 부산진역'}
                          badgeText={isEng ? 'Destination' : '도착역'}
                          accentColor="blue"
                          isEng={isEng}
                        />
                      </div>
                    </div>

                    {/* Calculated Distance & Route Banner */}
                    <div className="p-4 bg-[#0A1329] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-inner">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>
                          {isEng ? 'Selected Route: ' : '선택한 지정 구간: '}<strong className="text-emerald-300 font-extrabold">{originStation || (isEng ? 'Unspecified' : '미지정')} ➔ {destinationStation || (isEng ? 'Unspecified' : '미지정')}</strong>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                        <span className="text-slate-300 font-medium">{isEng ? 'Est. Distance:' : '산정 수송 거리:'}</span>
                        <span className="text-sm font-black text-amber-300">{entDistance} km</span>
                      </div>
                    </div>

                    {/* Popular Preset Chips */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-extrabold text-slate-500 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isEng ? 'One-click popular route selection:' : '자주 찾는 인기 추천 노선 원클릭 선택:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { origin: '의왕ICD', dest: '부산신항역', label: isEng ? 'Uiwang ICD ➔ Busan Port (380km)' : '의왕ICD ➔ 부산신항역 (380km)' },
                          { origin: '오봉역', dest: '신광양항역', label: isEng ? 'Obong ➔ Gwangyang Port (340km)' : '오봉역 ➔ 신광양항역 (340km)' },
                          { origin: '대전조차장역', dest: '부산진역', label: isEng ? 'Daejeon ➔ Busan Jin (280km)' : '대전조차장 ➔ 부산진역 (280km)' },
                          { origin: '충주역', dest: '도담역', label: isEng ? 'Chungju ➔ Dodam (120km)' : '충주역 ➔ 도담역 (120km)' },
                          { origin: '괴동역', dest: '의왕ICD', label: isEng ? 'Goedong ➔ Uiwang ICD (350km)' : '괴동역 ➔ 의왕ICD (350km)' },
                          { origin: '인천항역', dest: '부산신항역', label: isEng ? 'Incheon Port ➔ Busan Port (410km)' : '인천항역 ➔ 부산신항역 (410km)' },
                        ].map((ps, idx) => {
                          const isCurrent = originStation === ps.origin && destinationStation === ps.dest;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setOriginStation(ps.origin);
                                setDestinationStation(ps.dest);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1 ${
                                isCurrent
                                  ? 'bg-emerald-100/90 text-emerald-950 border-emerald-500 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{ps.label}</span>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-300" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 수송 방식 선택: 편도 vs 왕복 */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <div className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ArrowRightLeft className="w-4 h-4 text-[#005C2B]" />
                          <span>{isEng ? 'Transport Direction (One-Way / Round-Trip):' : '수송 방식 선택 (편도 / 왕복):'}</span>
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          왕복 선택 시 20% 추가 할인 적용!
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setIsRoundTrip(false)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                            !isRoundTrip
                              ? 'bg-blue-50/90 text-slate-900 border-blue-500 shadow-xl ring-4 ring-blue-500/20 font-extrabold'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50/80'
                          }`}
                        >
                          <div>
                            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                              <span>➡️ 편도 수송 (Single Trip)</span>
                            </div>
                            <div className={`text-xs mt-0.5 ${!isRoundTrip ? 'text-blue-900 font-semibold' : 'text-slate-500'}`}>
                              {originStation || '출발역'} ➔ {destinationStation || '도착역'} (1회 수송)
                            </div>
                          </div>
                          {!isRoundTrip && (
                            <span className="bg-blue-600 text-white p-1 rounded-full shadow-xs">
                              <Check className="w-4 h-4" />
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsRoundTrip(true)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                            isRoundTrip
                              ? 'bg-emerald-50/90 text-slate-900 border-emerald-500 shadow-xl ring-4 ring-emerald-500/20 font-extrabold'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
                          }`}
                        >
                          <div>
                            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                              <span>🔄 {isEng ? 'Round-Trip Freight' : '왕복 수송 (Round Trip)'}</span>
                              <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-black shadow-xs">
                                {isEng ? '20% Extra Off' : '20% 추가할인'}
                              </span>
                            </div>
                            <div className={`text-xs mt-0.5 ${isRoundTrip ? 'text-emerald-900 font-semibold' : 'text-slate-500'}`}>
                              {originStation || (isEng ? 'Origin' : '출발역')} ↔ {destinationStation || (isEng ? 'Destination' : '도착역')} ({isEng ? 'Round-trip' : '왕복 수송'})
                            </div>
                          </div>
                          {isRoundTrip && (
                            <span className="bg-[#005C2B] text-white p-1 rounded-full shadow-xs">
                              <Check className="w-4 h-4" />
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Cargo Type Selection */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#005C2B]" />
                      <span>{isEng ? 'Select Cargo Category' : '화물 종류 선택'}</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(isEng ? [
                        'Import/Export Containers',
                        'Steel / Coil Products',
                        'Cement / Mineral Bulk',
                        'Dangerous / Chemical',
                        'Auto Parts & Machinery',
                        'General LCL Parcel',
                      ] : [
                        '수출입 컨테이너 (General Box)',
                        '스틸 / 철강 코일',
                        '시멘트 / 광물 분체',
                        '무기 / 위험물 / 화학',
                        '자동차 부품 & 기계류',
                        '일반 소량 규격 화물',
                      ]).map((type, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCargoType(type)}
                          className={`p-3.5 rounded-2xl text-left border-2 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                            cargoType === type
                              ? 'bg-[#005C2B] text-white border-[#005C2B] shadow-md'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{type}</span>
                          {cargoType === type && <Check className="w-4 h-4 text-emerald-300 flex-shrink-0 ml-1" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: 수량 및 날짜 설정 */}
            {!isSlotSelectionPage && currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-extrabold border border-blue-200">
                    <Calendar className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isEng ? 'Step 3 (Quantity & Schedule)' : '3단계 (수량 및 날짜 설정)'}</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {userType === 'enterprise' 
                      ? (isEng ? 'FCL Wagon Quantity/Weight & Departure Date' : '전세 화물 수량/중량 및 출발 희망일')
                      : (isEng ? 'LCL CBM/Weight & Departure Date' : '소량 화물 CBM/중량 및 출발 희망일')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {isEng
                      ? `Specify shipment dimensions, weight, and preferred departure date for ${userType === 'enterprise' ? 'FCL Charter' : 'LCL Consolidation'}.`
                      : `선택하신 수송 유형(${userType === 'enterprise' ? '전세 화물 FCL' : '소량 화물 LCL'})에 맞춰 규격 수량과 출발 희망 달력을 설정하세요.`}
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                  {/* FCL Inputs */}
                  {userType === 'enterprise' ? (
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-blue-700" />
                          <span>{isEng ? 'FCL Wagon / Weight Config' : '전세 화물 수량/톤수 설정 (FCL)'}</span>
                        </h4>
                        <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                          {isEng ? 'Formula: [Rate × Distance × Weight]' : '공식: [운임 단가 × 수송거리 × 중량]'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 화차 수량 */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                          <label className="block text-xs font-extrabold text-slate-700">
                            {isEng ? 'Wagon Count' : '화차 수량'} <span className="text-slate-400 font-normal">{isEng ? '(1 wagon units)' : '(1량 단위)'}</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min={1}
                              max={50}
                              value={entCarCount}
                              onChange={(e) => setEntCarCount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-slate-900"
                            />
                            <span className="text-sm font-bold text-slate-600">{isEng ? 'wagons' : '량'}</span>
                          </div>
                        </div>

                        {/* 화물 중량 */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                          <label className="block text-xs font-extrabold text-slate-700">
                            {isEng ? 'Cargo Weight' : '화물 중량'} <span className="text-slate-400 font-normal">{isEng ? '(in tons)' : '(1톤 단위)'}</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min={1}
                              max={2000}
                              value={entWeight}
                              onChange={(e) => setEntWeight(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-slate-900"
                            />
                            <span className="text-sm font-bold text-slate-600">{isEng ? 'tons' : '톤'}</span>
                          </div>
                        </div>

                        {/* 수송 거리 */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                          <label className="block text-xs font-extrabold text-slate-700">
                            {isEng ? 'Transport Distance' : '수송 거리'} <span className="text-slate-400 font-normal">(km)</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min={100}
                              step={10}
                              value={entDistance}
                              onChange={(e) => setEntDistance(parseInt(e.target.value) || 0)}
                              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-slate-900"
                            />
                            <span className="text-sm font-bold text-slate-600">km</span>
                          </div>
                          <div className="text-[11px] text-emerald-700 font-bold">
                            {isEng ? '* Min. 100km distance tariff applied' : '* 최저 100km 수송 기준 적용'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* LCL Inputs */
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <Store className="w-5 h-5 text-amber-600" />
                          <span>{isEng ? 'LCL Parcel Count, Volume & Weight Config' : '소량 화물 수량 및 CBM/무게 설정 (LCL)'}</span>
                        </h4>
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                          {isEng ? 'Auto-calculated by LCL Volume' : 'LCL 수량 연동 자동 산정'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 화물 수량 */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                          <label className="block text-xs font-extrabold text-slate-700">
                            {isEng ? 'Item / Pallet Quantity' : '화물 수량'} <span className="text-amber-800 font-bold">{isEng ? '(Pcs / Pallets)' : '(개 / 파레트)'}</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min={1}
                              max={500}
                              value={smeQuantity}
                              onChange={(e) => setSmeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-3 bg-amber-50/50 border border-amber-300 rounded-xl text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <span className="text-xs font-extrabold text-slate-700 whitespace-nowrap">{isEng ? 'Pcs/PLT' : '개/PLT'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isEng ? '* Box count or pallet units' : '* 박스, 화물 개수 또는 파레트 단위'}
                          </div>
                        </div>

                        {/* 개당 CBM */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                          <label className="block text-xs font-extrabold text-slate-700">
                            {isEng ? 'Volume per Unit' : '개당 부피'} <span className="text-slate-400 font-normal">{isEng ? '(CBM / Unit)' : '(개당 CBM)'}</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min={0.1}
                              step={0.1}
                              max={50}
                              value={smeUnitCbm}
                              onChange={(e) => setSmeUnitCbm(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-slate-900"
                            />
                            <span className="text-sm font-bold text-slate-600">CBM</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            * 1 CBM = 1m × 1m × 1m
                          </div>
                        </div>

                        {/* 개당 중량 */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                          <label className="block text-xs font-extrabold text-slate-700">
                            {isEng ? 'Weight per Unit' : '개당 중량'} <span className="text-slate-400 font-normal">{isEng ? '(kg / Unit)' : '(개당 kg)'}</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min={1}
                              step={10}
                              max={10000}
                              value={smeUnitWeight}
                              onChange={(e) => setSmeUnitWeight(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-slate-900"
                            />
                            <span className="text-sm font-bold text-slate-600">kg</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isEng ? '* Weight per piece or pallet' : '* 개당 또는 파레트당 중량'}
                          </div>
                        </div>
                      </div>

                      {/* 총 부피 / 총 중량 자동 연동 산정 결과 안내 바 */}
                      <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-950 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
                            <Package className="w-5 h-5 text-amber-700" />
                          </div>
                          <div>
                            <div className="font-extrabold text-amber-900">
                              {isEng ? 'Calculated LCL Totals' : 'LCL 총 수량 연동 산정 결과'}
                            </div>
                            <div className="text-xs text-amber-800/90 font-medium mt-0.5">
                              {isEng ? `Quantity: ${smeQuantity} Pcs/PLT × (${smeUnitCbm} CBM / ${smeUnitWeight}kg per unit)` : `입력 수량: ${smeQuantity}개/PLT × (개당 ${smeUnitCbm} CBM / ${smeUnitWeight}kg)`}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-amber-200/90 shadow-2xs font-extrabold">
                          <div>
                            <span className="text-slate-500 text-[11px]">{isEng ? 'Total Vol: ' : '전체 총 부피: '}</span>
                            <strong className="text-amber-900 text-sm font-mono">{totalSmeCbm} CBM</strong>
                          </div>
                          <div className="w-px h-4 bg-slate-200 hidden sm:block" />
                          <div>
                            <span className="text-slate-500 text-[11px]">{isEng ? 'Total Wt: ' : '전체 총 중량: '}</span>
                            <strong className="text-amber-900 text-sm font-mono">{totalSmeWeight.toLocaleString()} kg</strong>
                            <span className="text-amber-700 text-[11px] font-medium ml-1.5">({isEng ? 'Vol Wt: ' : '환산: '}{chargeableCbm} CBM)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 출발 및 복귀 희망일/시각 설정 (편도 / 왕복 지원) */}
                  <div className="space-y-5 pt-4 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4.5 h-4.5 text-[#005C2B]" />
                        <span>{isEng ? 'Schedule & Departure/Return Preferred Date/Time' : '수송 일정 및 출발/복귀 희망 일시 설정'}</span>
                      </label>
                      <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1 w-fit">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {isEng ? '5-Hour Pre-departure Deadline Applies' : '운행 5시간 전 마감 규정 적용'}
                      </span>
                    </div>

                    {/* 수송 방식 (편도/왕복) Quick Switch Bar */}
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 max-w-md">
                      <button
                        type="button"
                        onClick={() => setIsRoundTrip(false)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          !isRoundTrip
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>➡️ {isEng ? 'One-Way Freight' : '편도 수송'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRoundTrip(true)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isRoundTrip
                            ? 'bg-[#005C2B] text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>🔄 {isEng ? 'Round-Trip Freight' : '왕복 수송'}</span>
                        <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded font-black">
                          {isEng ? '20% Off' : '20% 할인'}
                        </span>
                      </button>
                    </div>

                    {/* Date & Time Selectors */}
                    {!isRoundTrip ? (
                      /* 편도 수송 일시 입력 */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                            <label className="block text-xs font-extrabold text-slate-700">
                              {isEng ? `Select Departure Date (From ${originStation || 'Origin'})` : `출발 희망일 선택 (${originStation || '출발역'} 출발)`}
                            </label>
                            <input
                              type="date"
                              value={departureDate}
                              onChange={(e) => setDepartureDate(e.target.value)}
                              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-900"
                            />
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                            <label className="block text-xs font-extrabold text-slate-700">
                              {isEng ? 'Select Estimated Departure Time' : '출발 예정 시각 선택'}
                            </label>
                            <select
                              value={departureTime}
                              onChange={(e) => setDepartureTime(e.target.value)}
                              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-900"
                            >
                              <option value="06:00">06:00 ({isEng ? 'First Morning Train' : '오전 첫 열차'})</option>
                              <option value="09:00">09:00 ({isEng ? 'Morning Freight' : '오전 수송'})</option>
                              <option value="12:00">12:00 ({isEng ? 'Noon Regular' : '낮 정시'})</option>
                              <option value="14:00">14:00 ({isEng ? 'Daytime Peak' : '주간 피크'})</option>
                              <option value="18:00">18:00 ({isEng ? 'Evening Shift' : '저녁 퇴근전'})</option>
                              <option value="22:00">22:00 ({isEng ? 'Night Freight' : '야간 전용'})</option>
                            </select>
                          </div>
                        </div>

                        {/* Quick Presets (편도) */}
                        <div className="space-y-2 pt-1">
                          <label className="block text-xs font-extrabold text-slate-500">
                            {isEng ? 'One-Click Quick Schedule Presets' : '원클릭 편도 일정 선택'}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(isEng ? [
                              { label: '🔥 Within 5h Departure (Binkan Deal Rate)', dateDays: 0, time: '18:00', urgent: true },
                              { label: '📅 3 Days Later (Advance Reservation - Standard Fare)', dateDays: 3, time: '14:00', urgent: false },
                              { label: '📅 Tomorrow Departure (Advance Reservation - Standard Fare)', dateDays: 1, time: '14:00', urgent: false },
                            ] : [
                              { label: '🔥 출발 5시간 이내 직전 예약 (빈칸 특가 적용)', dateDays: 0, time: '18:00', urgent: true },
                              { label: '📅 3일 후 출발 (사전 예약 - 정상 운임 적용)', dateDays: 3, time: '14:00', urgent: false },
                              { label: '📅 내일 출발 (사전 예약 - 정상 운임 적용)', dateDays: 1, time: '14:00', urgent: false },
                            ]).map((qs, i) => {
                              const dateStr = new Date(Date.now() + qs.dateDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                              const isSelected = departureDate === dateStr && isUrgent5hToggle === qs.urgent;
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => {
                                    setDepartureDate(dateStr);
                                    setDepartureTime(qs.time);
                                    setIsUrgent5hToggle(qs.urgent);
                                  }}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isSelected
                                      ? qs.urgent
                                        ? 'bg-[#005C2B] text-white border-[#005C2B] shadow-sm'
                                        : 'bg-slate-800 text-white border-slate-800 shadow-sm'
                                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  <span>{qs.label}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 왕복 수송 일시 입력 (가는 날 + 오는 날 2개 섹션) */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* 1. 가는 날 일정 */}
                          <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border-2 border-emerald-300 space-y-3">
                            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                              <span className="text-xs font-black text-[#005C2B] flex items-center gap-1.5">
                                <span className="p-1 bg-[#005C2B] text-white rounded-lg text-[10px]">{isEng ? '1. Outbound' : '1. 가는 날'}</span>
                                <span>{originStation || (isEng ? 'Origin' : '출발역')} ➔ {destinationStation || (isEng ? 'Destination' : '도착역')}</span>
                              </span>
                              <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full">
                                {isEng ? 'One-Way Tariff / Special Deal' : '편도 운임 / 특가'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[11px] font-extrabold text-slate-700">
                                  {isEng ? 'Outbound Preferred Date' : '가는 날 출발 희망일'}
                                </label>
                                <input
                                  type="date"
                                  value={departureDate}
                                  onChange={(e) => setDepartureDate(e.target.value)}
                                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[11px] font-extrabold text-slate-700">
                                  {isEng ? 'Outbound Departure Time' : '가는 날 출발 시각'}
                                </label>
                                <select
                                  value={departureTime}
                                  onChange={(e) => setDepartureTime(e.target.value)}
                                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900"
                                >
                                  <option value="06:00">06:00 ({isEng ? 'First Morning' : '오전 첫 열차'})</option>
                                  <option value="09:00">09:00 ({isEng ? 'Morning' : '오전 수송'})</option>
                                  <option value="12:00">12:00 ({isEng ? 'Noon' : '낮 정시'})</option>
                                  <option value="14:00">14:00 ({isEng ? 'Daytime Peak' : '주간 피크'})</option>
                                  <option value="18:00">18:00 ({isEng ? 'Evening Shift' : '저녁 퇴근전'})</option>
                                  <option value="22:00">22:00 ({isEng ? 'Night' : '야간 전용'})</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* 2. 오는 날 일정 */}
                          <div className="bg-blue-50/70 p-4 sm:p-5 rounded-2xl border-2 border-blue-300 space-y-3">
                            <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                              <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                                <span className="p-1 bg-blue-700 text-white rounded-lg text-[10px]">{isEng ? '2. Return' : '2. 오는 날 (복귀)'}</span>
                                <span>{destinationStation || (isEng ? 'Destination' : '도착역')} ➔ {originStation || (isEng ? 'Origin' : '출발역')}</span>
                              </span>
                              <span className="text-[11px] font-extrabold text-blue-800 bg-blue-200/60 px-2 py-0.5 rounded-full">
                                {isEng ? 'Extra 20% Off Applied' : '왕복 20% 추가 할인 적용'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="block text-[11px] font-extrabold text-slate-700">
                                  {isEng ? 'Return Preferred Date' : '오는 날 복귀 희망일'}
                                </label>
                                <input
                                  type="date"
                                  min={departureDate}
                                  value={returnDate}
                                  onChange={(e) => setReturnDate(e.target.value)}
                                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[11px] font-extrabold text-slate-700">
                                  {isEng ? 'Return Time' : '오는 날 복귀 시각'}
                                </label>
                                <select
                                  value={returnTime}
                                  onChange={(e) => setReturnTime(e.target.value)}
                                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900"
                                >
                                  <option value="06:00">06:00 ({isEng ? 'First Morning' : '오전 첫 열차'})</option>
                                  <option value="09:00">09:00 ({isEng ? 'Morning' : '오전 수송'})</option>
                                  <option value="12:00">12:00 ({isEng ? 'Noon' : '낮 정시'})</option>
                                  <option value="14:00">14:00 ({isEng ? 'Daytime Peak' : '주간 피크'})</option>
                                  <option value="18:00">18:00 ({isEng ? 'Evening Shift' : '저녁 퇴근전'})</option>
                                  <option value="22:00">22:00 ({isEng ? 'Night' : '야간 전용'})</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Presets (왕복) */}
                        <div className="space-y-2 pt-1">
                          <label className="block text-xs font-extrabold text-slate-500">
                            {isEng ? 'One-Click Round-Trip Presets' : '원클릭 왕복 여정 일시 선택'}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(isEng ? [
                              { label: '🔥 Same-Day Round Trip (<5h Binkan Special + 20% Off)', depDays: 0, retDays: 0, urgent: true },
                              { label: '🔄 3-Day Round Trip (Advance Standard Fare + 20% Off)', depDays: 3, retDays: 6, urgent: false },
                              { label: '🔄 5-Day Round Trip (Advance Standard Fare + 20% Off)', depDays: 2, retDays: 7, urgent: false },
                            ] : [
                              { label: '🔥 당일 5시간 이내 왕복 수송 (빈칸 특가 + 20% 할인)', depDays: 0, retDays: 0, urgent: true },
                              { label: '🔄 3일 여정 왕복 (사전 예약 정상운임 + 20% 할인)', depDays: 3, retDays: 6, urgent: false },
                              { label: '🔄 5일 여정 왕복 (사전 예약 정상운임 + 20% 할인)', depDays: 2, retDays: 7, urgent: false },
                            ]).map((qs, i) => {
                              const depStr = new Date(Date.now() + qs.depDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                              const retStr = new Date(Date.now() + qs.retDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                              const isSelected = departureDate === depStr && returnDate === retStr && isUrgent5hToggle === qs.urgent;
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => {
                                    setDepartureDate(depStr);
                                    setDepartureTime('14:00');
                                    setReturnDate(retStr);
                                    setReturnTime(qs.urgent ? '22:00' : '14:00');
                                    setIsUrgent5hToggle(qs.urgent);
                                  }}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isSelected
                                      ? qs.urgent
                                        ? 'bg-[#005C2B] text-white border-[#005C2B] shadow-sm'
                                        : 'bg-slate-800 text-white border-slate-800 shadow-sm'
                                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  <span>{qs.label}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Real-time 5-Hour Cutoff Status Banner */}
                    <div className="pt-2">
                      {isOpenSpecialDiscount ? (
                        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-2xl flex items-start space-x-3 text-xs font-bold shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-[#005C2B] flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-black text-emerald-950 text-sm block flex items-center gap-1.5">
                              <span>🔥 {isEng ? 'Within 5h Departure Booking (Binkan Special Deal Applied!)' : "출발 5시간 이내 직전 예약 ('빈칸 특가' 할인 적용!)"}</span>
                            </span>
                            <p className="text-emerald-900 font-medium leading-relaxed">
                              {isEng 
                                ? `Selected schedule (Outbound: ${departureDate} ${departureTime} ${isRoundTrip ? `/ Return: ${returnDate} ${returnTime}` : ''}) is within 5 hours of departure, qualifying for ${userType === 'enterprise' ? 'FCL 35%' : 'LCL 38%'} Binkan Special Discount ${isRoundTrip ? '+ Extra 20% Round-trip Discount' : ''}.`
                                : `선택하신 일정(가는 날: ${departureDate} ${departureTime} ${isRoundTrip ? `/ 오는 날: ${returnDate} ${returnTime}` : ''})은 출발 5시간 전~출발 시점 남은 유휴공간에 해당되어 ${userType === 'enterprise' ? 'FCL 35%' : 'LCL 38%'} 빈칸 특가 할인 ${isRoundTrip ? '+ 왕복 20% 추가 할인' : ''}이 적용됩니다.`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-100 border-2 border-slate-300 text-slate-900 rounded-2xl flex items-start space-x-3 text-xs font-bold shadow-sm">
                          <Clock className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-black text-slate-900 text-sm block">
                              📅 {isEng ? 'Advance Booking (Standard Fare Rate)' : "여유 있는 사전 예약 ('정상 운임 가격' 적용)"}
                            </span>
                            <p className="text-slate-700 font-medium leading-relaxed">
                              {isEng
                                ? `Selected schedule (Outbound: ${departureDate} ${departureTime} ${isRoundTrip ? `/ Return: ${returnDate} ${returnTime}` : ''}) is booked more than 5 hours in advance, applying standard fare rates. (Binkan deals open within 5 hours of departure. ${isRoundTrip ? 'Extra 20% round-trip discount still applies.' : ''})`
                                : `선택하신 일정(가는 날: ${departureDate} ${departureTime} ${isRoundTrip ? `/ 오는 날: ${returnDate} ${returnTime}` : ''})은 출발 5시간 이전의 사전 예약 건으로 '정상 운임 가격'이 적용됩니다. (빈칸 특가는 출발 5시간 전부터 유휴공간이 발생할 경우 열립니다. ${isRoundTrip ? '단, 왕복 20% 추가 할인은 정상 적용됩니다.' : ''})`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: 부가 서비스 및 최종 견적 */}
            {!isSlotSelectionPage && currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-extrabold border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEng ? 'Step 4 (Add-on Services & Final Quote)' : '4단계 (부가 서비스 및 최종 견적)'}</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {isEng ? 'Kakao T Last-mile Service & Final Special Quote Summary' : '카카오 T 연계 택배 서비스 및 최종 특가 견적 요약 카드'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {isEng
                      ? 'Select Kakao T door-to-door first/last mile services and review your final quote including 20% round-trip discount.'
                      : '카카오 T 연계 상/하차 서비스 옵션 선택 및 왕복 20% 추가 할인 혜택이 적용된 최종 특가 견적을 확인하세요.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
                  {/* Left: Kakao T Addon Services Selection */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <TruckIcon className="w-4 h-4 text-[#005C2B]" />
                        <span>{isEng ? 'Add-on Services & Round-trip Options' : '부가 서비스 & 왕복 할인 옵션 선택'}</span>
                      </h4>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {isEng ? 'Discounts & Services' : '할인 & 서비스'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Option 0: Round Trip Reservation (왕복 20% 할인) */}
                      <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3.5 transition-all shadow-sm ${
                        isRoundTrip ? 'bg-emerald-50/90 border-[#005C2B] text-slate-900 ring-2 ring-[#005C2B]/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}>
                        <input
                          type="checkbox"
                          checked={isRoundTrip}
                          onChange={(e) => setIsRoundTrip(e.target.checked)}
                          className="mt-1 w-4.5 h-4.5 accent-[#005C2B] rounded cursor-pointer"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                              <ArrowRightLeft className="w-4 h-4 text-[#005C2B]" />
                              {isEng ? 'Round-Trip Booking (Extra 20% Off)' : '왕복 운송 예약 (20% 추가 할인 적용)'}
                            </span>
                            <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                              {isEng ? 'Extra 20% Off' : '왕복 20% 추가 할인'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium mt-1">
                            {isEng
                              ? 'When booking round-trip rail freight between origin and destination, an extra 20% discount is automatically deducted from rail tariff.'
                              : '출발지↔목적지 왕복 철도 수송 선택 시, 최종 산출된 운임 금액에서 20%가 추가 할인되어 결제 금액에 실시간 반영됩니다.'}
                          </p>
                        </div>
                      </label>

                      {/* Option 1: 카카오 T 퀵/화물 퍼스트마일 */}
                      <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3.5 transition-all ${
                        kakaoFirstMile ? 'bg-amber-50/60 border-amber-400 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <input
                          type="checkbox"
                          checked={kakaoFirstMile}
                          onChange={(e) => setKakaoFirstMile(e.target.checked)}
                          className="mt-1 w-4 h-4 accent-[#005C2B] rounded cursor-pointer"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{isEng ? 'Kakao T First-Mile Pickup (Origin to Station)' : '카카오 T 퀵/화물 퍼스트마일 (상차 연계)'}</span>
                              {userType !== 'enterprise' && (
                                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                                  {isEng ? 'Volume/Weight Linked' : '수량·무게 연동'}
                                </span>
                              )}
                            </span>
                            <span className="text-xs font-black text-amber-800">
                              +{kakaoSingleMileFee.toLocaleString()}{isEng ? ' KRW' : '원'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {userType === 'enterprise' 
                              ? (isEng ? 'Origin factory/warehouse to freight station loading dock via Kakao T trucks' : '출발지 공장/창고 ➔ 철도 화물역 상차 직전까지 카카오 T 트럭/퀵 연계')
                              : (isEng ? `Origin to freight station pickup (${smeQuantity} Pcs/PLT / ${smeWeight.toLocaleString()}kg)` : `출발지 ➔ 화물역 픽업 (수량 ${smeQuantity}개 / 총 중량 ${smeWeight.toLocaleString()}kg 비례 실시간 정산)`)}
                          </p>
                        </div>
                      </label>

                      {/* Option 2: 카카오 T 라스트마일 */}
                      <label className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start space-x-3.5 transition-all ${
                        kakaoLastMile ? 'bg-amber-50/60 border-amber-400 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <input
                          type="checkbox"
                          checked={kakaoLastMile}
                          onChange={(e) => setKakaoLastMile(e.target.checked)}
                          className="mt-1 w-4 h-4 accent-[#005C2B] rounded cursor-pointer"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{isEng ? 'Kakao T Last-Mile Delivery (Station to Door)' : '카카오 T 라스트마일 (도크투도어 배송)'}</span>
                              {userType !== 'enterprise' && (
                                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                                  {isEng ? 'Volume/Weight Linked' : '수량·무게 연동'}
                                </span>
                              )}
                            </span>
                            <span className="text-xs font-black text-amber-800">
                              +{kakaoSingleMileFee.toLocaleString()}{isEng ? ' KRW' : '원'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {userType === 'enterprise'
                              ? (isEng ? 'Destination station unloading to final door destination via Kakao T' : '도착역 하차 ➔ 최종 목적지 창고까지 카카오 T 연계 도어투도어 배송')
                              : (isEng ? `Destination station to final delivery (${smeQuantity} Pcs/PLT / ${smeWeight.toLocaleString()}kg)` : `도착역 ➔ 목적지 배송 (수량 ${smeQuantity}개 / 총 중량 ${smeWeight.toLocaleString()}kg 비례 실시간 정산)`)}
                          </p>
                        </div>
                      </label>

                      {/* Option 3: Safety Insurance (Free) */}
                      <label className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 flex items-start space-x-3.5">
                        <input
                          type="checkbox"
                          checked={safetyInsurance}
                          onChange={(e) => setSafetyInsurance(e.target.checked)}
                          className="mt-1 w-4 h-4 accent-[#005C2B] rounded cursor-pointer"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-extrabold text-emerald-950 flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4 text-[#005C2B]" />
                              {isEng ? 'Zero Deposit & KORAIL Cargo Protection Insurance' : '보증금 0원 & 코레일 안심 화물 보장 보험'}
                            </span>
                            <span className="text-xs font-black text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                              {isEng ? 'Included Free' : '무상 기본제공'}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            {isEng ? '100% bidding deposit waiver & full cargo damage insurance cover included' : '입찰 보증금 100% 면제 및 화물 전 손해 안심 보장 특약 적용'}
                          </p>
                        </div>
                      </label>

                      {/* 빈칸 잔여 현황 모의 테스트 선택 바 (Requirement) */}
                      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#005C2B]" />
                            {isEng ? 'Real-time Binkan Slot Test Simulation:' : '실시간 빈칸 잔여 현황 모의 테스트:'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">{isEng ? 'Test Mode Toggle' : '테스트용 상태 전환'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setHasEmptySlot(true)}
                            className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer transition-all border flex items-center justify-center gap-1 ${
                              hasEmptySlot
                                ? 'bg-[#005C2B] text-white border-[#005C2B] shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span>🟢 {isEng ? 'Slot Available (Success)' : '빈칸 있음 (정상 완료)'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setHasEmptySlot(false)}
                            className={`py-2 px-3 rounded-xl text-xs font-extrabold cursor-pointer transition-all border flex items-center justify-center gap-1 ${
                              !hasEmptySlot
                                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span>🔴 {isEng ? 'No Slot (Alternative Modal)' : '빈칸 없음 (대체 카드 노출)'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Final Estimate Summary Card */}
                  <div className="lg:col-span-6 bg-[#0A1329] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        {isEng ? 'Final Special Quote Summary Card' : '최종 특가 견적 요약 카드'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isOpenSpecialDiscount ? (
                          <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2.5 py-0.5 rounded-full font-extrabold border border-emerald-400/30">
                            {userType === 'enterprise' ? 'FCL 35%↓' : 'LCL 38%↓'}
                          </span>
                        ) : (
                          <span className="bg-slate-700/60 text-slate-300 text-[11px] px-2.5 py-0.5 rounded-full font-extrabold border border-slate-600">
                            {isEng ? 'Advance Reservation' : '사전 예약 (정상 운임)'}
                          </span>
                        )}
                        {isRoundTrip && (
                          <span className="bg-blue-500/20 text-blue-300 text-[11px] px-2.5 py-0.5 rounded-full font-extrabold border border-blue-400/30">
                            {isEng ? 'Rail Tariff 20%↓' : '철도 운임 20%↓'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary Inputs Snapshot */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isEng ? 'Freight Mode:' : '수송 형태:'}</span>
                        <span className="font-extrabold text-white">
                          {userType === 'enterprise' ? (isEng ? 'FCL Charter' : '전세 화물 (FCL)') : (isEng ? 'LCL Consolidation' : '소량 화물 (LCL)')} ({isRoundTrip ? (isEng ? '🔄 Round-trip' : '🔄 왕복 수송') : (isEng ? '➡️ One-way' : '➡️ 편도 수송')})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isEng ? 'Selected Route:' : '선택 노선:'}</span>
                        <span className="font-extrabold text-white truncate max-w-[200px]">
                          {`${originStation || (isEng ? 'Unspecified' : '미지정')} ➔ ${destinationStation || (isEng ? 'Unspecified' : '미지정')}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isEng ? 'Cargo Category:' : '수송 품목:'}</span>
                        <span className="font-extrabold text-emerald-300">{cargoType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isEng ? 'Size / Quantity:' : '신청 규격/용량:'}</span>
                        <span className="font-extrabold text-white">
                          {userType === 'enterprise' 
                            ? `${entCarCount}${isEng ? ' wagons' : '량'} (${entWeight}${isEng ? ' tons' : '톤'} / ${actualEntDistance}km)` 
                            : `${smeQuantity}${isEng ? ' Pcs/PLT' : '개/PLT'} (${isEng ? 'Total' : '총'} ${totalSmeCbm} CBM / ${totalSmeWeight.toLocaleString()}kg)`}
                        </span>
                      </div>
                      {!isRoundTrip ? (
                        <div className="flex justify-between border-t border-white/10 pt-2">
                          <span className="text-slate-400">{isEng ? 'Departure Date/Time:' : '출발 예정 일시:'}</span>
                          <span className="font-extrabold text-amber-300">{departureDate} {departureTime}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between border-t border-white/10 pt-2">
                            <span className="text-slate-400">{isEng ? 'Outbound Date/Time:' : '가는 날 일시:'}</span>
                            <span className="font-extrabold text-emerald-300">{departureDate} {departureTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">{isEng ? 'Return Date/Time:' : '오는 날(복귀) 일시:'}</span>
                            <span className="font-extrabold text-blue-300">{returnDate} {returnTime}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">{isEng ? 'Special Tariff Status:' : '특가 적용 구분:'}</span>
                        <span className={`font-black ${isOpenSpecialDiscount ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {isOpenSpecialDiscount 
                            ? (isEng ? '🔥 Within 5h Departure (Binkan Deal Applied)' : '🔥 출발 5시간 이내 (빈칸 특가 할인 적용)')
                            : (isEng ? '📅 Advance Reservation (Standard Fare)' : '📅 여유 있는 사전 예약 (정상 운임)')}
                        </span>
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>{isEng ? `Standard Rail Tariff ${isRoundTrip ? '(Round-trip x2)' : ''}` : `기존 표준 철도 운임료 ${isRoundTrip && '(왕복 2회)'}`}</span>
                        <span className="line-through text-slate-400 font-mono">
                          {totalStandardFreight.toLocaleString()} {isEng ? 'KRW' : '원'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>
                          {isOpenSpecialDiscount
                            ? (isEng ? '🔥 Within 5h "Binkan Deal" Discount' : '🔥 출발 5시간 이내 유휴공간 "빈칸 특가" 할인')
                            : (isEng ? 'Binkan Special (Applies within 5h of departure)' : '빈칸 특가 (출발 5시간 전부터 적용)')}
                        </span>
                        <span className={`font-mono ${isOpenSpecialDiscount ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {isOpenSpecialDiscount ? `-${totalSpecialSavings.toLocaleString()} ${isEng ? 'KRW' : '원'}` : (isEng ? '0 KRW (Standard Fare)' : '0 원 (정상 운임)')}
                        </span>
                      </div>

                      {isRoundTrip && (
                        <div className="flex justify-between items-center text-xs text-blue-300 font-bold">
                          <span>{isEng ? '🔄 Round-trip Rail Tariff 20% Extra Discount' : '🔄 왕복 철도 운임 20% 추가 할인'}</span>
                          <span className="font-mono">
                            -{roundTripDiscountAmount.toLocaleString()} {isEng ? 'KRW' : '원'}
                          </span>
                        </div>
                      )}

                      {kakaoAddonFee > 0 && (
                        <div className="flex justify-between items-center text-xs text-amber-300 font-bold">
                          <span>
                            {userType === 'enterprise' 
                              ? (isEng ? 'Kakao T Door-to-Door Delivery Fee' : '카카오 T 연계 배송비 (부대비용)')
                              : (isEng ? `Kakao T Pickup/Delivery (${smeQuantity} Pcs · ${smeWeight.toLocaleString()}kg)` : `카카오 T 연계 택배/배송비 (수량 ${smeQuantity}개 · ${smeWeight.toLocaleString()}kg 연동)`)}
                          </span>
                          <span className="font-mono">
                            +{kakaoAddonFee.toLocaleString()} {isEng ? 'KRW' : '원'}
                          </span>
                        </div>
                      )}

                      {isRoundTrip && kakaoAddonFee > 0 && (
                        <p className="text-[10px] text-slate-400 font-medium">
                          {isEng
                            ? '* Extra 20% round-trip discount applies only to pure rail freight tariff, excluding add-on delivery fees.'
                            : '* 왕복 20% 할인은 부대비용(카카오 T 연계 배송비)을 제외한 철도 순수 운임료에만 적용됩니다.'}
                        </p>
                      )}

                      <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 p-4 rounded-2xl border border-emerald-500/40 space-y-1 mt-3">
                        <div className="text-xs text-emerald-300 font-bold flex items-center justify-between">
                          <span>{isEng ? 'Estimated Final Payment & Application Amount' : '최종 결제 및 입찰 신청 예상 금액'}</span>
                          <span className="bg-[#005C2B] text-white px-2 py-0.5 rounded text-[10px] font-extrabold">
                            {isEng ? 'Best Price Guaranteed' : '최저가 보장'}
                          </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
                          {totalFinalEstimate.toLocaleString()} <span className="text-sm font-normal text-slate-300">{isEng ? 'KRW' : '원'}</span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          {isEng ? '* Zero deposit / 1:1 KORAIL Counselor assigned immediately upon award' : '* 보증금 0원 / 낙찰 즉시 KORAIL 카운슬러 1:1 배정'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 비슷한 시간대 유휴 공간(빈칸 특가) 선택 및 확정 (4단계 신청 직후 즉시 연결 화면) */}
            {isSlotSelectionPage && (
              <motion.div
                key="slotSelectionView"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 w-full"
              >
                {/* Header Banner (Deep Navy Theme) */}
                <div className="p-6 sm:p-8 lg:p-10 bg-[#0A1329] rounded-3xl text-white shadow-2xl space-y-6 border border-slate-800 relative overflow-hidden">
                  <div className="flex items-start justify-between flex-wrap gap-6 relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl text-emerald-400 border border-white/15 shadow-inner">
                        <Box className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-300 text-xs font-bold px-3.5 py-1 rounded-full border border-emerald-500/40 mb-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isEng ? 'KORAIL Real-time Binkan Slot Matching Completed' : 'KORAIL 실시간 유휴 공간(빈칸 특가) 매칭 완료'}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                          {isEng ? 'Select & Confirm Available Slot' : '빈칸 선택 및 확정'}
                        </h3>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-medium mt-1">
                          {isEng
                            ? '4 Binkan deal trains matched near your requested time and route. Please select your preferred space.'
                            : '요청하신 일시 및 구간 인근의 빈칸 특가 열차 4건이 조회되었습니다. 원하시는 공간을 선택해 주십시오.'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSlotSelectionPage(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-all border border-white/20 flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-300" />
                      <span>{isEng ? '← Back to Step 4 Quote' : '← 4단계 견적으로 돌아가기'}</span>
                    </button>
                  </div>

                  {/* Summary Bar */}
                  <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm relative z-10">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-slate-300 font-bold">{isEng ? 'Station Route:' : '🚉 요청 구간:'}</span>
                      <strong className="text-white font-black">{originStation || (isEng ? 'Uiwang ICD' : '의왕ICD')} ➔ {destinationStation || (isEng ? 'Busan New Port' : '부산신항역')} ({actualEntDistance}km)</strong>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <span className="text-slate-300 font-bold">{isEng ? 'Preferred Date/Time:' : '🕒 희망 일시:'}</span>
                      <strong className="text-white font-black">{departureDate} {departureTime}</strong>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <span className="text-slate-300 font-bold">{isEng ? 'Base Special Fare:' : '💰 기준 특가 운임:'}</span>
                      <strong className="text-emerald-400 font-black text-base">{totalFinalEstimate.toLocaleString()}{isEng ? ' KRW' : '원'}</strong>
                    </div>
                  </div>
                </div>

                {/* Info Notice Card (Clean White Theme) */}
                <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 flex items-center justify-between gap-3 flex-wrap shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                      <Box className="w-5 h-5 text-[#005C2B] flex-shrink-0" />
                    </div>
                    <div>
                      <strong className="text-slate-900 font-extrabold">{isEng ? 'Real-time KORAIL Slot Matching Info:' : '실시간 코레일 유휴선로 매칭 시스템 안내:'}</strong>
                      <span className="text-slate-600 ml-1.5">{isEng ? 'Click [Confirm Special Deal for This Slot] on any card below to instantly finalize your eco-freight reservation.' : '아래 카드의 [이 유휴 공간으로 특가 확정] 버튼을 클릭하시면 즉시 친환경 특가로 예약이 확정됩니다.'}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#005C2B] font-extrabold bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 shadow-xs">
                    🔥 {isEng ? 'Real-time Binkan Special Applied' : '실시간 빈칸 특가 적용 중'}
                  </span>
                </div>

                {/* 4 Cards Grid - Clean White Theme with Depth & 3D Shadow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Slot 1: 현재 선택 시각 슬롯 */}
                  <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-white text-slate-900 shadow-xl hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 space-y-5 relative overflow-hidden flex flex-col justify-between transform hover:-translate-y-1">
                    <div className="space-y-4">
                      {/* 상단: 시간대별 할인율 설명 */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#005C2B]">
                            <Zap className="w-4 h-4 text-emerald-600" />
                            {isEng ? 'Requested Time Slot (Recommended)' : '신청 시각 유휴 공간 (추천)'}
                          </span>
                          <span className="text-xs font-black text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            {isEng ? '38% Off Applied' : '38% 할인 적용'}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-950 font-semibold leading-relaxed">
                          💡 <strong>{isEng ? 'Time Slot Discount Rate:' : '시간대별 할인율:'}</strong> {isEng ? 'Applies standard 38% Binkan deal on requested departure time slot.' : '직전 신청하신 정시 출발 시간대의 KORAIL 여유 선로 기본 38% 빈칸 특가가 자동 반영됩니다.'}
                        </p>
                      </div>

                      {/* Route & Departure Info */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="font-black text-slate-900 text-lg sm:text-xl">
                            🚉 {originStation || (isEng ? 'Uiwang ICD' : '의왕ICD')} ➔ {destinationStation || (isEng ? 'Busan New Port' : '부산신항역')}
                          </div>
                          <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                            {isEng ? '4 TEU Left' : '잔여 4 TEU'}
                          </span>
                        </div>
                        <div className="text-slate-700 font-bold flex items-center gap-2 text-xs sm:text-sm">
                          <Clock className="w-4 h-4 text-[#005C2B]" />
                          <span>{departureDate} <strong className="text-[#005C2B]">{departureTime}</strong> {isEng ? 'Departure' : '출발'}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {isEng ? '* KORAIL surplus capacity deal slot for requested time' : '* 직전 신청하신 시간대의 KORAIL 여유 선로 특가 슬롯'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-500">{isEng ? 'Final Special Fare:' : '최종 특가 운임:'}</span>
                        <span className="text-2xl sm:text-3xl font-black text-[#005C2B] font-mono">
                          {totalFinalEstimate.toLocaleString()} <span className="text-xs font-normal text-slate-500">{isEng ? 'KRW' : '원'} <span className="text-emerald-700 font-bold">(38%↓)</span></span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleConfirmSpecialSlot({
                          time: departureTime,
                          dateStr: departureDate,
                          label: isEng ? 'Requested Time Slot' : '신청 시간대 유휴 공간',
                          discountText: isEng ? 'Binkan Special 38%↓' : '직전 빈칸 특가 38%↓',
                          remainingTeu: 4,
                        })}
                        className="w-full py-3.5 rounded-2xl bg-[#005C2B] hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 border border-emerald-600 transform active:scale-[0.99]"
                      >
                        <span>{isEng ? 'Confirm Special Booking for This Slot' : '이 유휴 공간으로 특가 확정 신청'}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-200" />
                      </button>
                    </div>
                  </div>

                  {/* Slot 2: 1시간 조기 출발 슬롯 */}
                  <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-white text-slate-900 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 space-y-5 relative overflow-hidden flex flex-col justify-between transform hover:-translate-y-1">
                    <div className="space-y-4">
                      {/* 상단: 시간대별 할인율 설명 */}
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-black text-blue-900">
                            <Clock className="w-4 h-4 text-blue-600" />
                            ⚡ {isEng ? 'Earlier Train (1 Hour Early)' : '이전 편 (1시간 조기출발)'}
                          </span>
                          <span className="text-xs font-black text-blue-900 bg-blue-200/80 px-2.5 py-0.5 rounded-full border border-blue-300">
                            {isEng ? '42% Off Applied' : '42% 할인 적용'}
                          </span>
                        </div>
                        <p className="text-[11px] text-blue-950 font-semibold leading-relaxed">
                          💡 <strong>{isEng ? 'Time Slot Discount Rate:' : '시간대별 할인율:'}</strong> {isEng ? '42% discount applied when taking earlier departure train.' : '1시간 일찍 출발하는 조기 선로 활용 시, 회차 효율 보상으로 42% 우대 특가가 적용됩니다.'}
                        </p>
                      </div>

                      {/* Route & Departure Info */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="font-black text-slate-900 text-lg sm:text-xl">
                            🚉 {originStation || (isEng ? 'Uiwang ICD' : '의왕ICD')} ➔ {destinationStation || (isEng ? 'Busan New Port' : '부산신항역')}
                          </div>
                          <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                            {isEng ? '7 TEU Left' : '잔여 7 TEU'}
                          </span>
                        </div>
                        <div className="text-slate-700 font-bold flex items-center gap-2 text-xs sm:text-sm">
                          <Clock className="w-4 h-4 text-blue-700" />
                          <span>{departureDate} <strong className="text-blue-700">18:30</strong> {isEng ? 'Departure (1h Early)' : '출발 (1시간 조기출발)'}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {isEng ? '* Secures wider cargo unloading window with 1h early departure' : '* 1시간 조기출발 시 더 넓은 화물 하차 슬롯 확보 가능'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-500">{isEng ? 'Final Special Fare:' : '최종 특가 운임:'}</span>
                        <span className="text-2xl sm:text-3xl font-black text-blue-800 font-mono">
                          {totalFinalEstimate.toLocaleString()} <span className="text-xs font-normal text-slate-500">{isEng ? 'KRW' : '원'} <span className="text-blue-700 font-bold">(42%↓)</span></span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleConfirmSpecialSlot({
                          time: '18:30',
                          dateStr: departureDate,
                          label: isEng ? '1h Early Departure Slot' : '1시간 조기출발 유휴 공간',
                          discountText: isEng ? 'Early Binkan Special 42%↓' : '조기 빈칸 특가 42%↓',
                          remainingTeu: 7,
                        })}
                        className="w-full py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 border border-blue-700 transform active:scale-[0.99]"
                      >
                        <span>{isEng ? 'Confirm Special Booking for This Slot' : '이 유휴 공간으로 특가 확정 신청'}</span>
                        <ArrowRight className="w-4 h-4 text-blue-200" />
                      </button>
                    </div>
                  </div>

                  {/* Slot 3: 1.5시간 후 여유 편 */}
                  <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-white text-slate-900 shadow-xl hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 space-y-5 relative overflow-hidden flex flex-col justify-between transform hover:-translate-y-1">
                    <div className="space-y-4">
                      {/* 상단: 시간대별 할인율 설명 */}
                      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-900">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            ✨ {isEng ? 'Later Train (1.5h Later)' : '여유 편 (1.5시간 후 출발)'}
                          </span>
                          <span className="text-xs font-black text-indigo-900 bg-indigo-200/80 px-2.5 py-0.5 rounded-full border border-indigo-300">
                            {isEng ? '35% Off Applied' : '35% 할인 적용'}
                          </span>
                        </div>
                        <p className="text-[11px] text-indigo-950 font-semibold leading-relaxed">
                          💡 <strong>{isEng ? 'Time Slot Discount Rate:' : '시간대별 할인율:'}</strong> {isEng ? '35% discount applied for 1.5 hours later departure slot.' : '1.5시간 뒤 여유 출발열차의 유휴 여유 선로를 연계하여 35% 정속 특가가 적용됩니다.'}
                        </p>
                      </div>

                      {/* Route & Departure Info */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="font-black text-slate-900 text-lg sm:text-xl">
                            🚉 {originStation || (isEng ? 'Uiwang ICD' : '의왕ICD')} ➔ {destinationStation || (isEng ? 'Busan New Port' : '부산신항역')}
                          </div>
                          <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                            {isEng ? '5 TEU Left' : '잔여 5 TEU'}
                          </span>
                        </div>
                        <div className="text-slate-700 font-bold flex items-center gap-2 text-xs sm:text-sm">
                          <Clock className="w-4 h-4 text-indigo-700" />
                          <span>{departureDate} <strong className="text-indigo-700">21:00</strong> {isEng ? 'Departure (1.5h Later)' : '출발 (1.5시간 후 여유열차)'}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {isEng ? '* Recommended for shippers needing relaxed loading prep time' : '* 상차 작업에 넉넉한 여유가 필요한 화주 추천'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-500">{isEng ? 'Final Special Fare:' : '최종 특가 운임:'}</span>
                        <span className="text-2xl sm:text-3xl font-black text-indigo-800 font-mono">
                          {totalFinalEstimate.toLocaleString()} <span className="text-xs font-normal text-slate-500">{isEng ? 'KRW' : '원'} <span className="text-indigo-700 font-bold">(35%↓)</span></span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleConfirmSpecialSlot({
                          time: '21:00',
                          dateStr: departureDate,
                          label: isEng ? '1.5h Later Slot' : '1.5시간 후 여유 유휴 공간',
                          discountText: isEng ? 'Relaxed Binkan Special 35%↓' : '여유 빈칸 특가 35%↓',
                          remainingTeu: 5,
                        })}
                        className="w-full py-3.5 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 border border-indigo-700 transform active:scale-[0.99]"
                      >
                        <span>{isEng ? 'Confirm Special Booking for This Slot' : '이 유휴 공간으로 특가 확정 신청'}</span>
                        <ArrowRight className="w-4 h-4 text-indigo-200" />
                      </button>
                    </div>
                  </div>

                  {/* Slot 4: 심야 야간 대폭 추가 특가 */}
                  <div className="p-6 sm:p-7 rounded-3xl border border-slate-200/90 bg-white text-slate-900 shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 space-y-5 relative overflow-hidden flex flex-col justify-between transform hover:-translate-y-1">
                    <div className="space-y-4">
                      {/* 상단: 시간대별 할인율 설명 */}
                      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-black text-purple-900">
                            <Moon className="w-4 h-4 text-purple-600" />
                            🌙 {isEng ? 'Night Midnight Mega Discount' : '심야 야간 추가 대폭 특가'}
                          </span>
                          <span className="text-xs font-black text-purple-900 bg-purple-200/80 px-2.5 py-0.5 rounded-full border border-purple-300">
                            {isEng ? '45% Mega Off' : '45% 대폭 할인'}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-950 font-semibold leading-relaxed">
                          💡 <strong>{isEng ? 'Time Slot Discount Rate:' : '시간대별 할인율:'}</strong> {isEng ? 'Up to 45% discount for late night freight slots with lower track usage.' : '선로 이용률이 낮은 심야 집중수송 시간대 유휴 공간 활용 시 최대 45% 파격 할인이 적용됩니다.'}
                        </p>
                      </div>

                      {/* Route & Departure Info */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="font-black text-slate-900 text-lg sm:text-xl">
                            🚉 {originStation || (isEng ? 'Uiwang ICD' : '의왕ICD')} ➔ {destinationStation || (isEng ? 'Busan New Port' : '부산신항역')}
                          </div>
                          <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                            {isEng ? '9 TEU Left' : '잔여 9 TEU'}
                          </span>
                        </div>
                        <div className="text-slate-700 font-bold flex items-center gap-2 text-xs sm:text-sm">
                          <Clock className="w-4 h-4 text-purple-700" />
                          <span>{departureDate} <strong className="text-purple-700">22:30</strong> {isEng ? 'Departure (Midnight Freight)' : '출발 (심야 야간수송)'}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {isEng ? '* Maximum 45% mega discount for late night freight run' : '* 심야 시간대 운용으로 최대 45% 파격 할인 적용'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-500">{isEng ? 'Final Special Fare:' : '최종 특가 운임:'}</span>
                        <span className="text-2xl sm:text-3xl font-black text-purple-900 font-mono">
                          {Math.round(totalFinalEstimate * 0.92).toLocaleString()} <span className="text-xs font-normal text-slate-500">{isEng ? 'KRW' : '원'} <span className="text-purple-700 font-bold">(45%↓)</span></span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleConfirmSpecialSlot({
                          time: '22:30',
                          dateStr: departureDate,
                          label: isEng ? 'Midnight Night Slot' : '심야 야간 유휴 공간',
                          discountText: isEng ? 'Midnight Binkan Special 45%↓' : '심야 빈칸 특가 45%↓',
                          remainingTeu: 9,
                        })}
                        className="w-full py-3.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 border border-purple-700 transform active:scale-[0.99]"
                      >
                        <span>{isEng ? 'Confirm Special Booking for This Slot' : '이 유휴 공간으로 특가 확정 신청'}</span>
                        <ArrowRight className="w-4 h-4 text-purple-200" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP WIZARD NAVIGATION BUTTONS (하단 네비게이션 버튼 - 1~4단계만 노출, 유휴 공간 선택 화면 제외) */}
          {!isSlotSelectionPage && currentStep <= 4 && (
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
              {/* [이전 단계] 버튼 */}
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm border border-slate-300 flex items-center space-x-2 cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                  <span>{isEng ? 'Previous Step' : '이전 단계'}</span>
                </button>
              ) : (
                <div /> // Spacer
              )}

              {/* [다음 단계] 또는 [특가 신청/사전예약 신청] 완료 버튼 */}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-8 py-3.5 rounded-2xl bg-[#0A1329] hover:bg-slate-800 text-white font-extrabold text-sm border border-slate-700 flex items-center space-x-2 cursor-pointer transition-all shadow-lg hover:shadow-xl ml-auto focus:ring-2 focus:ring-slate-400/20"
                >
                  <span>{isEng ? `Next Step (${currentStep + 1}/4)` : `다음 단계 (${currentStep + 1}/4)`}</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteBidApplication}
                  disabled={isSubmittingApp}
                  className={`px-8 py-4 rounded-2xl text-white font-black text-base border-2 shadow-2xl flex items-center space-x-2.5 cursor-pointer transition-all transform hover:scale-102 ml-auto disabled:opacity-50 ${
                    isOpenSpecialDiscount
                      ? 'bg-gradient-to-r from-[#005C2B] to-emerald-700 hover:from-emerald-800 hover:to-emerald-900 border-emerald-400/80 focus:ring-4 focus:ring-emerald-500/20'
                      : 'bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 border-blue-400/80 focus:ring-4 focus:ring-blue-500/20'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>
                    {isOpenSpecialDiscount
                      ? (isEng ? '🔥 Search Nearby Binkan Slots & Request Deal' : '🔥 비슷한 시간대 유휴공간 조회 및 특가 신청')
                      : (isEng ? 'Submit Advance Reservation' : '사전 예약 정상 신청하기')}
                  </span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          )}

        </div>



        {/* Bidding Modal */}
        {selectedAuction && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-emerald-500 rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#005C2B]" />
                  <h3 className="text-lg font-black text-slate-900">
                    {userType === 'enterprise' ? '전세 화물 역경매 입찰 제안' : '소량 화물 LCL 특가 입찰 신청'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAuction(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                >
                  ✕ 닫기
                </button>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">대상 노선</div>
                <div className="font-extrabold text-base text-[#005C2B]">{selectedAuction.routeTitle}</div>
                <div className="text-xs text-slate-500 mt-1">
                  현재 최저 입찰가: <strong className="text-slate-900">{selectedAuction.currentLowestBid.toLocaleString()} 원</strong>
                </div>
              </div>

              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">입찰 참여 기업명</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">제안 입찰가 (단위당 원)</label>
                    <input
                      type="number"
                      step={5000}
                      max={selectedAuction.currentLowestBid - 1000}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(parseInt(e.target.value) || 100000)}
                      className="w-full p-3 rounded-xl bg-emerald-50/50 border border-emerald-500 text-sm font-bold text-[#005C2B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {userType === 'enterprise' ? '신청 화차 수량 (량)' : '신청 부피 (CBM)'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={selectedAuction.availableTeu * 5}
                      value={bidQuantity}
                      onChange={(e) => setBidQuantity(parseInt(e.target.value) || 1)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>총 예상 입찰 금액:</span>
                    <strong className="text-[#005C2B] text-sm font-black">
                      {(bidAmount * bidQuantity).toLocaleString()} 원
                    </strong>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    * 낙찰 시 KORAIL 물류 담당자 확인 후 30분 이내 최종 계약서가 송부됩니다.
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAuction(null)}
                    className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-xl bg-[#005C2B] hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md cursor-pointer"
                  >
                    입찰 등록 확정
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 로딩 화면 Overlay (나무 심은 효과 메인 강조 노출) */}
        {isSubmittingApp && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white">
            <div className="bg-[#0A1329] border-2 border-emerald-400 p-8 sm:p-10 rounded-3xl max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                <div className="p-4 bg-emerald-500/20 rounded-full border border-emerald-400/40">
                  <Sparkles className="w-8 h-8 text-emerald-300 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3.5 py-1 rounded-full border border-emerald-400/30">
                  KORAIL REALTIME MATCHING
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">KORAIL 유휴선로 매칭 중...</h3>
                <p className="text-xs text-slate-300 font-medium">
                  실시간 잔여 슬롯 조회 및 카카오 T 상/하차 연계 슬롯을 확정하고 있습니다.
                </p>
              </div>

              {/* ⭐ 나무 심은 효과 (ESG 탄소 절감) - 로딩 페이지 강조 노출 ⭐ */}
              <div className="p-5 bg-gradient-to-br from-emerald-950/90 via-emerald-900/70 to-slate-900 border-2 border-emerald-400/80 rounded-2xl text-center space-y-2 shadow-inner">
                <div className="inline-flex items-center space-x-1.5 bg-[#005C2B] text-emerald-200 px-3.5 py-1 rounded-full text-xs font-black border border-emerald-400/40">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>🌳 친환경 ESG 수송 가치</span>
                </div>
                <p className="text-base sm:text-lg font-black text-emerald-100 leading-snug">
                  "도로 대신 철도 물류 이용으로 소나무 <span className="text-emerald-300 font-black text-xl underline decoration-emerald-400 decoration-2 underline-offset-4">{Math.max(16, Math.round((userType === 'enterprise' ? entWeight : smeWeight) * (actualEntDistance || 100) * 0.00085 * (isRoundTrip ? 2 : 1)))}그루</span>를 심은 탄소 절감 효과 발생!"
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  온실가스(CO2)를 획기적으로 감축하는 친환경 철도 물류 네트워크입니다.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-emerald-300">
                  <span>KORAIL 유휴선로 매칭 중</span>
                  <span>진행율 85%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full w-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 친환경 성과 메시지 출력 팝업 모달 */}
        {submittedEcoResult && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border-2 border-emerald-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-900 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 bg-emerald-100 rounded-2xl text-emerald-800">
                    <CheckCircle2 className="w-6 h-6 text-[#005C2B]" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      빈칸 특가 신청 접수 완료
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      특가 수송 신청이 정상 접수되었습니다!
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSubmittedEcoResult(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer p-1 rounded-lg hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* 친환경 성과 메시지 카드 (요구사항 필수 반영) */}
              <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-100/50 to-teal-50 border-2 border-emerald-400/60 rounded-2xl space-y-2.5 text-center shadow-xs">
                <div className="inline-flex items-center space-x-1.5 bg-[#005C2B] text-white px-3.5 py-1 rounded-full text-xs font-extrabold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>🌳 친환경 ESG 수송 성과</span>
                </div>
                <p className="text-base sm:text-lg font-black text-emerald-950 leading-snug tracking-tight">
                  "철도물류를 이용해 나무 <span className="text-[#005C2B] underline decoration-2 underline-offset-4 font-black">{submittedEcoResult.treesSaved}그루</span>를 심은 것과 동일한 탄소 절감 효과를 거두었습니다!"
                </p>
                <p className="text-xs text-emerald-900 font-medium pt-1 leading-relaxed">
                  KORAIL 친환경 화물열차 수송으로 도로 운송 대비 이산화탄소(CO₂) 배출량을 <strong>약 82% 감축</strong>하였습니다.
                </p>
              </div>

              {/* 신청 요약 피드 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500 font-semibold">신청 수송 유형:</span>
                  <span className="font-extrabold text-slate-900">{submittedEcoResult.typeText}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500 font-semibold">신청 노선 구간:</span>
                  <span className="font-extrabold text-[#005C2B]">{submittedEcoResult.routeText}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500 font-semibold">수송 일시:</span>
                  <span className="font-extrabold text-slate-800">{submittedEcoResult.scheduleText}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-700 font-extrabold">최종 결제 예상 금액:</span>
                  <span className="text-lg font-black text-[#005C2B] font-mono">{submittedEcoResult.amountText}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-700 flex-shrink-0" />
                <span>코레일 물류 전담 카운슬러가 <strong>30분 이내</strong> 배정되어 개별 연락을 드립니다.</span>
              </div>

              <button
                onClick={() => setSubmittedEcoResult(null)}
                className="w-full py-3.5 rounded-2xl bg-[#005C2B] hover:bg-emerald-800 text-white font-black text-sm shadow-lg cursor-pointer transition-all"
              >
                확인 및 입찰 현황 피드 보기
              </button>
            </div>
          </div>
        )}

        {/* 유휴 빈칸이 없을 때 뜨는 팝업 모달 + 대체 유휴 공간 카드 목록 (User Requirement) */}
        {showNoSlotModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border-2 border-amber-500 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-amber-100 rounded-2xl text-amber-800 flex-shrink-0">
                    <AlertTriangle className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <div className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                      유휴 빈칸 마감 안내
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-1 tracking-tight">
                      선택하신 일시/구간에 유휴 빈칸이 없습니다
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      요청하신 <span className="font-bold text-slate-900">{departureDate} {departureTime} ({originStation || '의왕ICD'} ➔ {destinationStation || '부산신항역'})</span> 열차의 빈칸 특가 공간이 전량 소진되었습니다.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNoSlotModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-base font-black cursor-pointer p-1.5 rounded-xl hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* Notice Banner */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1.5">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>KORAIL 실시간 추천: 다른 유휴 공간(빈칸 특가) 열차를 바로 선택하세요!</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  인근 시간대 또는 대체 거점 역에 활용 가능한 유휴선로 빈칸 공간이 마련되어 있습니다. 아래 카드 중 하나를 선택하시면 동일한 특가 혜택으로 즉시 매칭 신청이 진행됩니다.
                </p>
              </div>

              {/* 대체 유휴 공간 카드 주르륵 노출 목록 */}
              <div className="space-y-3">
                <div className="text-xs font-black text-slate-800 flex items-center justify-between">
                  <span>추천 대체 유휴 공간 열차 목록 (4개 공간 조회됨)</span>
                  <span className="text-[11px] text-emerald-700 font-bold">실시간 코레일 매칭 가능</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Card 1 */}
                  <div className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 hover:bg-emerald-50 transition-all flex flex-col justify-between space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <span className="bg-[#005C2B] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        🔥 빈칸 특가 38% 할인
                      </span>
                      <span className="text-xs font-black text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                        잔여 4 TEU
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-black text-slate-900">
                        🚉 {originStation || '의왕ICD'} ➔ {destinationStation || '부산신항역'}
                      </div>
                      <div className="text-slate-700 font-extrabold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>오늘 당일 20:30 출발 (약 2시간 후)</span>
                      </div>
                      <div className="text-emerald-900 font-extrabold pt-1">
                        예상 운임: <span className="text-sm font-black text-[#005C2B] font-mono">{totalFinalEstimate.toLocaleString()}원</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectAlternativeSlot({
                        origin: originStation || '의왕ICD',
                        dest: destinationStation || '부산신항역',
                        time: '20:30',
                        dateStr: '오늘 당일',
                      })}
                      className="w-full py-2.5 rounded-xl bg-[#005C2B] hover:bg-emerald-800 text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>이 유휴 공간으로 선택 신청</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-2xl border-2 border-blue-400 bg-blue-50/70 hover:bg-blue-50 transition-all flex flex-col justify-between space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <span className="bg-blue-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        🔥 익일 아침 정기 특가
                      </span>
                      <span className="text-xs font-black text-blue-900 bg-blue-200/80 px-2 py-0.5 rounded-md">
                        잔여 8 TEU
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-black text-slate-900">
                        🚉 {originStation || '의왕ICD'} ➔ {destinationStation || '부산신항역'}
                      </div>
                      <div className="text-slate-700 font-extrabold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-700" />
                        <span>내일 아침 08:30 출발</span>
                      </div>
                      <div className="text-blue-950 font-extrabold pt-1">
                        예상 운임: <span className="text-sm font-black text-blue-800 font-mono">{totalFinalEstimate.toLocaleString()}원</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectAlternativeSlot({
                        origin: originStation || '의왕ICD',
                        dest: destinationStation || '부산신항역',
                        time: '08:30',
                        dateStr: '내일 출발',
                      })}
                      className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>이 유휴 공간으로 선택 신청</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-2xl border-2 border-purple-400 bg-purple-50/70 hover:bg-purple-50 transition-all flex flex-col justify-between space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <span className="bg-purple-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        ⚡ 인근 거점 대체 수송
                      </span>
                      <span className="text-xs font-black text-purple-900 bg-purple-200/80 px-2 py-0.5 rounded-md">
                        잔여 2 TEU
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-black text-slate-900">
                        🚉 군포화물기지 ➔ {destinationStation || '부산신항역'}
                      </div>
                      <div className="text-slate-700 font-extrabold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-700" />
                        <span>오늘 당일 21:00 출발</span>
                      </div>
                      <div className="text-purple-950 font-extrabold pt-1">
                        예상 운임: <span className="text-sm font-black text-purple-800 font-mono">{Math.round(totalFinalEstimate * 0.95).toLocaleString()}원</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectAlternativeSlot({
                        origin: '군포화물기지',
                        dest: destinationStation || '부산신항역',
                        time: '21:00',
                        dateStr: '오늘 당일',
                      })}
                      className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>이 유휴 공간으로 선택 신청</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 4 */}
                  <div className="p-4 rounded-2xl border-2 border-teal-400 bg-teal-50/70 hover:bg-teal-50 transition-all flex flex-col justify-between space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <span className="bg-teal-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        📅 익일 오후 여유 수송
                      </span>
                      <span className="text-xs font-black text-teal-900 bg-teal-200/80 px-2 py-0.5 rounded-md">
                        잔여 6 TEU
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-black text-slate-900">
                        🚉 {originStation || '의왕ICD'} ➔ {destinationStation || '부산신항역'}
                      </div>
                      <div className="text-slate-700 font-extrabold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-700" />
                        <span>내일 오후 14:00 출발</span>
                      </div>
                      <div className="text-teal-950 font-extrabold pt-1">
                        예상 운임: <span className="text-sm font-black text-teal-800 font-mono">{totalFinalEstimate.toLocaleString()}원</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectAlternativeSlot({
                        origin: originStation || '의왕ICD',
                        dest: destinationStation || '부산신항역',
                        time: '14:00',
                        dateStr: '내일 출발',
                      })}
                      className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>이 유휴 공간으로 선택 신청</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNoSlotModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer transition-all"
                >
                  닫기 및 일정 다시 수정하기
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
