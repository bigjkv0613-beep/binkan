import React, { useState, useMemo } from 'react';
import { LogisticsHub, Language } from '../types';
import { LOGISTICS_HUBS } from '../data/mockData';
import { InteractiveHubMap } from './InteractiveHubMap';
import {
  MapPin,
  Building2,
  Phone,
  ShieldCheck,
  Snowflake,
  Clock,
  Train,
  Search,
  Filter,
  CheckCircle2,
  Layers,
  Sparkles,
  Map,
  X
} from 'lucide-react';

interface LogisticsHubsProps {
  lang?: Language;
}

export const LogisticsHubs: React.FC<LogisticsHubsProps> = ({ lang = 'KO' }) => {
  const isEng = lang === 'ENG';
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHub, setSelectedHub] = useState<LogisticsHub>(LOGISTICS_HUBS[0]);
  const [phoneToast, setPhoneToast] = useState<string | null>(null);

  const regions = ['전체', '수도권', '영남권', '호남권', '충청권', '강원/대경권'];
  const categories = [
    '전체',
    'ICD (내륙컨테이너기지)',
    '항만연계역',
    '철도물류기지',
    '화물취급 일반역',
  ];

  // Filter Logic
  const filteredHubs = useMemo(() => {
    return LOGISTICS_HUBS.filter((hub) => {
      // Region match
      const regionMatch = selectedRegion === '전체' || hub.region === selectedRegion;

      // Category match
      const categoryMatch = selectedCategory === '전체' || hub.category === selectedCategory;

      // Search query match (Name, address, mainCargo)
      const q = searchQuery.toLowerCase().trim();
      const searchMatch =
        !q ||
        hub.name.toLowerCase().includes(q) ||
        hub.address.toLowerCase().includes(q) ||
        (hub.mainCargo && hub.mainCargo.toLowerCase().includes(q));

      return regionMatch && categoryMatch && searchMatch;
    });
  }, [selectedRegion, selectedCategory, searchQuery]);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        
        {/* Header Title & Controls */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#002B66] text-xs font-black border border-blue-200 mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>NATIONWIDE RAILWAY LOGISTICS NETWORK & CARGO STATIONS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                전국 철도 물류 거점 & 화물 취급 일반역 검색
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-1">
                의왕 ICD, 부산신항역, 양산 ICD는 물론 전국 20여 개 주요 화물 취급 일반역과 물류기지의 실시간 인터랙티브 지도 관제 서비스입니다.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs font-extrabold text-emerald-900">
                총 {filteredHubs.length}개 철도 물류거점 검색됨
              </span>
            </div>
          </div>

          {/* Search Bar & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input Bar */}
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="역명(예: 오봉역, 괴동역), 지역, 화물종류 검색..."
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002B66] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4 flex items-center space-x-2 overflow-x-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              <div className="flex space-x-1.5 w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#002B66] text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Tabs */}
            <div className="md:col-span-3 flex items-center space-x-1 overflow-x-auto justify-end">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Main Content Layout: Left Station List + Right Interactive Map & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Station Directory (5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-[540px] lg:h-[556px] bg-slate-200/60 border border-slate-300/80 shadow-inner rounded-3xl p-4 sm:p-5 overflow-hidden lg:sticky lg:top-24">
            {/* Header / Counter & Scroll Hint */}
            <div className="pb-3 mb-3 border-b border-slate-300/80 flex items-center justify-between shrink-0 px-1">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Train className="w-4 h-4 text-[#002B66]" />
                주요 거점 역 목록
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 hidden sm:inline-block">
                  ↕ 스크롤 가능
                </span>
                <span className="text-[11px] font-black text-[#002B66] bg-blue-100/90 px-2.5 py-0.5 rounded-full border border-blue-200">
                  총 {filteredHubs.length}개 역
                </span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 px-1.5 py-1.5 pr-2 custom-scrollbar">
            {filteredHubs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">검색 조건에 일치하는 철도역이 없습니다.</h4>
                <p className="text-xs text-slate-400">다른 역명이나 지역 키워드로 검색해 보세요.</p>
                <button
                  onClick={() => {
                    setSelectedRegion('전체');
                    setSelectedCategory('전체');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              filteredHubs.map((hub) => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <div
                    key={hub.id}
                    onClick={() => setSelectedHub(hub)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-white border-[#005C2B] ring-2 ring-emerald-500 shadow-lg'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                        {hub.region} • {hub.category}
                      </span>
                      {isSelected ? (
                        <span className="text-xs font-black text-[#005C2B] bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          지도 선택됨
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 hover:text-[#002B66]">
                          지도에서 보기 ➔
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug flex items-center justify-between">
                      <span>{hub.name}</span>
                    </h3>

                    <div className="text-xs text-slate-600 space-y-1.5">
                      <p className="flex items-center text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{hub.address}</span>
                      </p>
                      {hub.mainCargo && (
                        <p className="text-[11px] font-bold text-[#002B66] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 inline-block">
                          주요 취급: {hub.mainCargo}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>연간 수송 용량: <strong className="text-[#002B66] font-mono">{(hub.capacityTeu / 10000).toFixed(0)}만 TEU</strong></span>
                      <span className="text-slate-500">인입선: {hub.trackCount}선</span>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>

          {/* Right Column: OpenStreetMap Interactive Map + Selected Hub Specs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* OpenStreetMap Interactive Leaflet Map */}
            <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center px-2 pt-1">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Map className="w-4 h-4 text-emerald-600" />
                  실시간 카카오맵/OpenStreetMap 연계 지도 관제
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  마커를 클릭하면 해당 철도역 상세 정보를 확인하실 수 있습니다.
                </span>
              </div>

              <InteractiveHubMap
                hubs={filteredHubs}
                selectedHub={selectedHub}
                onSelectHub={(hub) => setSelectedHub(hub)}
              />
            </div>

            {/* Selected Station Detailed Spec Sheet Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-5">
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    {selectedHub.region} | {selectedHub.category}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    {selectedHub.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{selectedHub.address}</p>
                </div>

                <button
                  onClick={() => {
                    setPhoneToast(`[안내] ${selectedHub.name} 물류관리소 직통 연결 통화가 연결되었습니다. (${selectedHub.phone})`);
                    setTimeout(() => setPhoneToast(null), 4000);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-[#002B66] hover:bg-[#001D47] text-white font-extrabold text-xs shadow-md flex items-center space-x-2 cursor-pointer shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{selectedHub.phone}</span>
                </button>
              </div>

              {phoneToast && (
                <div className="p-3.5 bg-blue-900 text-white font-bold text-xs rounded-2xl shadow-lg border border-blue-700 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>{phoneToast}</span>
                  </span>
                  <button onClick={() => setPhoneToast(null)} className="text-blue-300 hover:text-white font-black ml-2">✕</button>
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold block">연간 최대 처리 용량</span>
                  <strong className="text-[#002B66] font-mono text-base font-black">
                    {selectedHub.capacityTeu.toLocaleString()} TEU
                  </strong>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold block">상하역 인입 선로 수</span>
                  <strong className="text-slate-900 text-base font-black">
                    {selectedHub.trackCount}선 ({selectedHub.trackLengthM}m)
                  </strong>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold block">주요 취급 화물</span>
                  <strong className="text-emerald-800 text-xs font-extrabold block truncate">
                    {selectedHub.mainCargo || '일반 컨테이너 및 벌크'}
                  </strong>
                </div>
              </div>

              {/* Facilities List */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="text-xs font-black text-slate-900">기지 구축 세관 및 물류 시설 현황</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className={`p-3 rounded-2xl border flex items-center space-x-2 ${selectedHub.hasCustoms ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="font-bold">보세구역 & 지정 세관 {selectedHub.hasCustoms ? '완비' : '미구축'}</span>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-center space-x-2 ${selectedHub.hasColdStorage ? 'bg-sky-50 text-sky-900 border-sky-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    <Snowflake className="w-4 h-4 shrink-0" />
                    <span className="font-bold">콜드체인 야드 {selectedHub.hasColdStorage ? '운영' : '미운영'}</span>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-center space-x-2 ${selectedHub.operates24h ? 'bg-indigo-50 text-indigo-900 border-indigo-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="font-bold">24시간 상하역 {selectedHub.operates24h ? '가동 중' : '주간 가동'}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
