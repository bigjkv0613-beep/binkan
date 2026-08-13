import React, { useState } from 'react';
import { GnbTab, Language } from '../types';
import { Search, Train, ArrowRight, ShieldCheck, Zap, Leaf, ChevronRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  setActiveTab: (tab: GnbTab) => void;
  onSearchTracking: (code: string) => void;
  lang?: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  setActiveTab,
  onSearchTracking,
  lang = 'KO',
}) => {
  const [inputCode, setInputCode] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputCode.trim() || 'KR-2026-8801';
    onSearchTracking(query);
  };

  const handleQuickSampleClick = (code: string) => {
    setInputCode(code);
    onSearchTracking(code);
  };

  const isEng = lang === 'ENG';

  return (
    <div className="w-full pb-6">
      {/* Main Hero Section - Full Width, Edge-to-Edge with Desaturated Natural Photo */}
      <section className="relative overflow-hidden w-full bg-slate-900 text-white min-h-[580px] lg:min-h-[620px] py-10 lg:py-14 shadow-lg flex flex-col justify-between">
        
        {/* 1. Full-screen Edge-to-Edge Railway & Nature Background Photo (Low Saturation) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center saturate-[0.7] brightness-[0.95] transition-transform duration-700 hover:scale-102"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=2400&q=85')` 
          }}
        />

        {/* 2. Soft Neutral Dark Overlay (No Green Gradient) for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-900/35 to-transparent z-10" />

        {/* 3. Hero Foreground Content (Z-20, Centered inside 1600px container) */}
        <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Text & Stats Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* 1. Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#002D56]/85 border border-emerald-600/60 text-emerald-200 text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg">
              <span>
                {isEng
                  ? 'GREEN RAILWAYS & MOBILITY · Eco-friendly Rail Logistics Connecting Nature & Future'
                  : 'GREEN RAILWAYS & MOBILITY · 자연과 미래를 잇는 친환경 철도물류'}
              </span>
            </div>

            {/* 2. Main H1 Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              <span className="block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {isEng ? 'Green Transport Innovation' : '푸른 자연을 달리는'}
              </span>
              <span className="inline-block mt-2 px-5 py-1.5 bg-[#005C2B]/40 backdrop-blur-md text-white rounded-2xl shadow-xl border border-[#005C2B]">
                {isEng ? 'Connecting Eco Rail Freight' : '녹색 수송 혁신'}
              </span>
            </h1>

            {/* 3. Subtext */}
            <p className="text-white text-sm sm:text-base leading-relaxed font-semibold max-w-2xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {isEng
                ? 'KORAIL’s sustainable logistics platform significantly reduces carbon emissions across national rail corridors. Experience real-time cargo tracking, idle wagon discounts, and smart freight bookings.'
                : '울창한 숲과 국토를 가로지르며 탄소 배출을 획기적으로 줄이는 한국철도공사의 지속가능한 물류 플랫폼. 실시간 화물 위치 추적부터 빈칸 특가로 신청하기, 최적 운송 예약까지 스마트하게 경험하세요.'}
            </p>

            {/* 4. Inline 3 Key Metrics Cards */}
            <div className="grid grid-cols-3 gap-3 max-w-xl py-1">
              <div className="bg-slate-950/75 backdrop-blur-md border border-white/25 rounded-xl p-3 flex items-center space-x-3 shadow-xl">
                <div className="p-2 rounded-lg bg-[#002D56] text-emerald-400 flex-shrink-0">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">
                    {isEng ? 'Punctuality 98.4%' : '정시율 98.4%'}
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium">
                    {isEng ? 'On-time Delivery' : '안전 정시 운행'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/75 backdrop-blur-md border border-white/25 rounded-xl p-3 flex items-center space-x-3 shadow-xl">
                <div className="p-2 rounded-lg bg-[#005C2B] text-emerald-200 flex-shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-300">
                    {isEng ? 'CO2 -83%' : '탄소배출 83%↓'}
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium">
                    {isEng ? 'Low Carbon Footprint' : '친환경 저탄소'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/75 backdrop-blur-md border border-white/25 rounded-xl p-3 flex items-center space-x-3 shadow-xl">
                <div className="p-2 rounded-lg bg-[#002D56] text-blue-300 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">
                    {isEng ? '24h GPS Tracking' : '24h 스마트 관제'}
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium">
                    {isEng ? 'Real-time Telemetry' : '실시간 GPS 추적'}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Button 1: [실시간 유휴 화차 LIVE / LIVE VACANT WAGONS & SPECIAL OFFERS] */}
              <button
                onClick={() => setActiveTab('vacant_wagons')}
                className="px-6 py-3.5 bg-[#005C2B]/85 hover:bg-[#005C2B] text-white rounded-xl font-black shadow-2xl transition-all flex items-center space-x-2.5 cursor-pointer transform hover:-translate-y-0.5 backdrop-blur-md"
              >
                <Zap className="w-4 h-4 text-emerald-300 fill-emerald-300" />
                <span className="text-white">
                  {isEng ? 'LIVE VACANT WAGONS & SPECIAL OFFERS' : '실시간 유휴 화차 & 빈칸 특가'}
                </span>
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  HOT
                </span>
              </button>

              {/* Button 2: [운송비 계산 시뮬레이터] */}
              <button
                onClick={() => setActiveTab('calculator')}
                className="px-6 py-3.5 bg-[#0A1329] hover:bg-[#050A17] text-white rounded-xl font-extrabold shadow-xl border border-slate-800 transition-all flex items-center space-x-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Train className="w-4 h-4 text-emerald-400" />
                <span className="text-white">
                  {isEng ? 'Freight Cost Simulator' : '운송비 계산 시뮬레이터'}
                </span>
                <ArrowRight className="w-4 h-4 text-white ml-1" />
              </button>

              {/* Button 3: [빈칸 특가로 신청하기] */}
              <button
                onClick={() => setActiveTab('auction')}
                className="px-6 py-3.5 border border-white/40 bg-black/40 hover:bg-black/60 text-white rounded-xl font-bold backdrop-blur-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span className="text-white">
                  {isEng ? 'Apply for Vacancy Discount' : '빈칸 특가 신청'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Bento Card: Real-time Tracking Search Card */}
          <div className="lg:col-span-5">
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden text-slate-900 text-left">
              {/* Header Dark Navy Bar */}
              <div className="bg-[#0A1329] text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-base font-extrabold flex items-center gap-2 text-white">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">
                    {isEng ? 'Live Cargo Tracking' : '실시간 화물 추적'}
                  </span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {isEng ? 'GPS ACTIVE' : 'GPS 실시간 작동중'}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 bg-slate-50/90">
                <form onSubmit={handleSearchSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isEng ? 'Waybill No. or Container ID' : '운송장 번호 또는 컨테이너 식별 번호'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder={isEng ? 'e.g., KR-2026-8801 or KRLU-2094812' : '예 : KR-2026-8801 또는 KRLU-2094812'}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-[#0A1329] focus:ring-2 focus:ring-[#0A1329]/20 transition-all placeholder:text-slate-400 shadow-xs"
                      />
                      <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0A1329] hover:bg-[#050A17] text-white rounded-xl font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 group"
                  >
                    <span className="text-white">
                      {isEng ? 'Track Delivery Status' : '배송 상태 실시간 조회하기'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                {/* Sample Freight Routes Grid */}
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 mb-2">
                    {isEng ? 'Click sample tracking code:' : '샘플 화물 번호 클릭하여 즉시 조회:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { code: 'KR-2026-8801', route: isEng ? 'Uiwang➔Busan New Port' : '의왕ICD➔부산신항역' },
                      { code: 'KR-2026-9042', route: isEng ? 'Goedong➔Incheon' : '괴동역➔인천역' },
                      { code: 'KR-2026-3312', route: isEng ? 'Donghae➔Susaek' : '동해역➔수색역' },
                      { code: 'KR-2026-1055', route: isEng ? 'Sintanjin➔Gwangyang' : '신탄진역➔광양항역' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleQuickSampleClick(item.code)}
                        className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-[#005C2B] font-mono text-[11px] border border-slate-200 hover:border-emerald-300 transition-all text-left flex items-center space-x-1.5 shadow-2xs cursor-pointer group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform flex-shrink-0" />
                        <span className="font-bold text-slate-900 truncate">{item.code}</span>
                        <span className="text-[10px] text-slate-500 font-sans truncate">({item.route})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Bottom Photo Tag Floating Badge */}
        <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 flex justify-end items-center pt-4 border-t border-white/20 mt-8">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs text-white/90">
            <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {isEng ? '🌿 Eco-Friendly Rail Transport' : '🌿 친환경 철도 수송 포토'}
            </span>
            <span className="text-white/40">|</span>
            <span className="text-[11px] font-medium text-slate-200">
              {isEng ? 'KORAIL Sustainable Infrastructure' : '한국철도공사 친환경 인프라'}
            </span>
          </div>
        </div>

      </section>
    </div>
  );
};


