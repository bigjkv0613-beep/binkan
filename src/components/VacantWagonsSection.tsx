import React, { useState } from 'react';
import { VacantWagon, GnbTab, BookingFormState, Language } from '../types';
import { SAMPLE_VACANT_WAGONS } from '../data/mockData';
import {
  Train,
  Clock,
  MapPin,
  Flame,
  CheckCircle2,
  Zap,
  ArrowRight,
  Search,
  Filter,
  Grid,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  AlertCircle,
  Sparkles,
  RefreshCw,
  X,
  Send,
  Box,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VacantWagonsSectionProps {
  onSelectWagonForBooking?: (wagon: VacantWagon) => void;
  setActiveTab?: (tab: GnbTab) => void;
  isModalMode?: boolean;
  onCloseModal?: () => void;
  lang?: Language;
}

export const VacantWagonsSection: React.FC<VacantWagonsSectionProps> = ({
  onSelectWagonForBooking,
  setActiveTab,
  isModalMode = false,
  onCloseModal,
  lang = 'KO',
}) => {
  const isEng = lang === 'ENG';
  const [wagons] = useState<VacantWagon[]>(SAMPLE_VACANT_WAGONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedLoadType, setSelectedLoadType] = useState<string>('전체');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const [bookingToast, setBookingToast] = useState<string | null>(null);

  // Category, LoadType & Region filter list
  const categories = isEng
    ? ['All', 'Container', 'Bulk', 'Flat Car', 'Reefer', 'Special Wagon']
    : ['전체', '컨테이너', '벌크', '평상화차', '냉동컨테이너', '특수화차'];

  const categoryMap: Record<string, string> = {
    All: '전체',
    Container: '컨테이너',
    Bulk: '벌크',
    'Flat Car': '평상화차',
    Reefer: '냉동컨테이너',
    'Special Wagon': '특수화차',
  };

  const loadTypes = [
    { key: '전체', label: isEng ? 'All' : '전체' },
    { key: 'FCL', label: isEng ? 'FCL (Charter)' : 'FCL (단독 전세)' },
    { key: 'LCL', label: isEng ? 'LCL (Consolidated)' : 'LCL (소량 혼적)' },
  ];

  const regions = isEng
    ? ['All', 'Capital Area', 'Yeongnam', 'Honam', 'Chungcheong', 'Gangwon']
    : ['전체', '수도권', '영남권', '호남권', '충청권', '강원권'];

  const regionMap: Record<string, string> = {
    All: '전체',
    'Capital Area': '수도권',
    Yeongnam: '영남권',
    Honam: '호남권',
    Chungcheong: '충청권',
    Gangwon: '강원권',
  };

  // Filtered wagons calculation
  const filteredWagons = wagons.filter((w) => {
    const targetCategory = categoryMap[selectedCategory] || selectedCategory;
    const matchesCategory =
      targetCategory === '전체' || w.wagonCategory === targetCategory;
    const matchesLoadType =
      selectedLoadType === '전체' || w.loadType === selectedLoadType;

    const targetRegion = regionMap[selectedRegion] || selectedRegion;
    const matchesRegion =
      targetRegion === '전체' || w.region === targetRegion;
    const matchesSearch =
      !searchQuery.trim() ||
      w.wagonType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.destinationRoute.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLoadType && matchesRegion && matchesSearch;
  });

  const handleNextCarousel = () => {
    if (filteredWagons.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % filteredWagons.length);
  };

  const handlePrevCarousel = () => {
    if (filteredWagons.length === 0) return;
    setCarouselIndex(
      (prev) => (prev - 1 + filteredWagons.length) % filteredWagons.length
    );
  };

  const handleInstantBooking = (wagon: VacantWagon) => {
    const loadTypeText = wagon.loadType === 'FCL' ? 'FCL 단독전세' : 'LCL 소량혼적';
    const toastMsg = `[당일 유휴 화차 선택] ${wagon.wagonType} [${loadTypeText}] (${wagon.stationName} ➔ ${wagon.destinationStation}, ${wagon.discountRate}% HOT 할인) 슬롯이 선택되었습니다.`;
    setBookingToast(toastMsg);

    if (onSelectWagonForBooking) {
      onSelectWagonForBooking(wagon);
    } else if (setActiveTab) {
      setActiveTab('calculator');
    }

    if (isModalMode && onCloseModal) {
      setTimeout(() => {
        onCloseModal();
      }, 1000);
    }

    setTimeout(() => {
      setBookingToast(null);
    }, 4500);
  };

  return (
    <div
      className={`${
        isModalMode
          ? 'bg-white p-4 sm:p-6 rounded-3xl max-h-[90vh] overflow-y-auto'
          : 'pb-10 bg-[#F4F7F6] min-h-screen'
      } text-slate-800`}
    >
      {/* Success Notification Toast */}
      {bookingToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#002D56] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-emerald-400 font-extrabold text-xs sm:text-sm flex items-center space-x-3 animate-bounce max-w-md">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <span>{bookingToast}</span>
        </div>
      )}

      {/* Header Banner - Full Width Top Banner */}
      <div
        className={
          isModalMode
            ? 'bg-[#0A1329] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden mb-6'
            : 'w-full bg-[#0A1329] text-white py-10 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-10 shadow-xl relative overflow-hidden border-b border-slate-800 mb-8 lg:mb-10'
        }
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className={isModalMode ? 'relative z-10' : 'max-w-[1600px] mx-auto relative z-10'}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>
                  {isEng
                    ? 'REAL-TIME SAME-DAY IDLE WAGON SLOTS · LIVE FCL/LCL AVAILABILITY'
                    : 'REAL-TIME SAME-DAY IDLE WAGON SLOTS · FCL/LCL 당일 실시간 유휴 화차 LIVE'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-3">
                <span>{isEng ? 'Same-day Available Idle Wagon Slots' : '당일 즉시 수송 가능한 유휴 화차 슬롯'}</span>
                <span className="bg-orange-500/20 text-orange-300 text-xs px-3 py-1 rounded-full border border-orange-400/40 font-extrabold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  {isEng ? 'Up to 30% HOT Discount' : '최대 30% HOT 특가'}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {isEng
                  ? 'Real-time FCL and LCL idle wagon slots available at major ICD logistics hubs nationwide. Select your route and click [Book Now] to auto-populate your booking form.'
                  : '전국 철도 물류 거점(ICD 및 주요역)에 당일 즉시 배치 가능한 FCL(단독 전세) 및 LCL(소량 혼적) 유휴 화차 슬롯입니다. 화주님의 물동량에 맞는 수송 형태 및 대기역을 확인하신 후 [당일 즉시 예약하기]를 클릭하시면 예약 폼에 정보가 자동 연동됩니다.'}
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex-shrink-0">
              <div className="p-3 bg-emerald-500 text-slate-950 rounded-xl font-black">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-300 font-bold">{isEng ? 'Available Today' : '당일 즉시 배치 가능'}</div>
                <div className="text-lg font-black text-white">
                  {isEng ? 'Total ' : '총 '}
                  <span className="text-emerald-300">{isEng ? '23 Wagons' : '23량'}</span>
                  {isEng ? ' (FCL 14 / LCL 9)' : ' 대기 중 (FCL 14량 / LCL 9량)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          isModalMode
            ? 'w-full space-y-6'
            : 'max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8'
        }
      >

        {/* Filter Controls Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEng ? 'Search terminal station or wagon type (e.g. Uiwang ICD, Busan Port)' : '대기 거점 역 또는 화차 종류 검색 (예: 의왕 ICD, 부산신항역, 평상화차)'}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-[#002D56] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Mode Toggle Switch */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 mr-1">{isEng ? 'View:' : '보기 모드:'}</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#002D56] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>{isEng ? 'Grid' : '격자 그리드'}</span>
              </button>

              <button
                onClick={() => setViewMode('carousel')}
                className={`p-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-colors cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#002D56] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
                <span>{isEng ? 'Carousel' : '슬라이드 캐러셀'}</span>
              </button>
            </div>
          </div>

          {/* Filter Bar: Load Type, Category, Region */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {/* 1. 수송 형태 필터 (FCL / LCL) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-800 mr-2 flex items-center gap-1.5 min-w-[90px]">
                <Layers className="w-4 h-4 text-orange-500" />
                {isEng ? 'Type:' : '수송 형태:'}
              </span>
              {loadTypes.map((lt) => (
                <button
                  key={lt.key}
                  onClick={() => setSelectedLoadType(lt.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    selectedLoadType === lt.key
                      ? lt.key === 'FCL'
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                        : lt.key === 'LCL'
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                        : 'bg-[#002D56] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lt.key === 'FCL' && <Box className="w-3.5 h-3.5" />}
                  {lt.key === 'LCL' && <Layers className="w-3.5 h-3.5" />}
                  <span>{lt.label}</span>
                </button>
              ))}
            </div>

            {/* 2. 화차 종류 & 3. 지역 거점 필터 */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-t border-slate-100/80">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-black text-slate-700 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#002D56]" />
                  {isEng ? 'Category:' : '화차 종류:'}
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#005C2B] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-black text-slate-700 mr-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {isEng ? 'Region:' : '지역 거점:'}
                </span>
                {regions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedRegion === reg
                        ? 'bg-[#002D56] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Render: Grid View vs Carousel View */}
        {filteredWagons.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              {isEng ? 'No matching idle wagons found for today.' : '조건에 일치하는 당일 유휴 화차가 없습니다.'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEng ? 'Try adjusting your search query or filter settings.' : '검색어나 필터 조건(FCL/LCL, 화차 종류, 거점)을 변경하여 다시 확인해 주세요.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory(isEng ? 'All' : '전체');
                setSelectedLoadType('전체');
                setSelectedRegion(isEng ? 'All' : '전체');
                setSearchQuery('');
              }}
              className="mt-2 inline-flex items-center space-x-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isEng ? 'Reset Filters' : '필터 초기화'}</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWagons.map((wagon) => (
              <WagonCard
                key={wagon.id}
                wagon={wagon}
                onInstantBooking={handleInstantBooking}
                lang={lang}
              />
            ))}
          </div>
        ) : (
          /* Carousel View Layout */
          <div className="relative bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-black text-slate-800 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {isEng ? 'Idle Wagon Slot' : '당일 유휴 화차 슬롯'} ({carouselIndex + 1} / {filteredWagons.length})
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevCarousel}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextCarousel}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <WagonCard
                wagon={filteredWagons[carouselIndex]}
                onInstantBooking={handleInstantBooking}
                isExpandedView={true}
                lang={lang}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* Sub-component: Individual Wagon Card Slot */
interface WagonCardProps {
  wagon: VacantWagon;
  onInstantBooking: (wagon: VacantWagon) => void;
  isExpandedView?: boolean;
  lang?: Language;
}

const WagonCard: React.FC<WagonCardProps> = ({
  wagon,
  onInstantBooking,
  isExpandedView = false,
  lang = 'KO',
}) => {
  const isEng = lang === 'ENG';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1 relative">
      {/* Top Banner & Hot Badge */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-slate-300">
            {wagon.trainNo || '#3001B'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-200 font-extrabold">
            {wagon.region}
          </span>
        </div>

        {wagon.isHot ? (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-black shadow-xs">
            <Flame className="w-3 h-3 fill-white" />
            <span>{wagon.discountRate}% {isEng ? 'HOT OFF' : 'HOT 할인'}</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-black">
            <Tag className="w-3 h-3" />
            <span>{wagon.discountRate}% {isEng ? 'Special' : '특가 적용'}</span>
          </span>
        )}
      </div>

      {/* Card Body Content */}
      <div className="p-6 space-y-4 flex-1">
        {/* 1. 화차 종류 & 규격 + FCL / LCL Badge */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="text-[11px] font-black uppercase text-[#005C2B] tracking-wider flex items-center gap-1">
              <Train className="w-3.5 h-3.5" />
              <span>{isEng ? 'Wagon Type & Specs' : '화차 종류 및 규격'}</span>
            </div>

            {/* FCL / LCL High-Contrast Badge */}
            {wagon.loadType === 'FCL' ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-blue-900 text-blue-100 border border-blue-700 text-[11px] font-black shadow-xs">
                <Box className="w-3 h-3 text-blue-300" />
                <span>{isEng ? 'FCL - Charter' : 'FCL - 단독 전세'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-emerald-900 text-emerald-100 border border-emerald-700 text-[11px] font-black shadow-xs">
                <Layers className="w-3 h-3 text-emerald-300" />
                <span>{isEng ? 'LCL - Consolidated' : 'LCL - 소량 혼적 가능'}</span>
              </span>
            )}
          </div>

          <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
            {wagon.wagonType}
          </h3>
        </div>

        {/* 2. 현재 대기 거점 역 & 당일 잔여 수량 */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
          <div>
            <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-500" />
              <span>{isEng ? 'Current Station' : '현재 대기 거점 역'}</span>
            </div>
            <div className="text-xs font-black text-slate-900 mt-0.5 truncate">
              {wagon.stationName}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{isEng ? 'Remaining Today' : '당일 잔여 수량'}</span>
            </div>
            <div className="text-xs font-black text-[#002D56] mt-0.5 flex items-center gap-1">
              <span className="text-sm font-extrabold text-orange-600">
                {wagon.remainingCount}{isEng ? ' Units' : '량'}
              </span>
              <span className="text-[10px] text-slate-500 font-normal">{isEng ? 'left' : '남음'}</span>
            </div>
          </div>
        </div>

        {/* 3. 당일 출발 가능 시간 & 목적지 노선 */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {isEng ? 'Departure Time:' : '출발 가능 시각:'}
            </span>
            <strong className="font-black text-slate-900 bg-blue-50 text-blue-900 px-2 py-0.5 rounded-md border border-blue-200">
              {wagon.departureTime}
            </strong>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Send className="w-3.5 h-3.5 text-[#005C2B]" />
              {isEng ? 'Route:' : '목적지 노선:'}
            </span>
            <strong className="font-extrabold text-[#002D56] truncate max-w-[180px]">
              {wagon.destinationRoute}
            </strong>
          </div>
        </div>

        {/* Price & Discount Display */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 line-through mr-1.5">
              {wagon.originalPrice.toLocaleString()}{isEng ? ' KRW' : '원'}
            </span>
            <span className="text-xs font-extrabold text-orange-600">
              [{wagon.discountRate}% OFF]
            </span>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-bold">{isEng ? 'Special Freight Fare' : '당일 특가 운임'}</div>
            <div className="text-lg font-black text-[#002D56]">
              {wagon.discountPrice.toLocaleString()}
              <span className="text-xs font-bold text-slate-600">{isEng ? ' KRW / unit' : ' 원 / 량'}</span>
            </div>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {wagon.features.map((feat, idx) => (
            <span
              key={idx}
              className="text-[10px] font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md"
            >
              ✓ {feat}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Action Button: [당일 즉시 예약하기] */}
      <div className="p-4 bg-slate-50 border-t border-slate-150">
        <button
          type="button"
          onClick={() => onInstantBooking(wagon)}
          className="w-full py-3 px-4 bg-[#005C2B] hover:bg-emerald-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer group-hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{isEng ? 'Book Immediately' : '당일 즉시 예약하기'}</span>
          <ArrowRight className="w-4 h-4 text-white ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
