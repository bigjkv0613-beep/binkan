import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Truck,
  Train,
  DollarSign,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Download,
  MapPin,
  Package,
  Scale,
  Layers,
  Percent,
  TrendingDown,
  Info,
  FileText,
  Share2,
  Zap,
} from 'lucide-react';
import { Language, GnbTab } from '../types';

interface FreightCalculatorProps {
  lang?: Language;
  setActiveTab?: (tab: GnbTab) => void;
}

// Key Railway Freight Stations & Inter-Station Distances (km)
interface Station {
  id: string;
  name: string;
  nameEng: string;
  region: string;
}

const STATIONS: Station[] = [
  { id: 'uiwang', name: '의왕 ICD / 오봉역', nameEng: 'Uiwang ICD / Obong Stn', region: '수도권' },
  { id: 'busan_new', name: '부산신항역', nameEng: 'Busan New Port Stn', region: '영남권' },
  { id: 'gwangyang', name: '광양항역', nameEng: 'Gwangyang Port Stn', region: '호남권' },
  { id: 'incheon', name: '인천항역 / 인천남항', nameEng: 'Incheon Port Stn', region: '수도권' },
  { id: 'donghae', name: '동해역 / 삼척', nameEng: 'Donghae Stn', region: '강원권' },
  { id: 'jecheon', name: '제천역 / 단양', nameEng: 'Jecheon Stn', region: '충청권' },
  { id: 'pohang', name: '포항역 / 괴동역', nameEng: 'Pohang Stn', region: '영남권' },
  { id: 'gunsan', name: '군산화물역', nameEng: 'Gunsan Freight Stn', region: '호남권' },
  { id: 'custom', name: '직접 입력 / 기타 노선', nameEng: 'Custom Route Input', region: '기타' },
];

// Predefined Distances Mapping (km)
const ROUTE_DISTANCES: Record<string, number> = {
  'uiwang-busan_new': 395,
  'busan_new-uiwang': 395,
  'uiwang-gwangyang': 330,
  'gwangyang-uiwang': 330,
  'uiwang-incheon': 65,
  'incheon-uiwang': 65,
  'uiwang-pohang': 350,
  'pohang-uiwang': 350,
  'uiwang-donghae': 280,
  'donghae-uiwang': 280,
  'uiwang-jecheon': 145,
  'jecheon-uiwang': 145,
  'busan_new-gwangyang': 165,
  'gwangyang-busan_new': 165,
  'incheon-busan_new': 430,
  'busan_new-incheon': 430,
  'donghae-jecheon': 135,
  'jecheon-donghae': 135,
  'pohang-busan_new': 120,
  'busan_new-pohang': 120,
};

// Cargo Categories & Rates
interface CargoCategoryOption {
  id: string;
  name: string;
  nameEng: string;
  unitRatePerTonKm: number; // KRW per ton-km
  containerUnitRate?: number; // KRW per container-km if container
  defaultWeightPerUnit: number; // default weight (ton) per unit
  iconName: string;
  unitLabel: string;
}

const CARGO_TYPES: CargoCategoryOption[] = [
  {
    id: 'container',
    name: '컨테이너',
    nameEng: 'Container',
    unitRatePerTonKm: 45.0,
    defaultWeightPerUnit: 20,
    iconName: 'Box',
    unitLabel: '개',
  },
  {
    id: 'bulk',
    name: '벌크 화물 (광석/유연탄)',
    nameEng: 'Bulk Cargo (Ore/Coal)',
    unitRatePerTonKm: 51.5,
    defaultWeightPerUnit: 50,
    iconName: 'Layers',
    unitLabel: '화차 (량)',
  },
  {
    id: 'steel',
    name: '철강 (코일/후판)',
    nameEng: 'Steel (Coil/Plate)',
    unitRatePerTonKm: 47.5,
    defaultWeightPerUnit: 45,
    iconName: 'Shield',
    unitLabel: '화차 (량)',
  },
  {
    id: 'cement',
    name: '시멘트 (분체/슬래그)',
    nameEng: 'Cement (Powder/Slag)',
    unitRatePerTonKm: 59.0,
    defaultWeightPerUnit: 40,
    iconName: 'Building',
    unitLabel: '화차 (량)',
  },
  {
    id: 'general',
    name: '기타 일반 화물',
    nameEng: 'General Freight',
    unitRatePerTonKm: 45.9,
    defaultWeightPerUnit: 30,
    iconName: 'Package',
    unitLabel: '화차 (량)',
  },
];

export const FreightCalculator: React.FC<FreightCalculatorProps> = ({
  lang = 'KO',
  setActiveTab,
}) => {
  const isEng = lang === 'ENG';

  // --- INPUT STATES ---
  const [originStationId, setOriginStationId] = useState<string>('uiwang');
  const [destinationStationId, setDestinationStationId] = useState<string>('busan_new');
  const [customDistanceKm, setCustomDistanceKm] = useState<number>(395);
  const [cargoTypeId, setCargoTypeId] = useState<string>('container');
  const [weightTonPerUnit, setWeightTonPerUnit] = useState<number>(20);
  const [cargoQuantity, setCargoQuantity] = useState<number>(10);
  const [includeVat, setIncludeVat] = useState<boolean>(true);
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);

  // --- TRUCK DRAYAGE (연계 트럭 수송비) STATES ---
  const [includeDrayageTruck, setIncludeDrayageTruck] = useState<boolean>(true);
  const [drayageScope, setDrayageScope] = useState<'both' | 'first' | 'last'>('both');
  const [drayageCostPerTruckTrip, setDrayageCostPerTruckTrip] = useState<number>(180000);

  // Determine Distance
  const effectiveDistanceKm = useMemo(() => {
    if (originStationId === 'custom' || destinationStationId === 'custom' || originStationId === destinationStationId) {
      return customDistanceKm;
    }
    const key = `${originStationId}-${destinationStationId}`;
    return ROUTE_DISTANCES[key] || customDistanceKm;
  }, [originStationId, destinationStationId, customDistanceKm]);

  // Selected Cargo Spec
  const currentCargoSpec = useMemo(() => {
    return CARGO_TYPES.find((c) => c.id === cargoTypeId) || CARGO_TYPES[0];
  }, [cargoTypeId]);

  // Handle Station Change
  const handleOriginChange = (id: string) => {
    setOriginStationId(id);
    const key = `${id}-${destinationStationId}`;
    if (ROUTE_DISTANCES[key]) {
      setCustomDistanceKm(ROUTE_DISTANCES[key]);
    }
  };

  const handleDestinationChange = (id: string) => {
    setDestinationStationId(id);
    const key = `${originStationId}-${id}`;
    if (ROUTE_DISTANCES[key]) {
      setCustomDistanceKm(ROUTE_DISTANCES[key]);
    }
  };

  // Quick Preset Route Selection
  const applyPresetRoute = (origin: string, dest: string) => {
    setOriginStationId(origin);
    setDestinationStationId(dest);
    const key = `${origin}-${dest}`;
    if (ROUTE_DISTANCES[key]) {
      setCustomDistanceKm(ROUTE_DISTANCES[key]);
    }
  };

  // --- COST CALCULATIONS ---
  const totalWeightTon = useMemo(() => {
    return Math.round(weightTonPerUnit * cargoQuantity * 10) / 10;
  }, [weightTonPerUnit, cargoQuantity]);

  // 1. Freight Train Rail Cost (Including Optional Drayage Truck)
  const railCalculation = useMemo(() => {
    const dist = Math.max(100, effectiveDistanceKm); // minimum tariff distance 100km
    let basePureRailTariff = 0;

    if (currentCargoSpec.containerUnitRate) {
      const perContainerKm = currentCargoSpec.containerUnitRate;
      basePureRailTariff = perContainerKm * dist * cargoQuantity;
    } else {
      const perTonKm = currentCargoSpec.unitRatePerTonKm;
      basePureRailTariff = perTonKm * dist * totalWeightTon;
    }

    // Pure Rail Freight Tariff
    const pureRailTariff = Math.round(basePureRailTariff / 100) * 100;

    // Truck Drayage (셔틀 수송비) Calculation
    const drayageTruckCount = Math.max(1, Math.ceil(totalWeightTon / 25));
    const scopeMultiplier = drayageScope === 'both' ? 2 : 1;
    const rawDrayageCost = includeDrayageTruck
      ? drayageTruckCount * drayageCostPerTruckTrip * scopeMultiplier
      : 0;
    const drayageCost = Math.round(rawDrayageCost / 100) * 100;

    // Combined pure cost
    const pureTariff = pureRailTariff + drayageCost;

    const vat = Math.round((pureTariff * 0.1) / 100) * 100;
    const totalWithVat = pureTariff + vat;

    return {
      pureRailTariff,
      drayageCost,
      pureTariff,
      vat,
      totalWithVat,
      effectiveDist: dist,
      drayageTruckCount,
      scopeMultiplier,
      unitRateDisplay:
        currentCargoSpec.containerUnitRate
          ? `${currentCargoSpec.containerUnitRate.toLocaleString()}원 / 개·km`
          : `${currentCargoSpec.unitRatePerTonKm}원 / Ton·km`,
    };
  }, [
    effectiveDistanceKm,
    currentCargoSpec,
    cargoQuantity,
    totalWeightTon,
    includeDrayageTruck,
    drayageScope,
    drayageCostPerTruckTrip,
  ]);

  // 2. Existing Road Heavy Truck Freight Cost (Comparison Baseline)
  const truckCalculation = useMemo(() => {
    const dist = Math.max(20, effectiveDistanceKm);
    
    // Road Truck Estimation Engine:
    // Heavy 25t Truck / Container Trailer base rate ~ 185 KRW per Ton-km
    // Plus minimum base dispatch fee per truck (~380,000 KRW for long haul)
    const truckCount = Math.max(1, Math.ceil(totalWeightTon / 25));
    const basePerTruck = Math.max(250000, dist * 1450);
    const rawTruckCost = Math.round(truckCount * basePerTruck + totalWeightTon * dist * 85);

    const pureTariff = Math.round(rawTruckCost / 100) * 100;
    const vat = Math.round((pureTariff * 0.1) / 100) * 100;
    const totalWithVat = pureTariff + vat;

    return {
      pureTariff,
      vat,
      totalWithVat,
      truckCount,
      costPerTon: Math.round(pureTariff / Math.max(1, totalWeightTon)),
    };
  }, [effectiveDistanceKm, totalWeightTon]);

  // 3. Savings Calculation (Highlight)
  const savingsCalculation = useMemo(() => {
    const railCost = includeVat ? railCalculation.totalWithVat : railCalculation.pureTariff;
    const truckCost = includeVat ? truckCalculation.totalWithVat : truckCalculation.pureTariff;

    const savingsAmount = Math.max(0, truckCost - railCost);
    const savingsPercent = truckCost > 0 ? Math.round((savingsAmount / truckCost) * 100) : 0;
    const savingsPerTon = totalWeightTon > 0 ? Math.round(savingsAmount / totalWeightTon) : 0;

    return {
      savingsAmount,
      savingsPercent,
      savingsPerTon,
      railCost,
      truckCost,
    };
  }, [includeVat, railCalculation, truckCalculation, totalWeightTon]);

  // Get Station Name
  const getStationName = (id: string) => {
    const st = STATIONS.find((s) => s.id === id);
    if (!st) return '미지정 역';
    return isEng ? st.nameEng : st.name;
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#005C2B]/10 text-[#005C2B] text-xs font-black border border-[#005C2B]/20">
              <Calculator className="w-4 h-4 text-[#005C2B]" />
              <span>{isEng ? 'FREIGHT COST SIMULATION ENGINE' : '화물 운송비 산정 시뮬레이터'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isEng ? "BinKan's Freight Cost Calculator & Savings Analysis" : '운송비 계산 (시뮬레이터)'}
            </h1>
            <p className="text-sm text-slate-600 font-medium max-w-3xl">
              {isEng
                ? 'Select departure/destination stations, cargo category, weight, and quantity to calculate estimated rail freight tariffs and compare cost savings against road truck transport.'
                : '출발역, 도착역, 화물 종류, 무게 및 수량을 선택하면 KORAIL 공식 화물 운임 기준에 따른 예상 운임을 산출하고, 기존 도로 트럭 운송 대비 절감 효과를 한눈에 비교해 드립니다.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center">
            <button
              onClick={() => setIncludeVat(!includeVat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black border transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
                includeVat
                  ? 'bg-emerald-50 text-[#005C2B] border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${includeVat ? 'text-[#005C2B]' : 'text-slate-400'}`} />
              <span>{includeVat ? (isEng ? 'VAT Included (10%)' : '부가가치세 포함 (10%)') : (isEng ? 'VAT Excluded' : '부가가치세 별도')}</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: SHIPPERS INPUT FORM & MAIN SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: 1. 화주 입력 폼 (Input Form - 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
              <div className="p-3 rounded-2xl bg-[#005C2B] text-white font-black shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black text-[#005C2B] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {isEng ? 'STEP 1. SHIPPER INPUT' : '1. 화주 조건 입력'}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {isEng ? 'Cargo Shipping Parameters' : '화물 운송 정보 및 규격 선택'}
                </h2>
              </div>
            </div>

            {/* Quick Preset Routes Chips */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{isEng ? 'Popular Logistics Routes' : '주요 철도 물류 노선 바로선택'}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPresetRoute('uiwang', 'busan_new')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    originStationId === 'uiwang' && destinationStationId === 'busan_new'
                      ? 'bg-[#002B66] text-white border-[#002B66] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  의왕ICD ⇄ 부산신항 (395km)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetRoute('gwangyang', 'uiwang')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    originStationId === 'gwangyang' && destinationStationId === 'uiwang'
                      ? 'bg-[#002B66] text-white border-[#002B66] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  광양항 ⇄ 의왕ICD (330km)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetRoute('donghae', 'uiwang')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    originStationId === 'donghae' && destinationStationId === 'uiwang'
                      ? 'bg-[#002B66] text-white border-[#002B66] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  동해역 ⇄ 의왕/오봉 (280km)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetRoute('incheon', 'busan_new')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    originStationId === 'incheon' && destinationStationId === 'busan_new'
                      ? 'bg-[#002B66] text-white border-[#002B66] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  인천항 ⇄ 부산신항 (430km)
                </button>
              </div>
            </div>

            {/* 1. Station Select Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              
              {/* Departure Station */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-[#005C2B]" />
                  <span>{isEng ? 'Origin Station' : '출발역 선택'}</span>
                </label>
                <select
                  value={originStationId}
                  onChange={(e) => handleOriginChange(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#005C2B] focus:outline-none"
                >
                  {STATIONS.map((st) => (
                    <option key={st.id} value={st.id}>
                      [{st.region}] {isEng ? st.nameEng : st.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Station */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-blue-700" />
                  <span>{isEng ? 'Destination Station' : '도착역 선택'}</span>
                </label>
                <select
                  value={destinationStationId}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  {STATIONS.map((st) => (
                    <option key={st.id} value={st.id}>
                      [{st.region}] {isEng ? st.nameEng : st.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance adjustment slider */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-700">
                    {isEng ? 'Railway Distance:' : '노선 수송 거리:'}
                  </span>
                  <span className="font-black text-[#002B66] font-mono text-base">
                    {effectiveDistanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={800}
                  step={5}
                  value={effectiveDistanceKm}
                  onChange={(e) => {
                    setOriginStationId('custom');
                    setDestinationStationId('custom');
                    setCustomDistanceKm(parseInt(e.target.value));
                  }}
                  className="w-full accent-[#002B66] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>30km (근거리)</span>
                  <span>395km (의왕-부산)</span>
                  <span>800km (장거리)</span>
                </div>
              </div>

            </div>

            {/* 2. Cargo Type Select */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-[#005C2B]" />
                <span>{isEng ? 'Cargo Type' : '화물 종류 선택'}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CARGO_TYPES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCargoTypeId(cat.id);
                      setWeightTonPerUnit(cat.defaultWeightPerUnit);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      cargoTypeId === cat.id
                        ? 'bg-[#005C2B] text-white border-[#005C2B] shadow-md font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-black truncate">
                      {isEng ? cat.nameEng : cat.name}
                    </div>
                    <div className="text-[10px] opacity-80 mt-1 font-mono">
                      {cat.containerUnitRate
                        ? `${cat.containerUnitRate}원/개·km`
                        : `${cat.unitRatePerTonKm}원/Ton·km`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Weight & Quantity Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              
              {/* Weight Ton per Unit */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Scale className="w-4 h-4 text-[#005C2B]" />
                    <span>{isEng ? 'Unit Cargo Weight (Ton)' : '단위당 화물 무게 (Ton)'}</span>
                  </label>
                  <span className="font-black text-[#005C2B] font-mono text-base">
                    {weightTonPerUnit} Ton
                  </span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={weightTonPerUnit}
                  onChange={(e) => setWeightTonPerUnit(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                />
                <input
                  type="range"
                  min={1}
                  max={60}
                  step={1}
                  value={weightTonPerUnit}
                  onChange={(e) => setWeightTonPerUnit(parseFloat(e.target.value))}
                  className="w-full accent-[#005C2B] cursor-pointer"
                />
              </div>

              {/* Cargo Quantity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-4 h-4 text-[#002B66]" />
                    <span>{isEng ? 'Cargo Quantity' : `화물 수량 (${currentCargoSpec.unitLabel})`}</span>
                  </label>
                  <span className="font-black text-[#002B66] font-mono text-base">
                    {cargoQuantity} {currentCargoSpec.unitLabel}
                  </span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={cargoQuantity}
                  onChange={(e) => setCargoQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                />
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={cargoQuantity}
                  onChange={(e) => setCargoQuantity(parseInt(e.target.value))}
                  className="w-full accent-[#002B66] cursor-pointer"
                />
              </div>

              {/* Total Summary Bar */}
              <div className="sm:col-span-2 bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-[#005C2B]">
                  {isEng ? 'Calculated Total Shipping Weight:' : '총 물류 수송 중량:'}
                </span>
                <span className="font-black text-[#005C2B] font-mono text-base">
                  {totalWeightTon.toLocaleString()} Ton
                </span>
              </div>

            </div>

            {/* 4. Truck Drayage (연계 트럭 수송비) Options */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>{isEng ? 'Include Truck Drayage (First/Last Mile)' : '연계 트럭 수송비 포함 (셔틀/드레이지)'}</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIncludeDrayageTruck(!includeDrayageTruck)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                    includeDrayageTruck
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <span>{includeDrayageTruck ? (isEng ? 'Included' : '트럭 수송 포함') : (isEng ? 'Rail Only' : '철도 단독')}</span>
                </button>
              </div>

              {includeDrayageTruck && (
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-3 text-xs">
                  <div className="text-slate-700 font-semibold leading-relaxed">
                    공장/창고 ↔ 철도역 간 연계 트럭(First/Last Mile 셔틀) 수송 비용을 운임에 포함합니다.
                  </div>

                  {/* Drayage Scope selection */}
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-slate-800 block text-[11px]">셔틀 수송 구간 선택:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setDrayageScope('both')}
                        className={`py-2 px-2 rounded-xl text-center font-extrabold text-[11px] border transition-all cursor-pointer ${
                          drayageScope === 'both'
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isEng ? 'Both (First+Last)' : '양방향 (출발+도착역)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrayageScope('first')}
                        className={`py-2 px-2 rounded-xl text-center font-extrabold text-[11px] border transition-all cursor-pointer ${
                          drayageScope === 'first'
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isEng ? 'First-Mile Only' : '출발역 셔틀만'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrayageScope('last')}
                        className={`py-2 px-2 rounded-xl text-center font-extrabold text-[11px] border transition-all cursor-pointer ${
                          drayageScope === 'last'
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isEng ? 'Last-Mile Only' : '도착역 셔틀만'}
                      </button>
                    </div>
                  </div>

                  {/* Drayage Cost slider/input */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-extrabold text-slate-800">25t 트럭 셔틀 1회당 적용 비용:</span>
                      <span className="font-mono font-black text-amber-900 text-xs">
                        {drayageCostPerTruckTrip.toLocaleString()} 원/대
                      </span>
                    </div>
                    <input
                      type="range"
                      min={80000}
                      max={400000}
                      step={10000}
                      value={drayageCostPerTruckTrip}
                      onChange={(e) => setDrayageCostPerTruckTrip(parseInt(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Subtotal badge */}
                  <div className="bg-white p-2.5 rounded-xl border border-amber-300/80 flex items-center justify-between font-bold text-amber-950">
                    <span>
                      연계 트럭 수송비 총액 ({railCalculation.drayageTruckCount}대 × {drayageScope === 'both' ? '2회' : '1회'}):
                    </span>
                    <span className="font-mono font-black text-amber-800">
                      +{railCalculation.drayageCost.toLocaleString()} 원
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: 2. 계산 및 비용 절감 결과 화면 (Output - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CORE HIGHLIGHT SAVINGS SUMMARY CARD */}
            <div className="bg-[#0B1930] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-blue-900/40">
              
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 rounded-xl bg-white/20 text-white font-black border border-white/30 shadow-sm">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase text-white/80 tracking-wider">
                      {isEng ? 'CORE SAVINGS HIGHLIGHT' : '비용 절감 효과 요약 (핵심 강조)'}
                    </span>
                    <h3 className="text-lg font-black text-white">
                      {isEng ? 'Logistics Cost Comparison' : '물류비 절감 핵심 수치'}
                    </h3>
                  </div>
                </div>

                <div className="bg-white/20 text-white border border-white/40 text-xs font-black px-3 py-1 rounded-full animate-pulse shadow-md backdrop-blur-md">
                  {savingsCalculation.savingsPercent}% {isEng ? 'SAVED' : '절감'}
                </div>
              </div>

              {/* Savings Big Highlight Display */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-2">
                <div className="text-xs text-white/90 font-extrabold flex items-center justify-between">
                  <span>{isEng ? 'Logistics Cost Savings Amount' : '물류비 절감액 (트럭 대비)'}</span>
                  <span className="text-white/70 font-mono">[트럭 운임비 - 화물열차 운임비]</span>
                </div>
                
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {savingsCalculation.savingsAmount.toLocaleString()} <span className="text-lg font-normal text-white/90">원</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/90">
                  <span>{isEng ? 'Savings Percentage:' : '물류비 절감 비율:'}</span>
                  <span className="text-xl font-black text-white font-mono">
                    {savingsCalculation.savingsPercent}% {isEng ? 'Cost Reduction' : '비용 절감'}
                  </span>
                </div>
              </div>

              {/* Comparison Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                
                {/* 1. Rail Freight Estimated Tariff */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20 space-y-1 backdrop-blur-md">
                  <div className="text-[11px] text-white/90 font-extrabold flex items-center space-x-1">
                    <Train className="w-3.5 h-3.5 text-white" />
                    <span>{isEng ? 'Rail Freight' : '화물열차 예상 운임'}</span>
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {savingsCalculation.railCost.toLocaleString()} 원
                  </div>
                  <div className="text-[10px] text-white/70 opacity-90">
                    {includeVat ? 'VAT 포함' : 'VAT 별도'}
                  </div>
                </div>

                {/* 2. Existing Road Truck Tariff */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20 space-y-1 backdrop-blur-md">
                  <div className="text-[11px] text-white/90 font-extrabold flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-white" />
                    <span>{isEng ? 'Road Truck Tariff' : '기존 도로 트럭 운임'}</span>
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {savingsCalculation.truckCost.toLocaleString()} 원
                  </div>
                  <div className="text-[10px] text-white/70 opacity-90">
                    25톤 대형트럭 {truckCalculation.truckCount}대 분량
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-3.5 bg-white/20 hover:bg-white/30 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer border border-white/30 backdrop-blur-md"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span className="text-white">{isEng ? 'View & Print Freight Quote' : '산출 운임 견적서 확인 및 인쇄'}</span>
                </button>
              </div>

            </div>

            {/* DETAILS COMPARISON CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4 text-xs">
              
              <div className="flex items-center space-x-2 font-black text-slate-900 border-b border-slate-200 pb-3 text-sm">
                <Info className="w-4 h-4 text-[#005C2B]" />
                <span>{isEng ? 'Tariff Calculation Details' : '운임 산출 산식 및 상세 정보'}</span>
              </div>

              <div className="space-y-2 text-slate-600 font-medium">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">• 구간 노선:</span>
                  <span className="font-bold text-slate-900">
                    {getStationName(originStationId)} ➔ {getStationName(destinationStationId)} ({effectiveDistanceKm}km)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">• 화물 구편:</span>
                  <span className="font-bold text-slate-900">
                    {isEng ? currentCargoSpec.nameEng : currentCargoSpec.name} ({cargoQuantity}{currentCargoSpec.unitLabel})
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">• 총 수송 중량:</span>
                  <span className="font-bold text-slate-900">{totalWeightTon.toLocaleString()} Ton</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">• 철도 순수 운임:</span>
                  <span className="font-bold text-slate-900 font-mono">{railCalculation.pureRailTariff.toLocaleString()} 원</span>
                </div>

                {includeDrayageTruck && (
                  <div className="flex justify-between py-1 border-b border-slate-100 text-amber-900">
                    <span className="text-amber-800">• 연계 트럭 수송비:</span>
                    <span className="font-bold font-mono">+{railCalculation.drayageCost.toLocaleString()} 원</span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">• 적용 단가 기준:</span>
                  <span className="font-bold text-slate-900">{railCalculation.unitRateDisplay}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">• 1톤 당 수송비:</span>
                  <span className="font-bold text-[#005C2B] font-mono">
                    복합철도 {Math.round(savingsCalculation.railCost / Math.max(1, totalWeightTon)).toLocaleString()}원 / Ton vs 도로트럭 {truckCalculation.costPerTon.toLocaleString()}원 / Ton
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* QUOTE MODAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-[#005C2B] text-white rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isEng ? 'Freight Tariff Quote' : 'KORAIL 화물 운송 예상 견적서'}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    발급번호: BINKAN-EST-{Date.now().toString().slice(-6)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-xl px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quote Body */}
            <div className="space-y-4 text-xs text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-400 font-bold block text-[11px]">출발/도착 구간</span>
                  <span className="font-black text-slate-900 text-sm">
                    {getStationName(originStationId)} ➔ {getStationName(destinationStationId)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[11px]">수송 거리</span>
                  <span className="font-black text-slate-900 text-sm">{effectiveDistanceKm} km</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-400 font-bold block text-[11px]">화물 종류 및 수량</span>
                  <span className="font-bold text-slate-900">
                    {currentCargoSpec.name} ({cargoQuantity}{currentCargoSpec.unitLabel})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[11px]">총 물류 중량</span>
                  <span className="font-bold text-slate-900">{totalWeightTon.toLocaleString()} Ton</span>
                </div>
              </div>

              {/* Price Calculation Table */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>철도 순수 운임료:</span>
                  <span className="font-bold font-mono">{railCalculation.pureRailTariff.toLocaleString()} 원</span>
                </div>
                {includeDrayageTruck && (
                  <div className="flex justify-between text-amber-900 font-bold">
                    <span>연계 트럭 수송비 (셔틀):</span>
                    <span className="font-mono">+{railCalculation.drayageCost.toLocaleString()} 원</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>부가가치세 (VAT 10%):</span>
                  <span className="font-bold font-mono">{railCalculation.vat.toLocaleString()} 원</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                  <span>최종 화물 수송 운임 합계:</span>
                  <span className="text-[#005C2B] font-mono font-black text-base">
                    {railCalculation.totalWithVat.toLocaleString()} 원
                  </span>
                </div>
              </div>

              {/* Comparison Box inside modal */}
              <div className="bg-emerald-100 border border-emerald-300 p-3.5 rounded-xl space-y-1 text-emerald-950 font-bold">
                <div className="flex justify-between">
                  <span>기존 도로 트럭 운임 예상:</span>
                  <span className="font-mono">{truckCalculation.totalWithVat.toLocaleString()} 원</span>
                </div>
                <div className="flex justify-between text-[#005C2B] font-black text-sm pt-1 border-t border-emerald-200">
                  <span>예상 물류비 절감액:</span>
                  <span className="font-mono">{savingsCalculation.savingsAmount.toLocaleString()}원 ({savingsCalculation.savingsPercent}% 절감)</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    window.print();
                  } catch (err) {
                    console.warn('Print not supported in this frame', err);
                  }
                }}
                className="flex-1 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>인쇄 / PDF 저장</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="px-5 py-3 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300 transition-all cursor-pointer"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
