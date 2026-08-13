import React, { useState } from 'react';
import { GnbTab, Language } from '../types';
import { BinkanLogo } from './BinkanLogo';
import {
  Train,
  Globe,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Flame,
  MapPin,
  Clock,
  Leaf,
  User,
  Calculator,
  Search,
  Radar,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  activeTab: GnbTab;
  setActiveTab: (tab: GnbTab) => void;
  lang: Language;
  setLang: React.Dispatch<React.SetStateAction<Language>>;
}

interface NavSubItem {
  id: GnbTab;
  label: string;
  labelEng: string;
  isHot?: boolean;
  badgeText?: string;
  description: string;
  icon: React.ReactNode;
}

interface NavCategory {
  id: string;
  title: string;
  titleEng: string;
  items: NavSubItem[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHoveredGnb, setIsHoveredGnb] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState<string | null>(null);
  
  // Mobile accordion state (category id -> open boolean)
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<Record<string, boolean>>({
    services: true,
    network: false,
    about: false,
    mypage: false,
  });

  const toggleMobileCategory = (catId: string) => {
    setExpandedMobileCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const navCategories: NavCategory[] = [
    {
      id: 'services',
      title: '서비스',
      titleEng: 'Services',
      items: [
        {
          id: 'auction',
          label: '빈칸 특가로 신청하기',
          labelEng: 'Real-time Vacancy Auction',
          isHot: true,
          badgeText: 'HOT',
          description: '여유 선로 빈칸 특가 최대 40% 할인 입찰',
          icon: <Flame className="w-4 h-4 text-orange-500" />,
        },
        {
          id: 'vacant_wagons',
          label: '실시간 유휴 화차 LIVE',
          labelEng: 'Same-day Idle Wagons',
          isHot: true,
          badgeText: 'LIVE',
          description: '당일 이용 가능한 유휴 화차 정보 및 즉시 예약',
          icon: <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />,
        },
        {
          id: 'tracking',
          label: '실시간 화물추적',
          labelEng: 'Live Freight Tracking',
          description: 'GPS & IoT 기반 화물 위치 및 텔레메트리 관제',
          icon: <Radar className="w-4 h-4 text-blue-600" />,
        },
        {
          id: 'calculator',
          label: '운송비 계산(시뮬레이터)',
          labelEng: 'Freight Cost Simulator',
          description: '출발/도착역, 화물 종류·무게 기반 절감 운임 산출',
          icon: <Calculator className="w-4 h-4 text-[#002D56]" />,
        },
      ],
    },
    {
      id: 'network',
      title: '인프라 & 운행',
      titleEng: 'Network',
      items: [
        {
          id: 'hubs',
          label: '전국 물류거점',
          labelEng: 'Logistics Hubs',
          description: '전국 주요 ICD 및 철도물류기지 위치 검색',
          icon: <MapPin className="w-4 h-4 text-[#002D56]" />,
        },
        {
          id: 'timetable',
          label: '화물열차 운행시간표',
          labelEng: 'Train Timetable',
          description: '경부선·호남선 등 노선별 화물열차 정시 스케줄',
          icon: <Clock className="w-4 h-4 text-[#002D56]" />,
        },
      ],
    },
    {
      id: 'about',
      title: 'ESG & 정보',
      titleEng: 'About ESG',
      items: [
        {
          id: 'esg',
          label: '친환경 ESG 탄소절감',
          labelEng: 'Eco ESG Portal',
          description: '철도 수송 전환에 따른 CO2 절감 효과 증명',
          icon: <Leaf className="w-4 h-4 text-[#005C2B]" />,
        },
        {
          id: 'carbon_policy',
          label: '탄소 관련 정책',
          labelEng: 'Carbon Policy',
          description: '정부 탄소 감축 지원 및 기업 인센티브 정책 가이드',
          icon: <ShieldCheck className="w-4 h-4 text-[#005C2B]" />,
        },
      ],
    },
    {
      id: 'mypage',
      title: '마이페이지',
      titleEng: 'My Page',
      items: [
        {
          id: 'dashboard',
          label: '내물류 대시보드',
          labelEng: 'My Dashboard',
          description: '나의 화물 운송 예약, 역경매 입찰 내역 통합 관리',
          icon: <User className="w-4 h-4 text-[#002D56]" />,
        },
      ],
    },
  ];

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'KO' ? 'ENG' : 'KO'));
  };

  const handleSubItemClick = (tabId: GnbTab) => {
    setActiveTab(tabId);
    setIsHoveredGnb(false);
    setActiveHoverCategory(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-[#002D56] shadow-sm border-b border-slate-200">
      {/* Top Utility Ticker Bar - Deep Dark Navy Background & White Text */}
      <div className="bg-[#0A1329] text-xs text-white py-1.5 px-4 sm:px-6 lg:px-10 border-b border-slate-800 hidden md:block">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 text-white font-medium">
            <span className="font-extrabold tracking-wider text-white">Binkan LOGISTICS</span>
            <span className="text-white/40">|</span>
            <span className="text-white">
              {lang === 'ENG'
                ? 'Binkan Integrated Rail Freight System (Smart Platform)'
                : 'Binkan 철도물류통합정보시스템 (Smart Freight Logistics Platform)'}
            </span>
          </div>
          <div className="flex items-center space-x-5 text-white font-bold text-xs">
            <span className="flex items-center gap-1 text-white">
              <span>📞</span> {lang === 'ENG' ? 'Inquiry 1544-7788' : '화물상담 1544-7788'}
            </span>
            <span className="text-white/40">|</span>
            <button
              onClick={toggleLanguage}
              className="text-white hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-white" />
              <span className="text-white">{lang === 'KO' ? '한국어 / ENG' : 'ENG / 한국어'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div
            onClick={() => handleSubItemClick('home')}
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0 py-2"
          >
            {/* Binkan Custom Brand Logo */}
            <BinkanLogo height={44} color="#0B1E36" />

            <div className="hidden sm:flex flex-col justify-center border-l border-slate-200 pl-3 ml-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-extrabold tracking-widest text-[#005C2B] uppercase">
                  SMART LOGISTICS
                </span>
                <span className="bg-emerald-50 text-[#005C2B] text-[9px] px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                  {lang === 'ENG' ? 'ECO' : '친환경'}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-[#0B1E36] transition-colors leading-snug">
                {lang === 'ENG' ? 'Integrated Freight System' : '철도물류통합정보시스템'}
              </span>
            </div>
          </div>

          {/* Desktop GNB Navigation Menu (Middle Positioned with Specific Floating Dropdowns) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 px-2">
            {navCategories.map((cat) => {
              const isCatActive = cat.items.some((item) => item.id === activeTab);
              const isHovered = activeHoverCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative py-6 group cursor-pointer"
                  onMouseEnter={() => setActiveHoverCategory(cat.id)}
                  onMouseLeave={() => setActiveHoverCategory(null)}
                >
                  <button
                    onClick={() => handleSubItemClick(cat.items[0].id)}
                    className={`inline-flex items-center space-x-1.5 font-extrabold text-sm transition-colors cursor-pointer ${
                      isCatActive
                        ? 'text-[#005C2B]'
                        : isHovered
                        ? 'text-[#002D56]'
                        : 'text-[#002D56] hover:text-[#005C2B]'
                    }`}
                  >
                    <span>{lang === 'KO' ? cat.title : cat.titleEng}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isHovered ? 'rotate-180 text-[#005C2B]' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {/* Active Indicator Bar */}
                  {isCatActive && (
                    <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-[#005C2B] rounded-full" />
                  )}

                  {/* Specific Floating Dropdown for THIS category ONLY, aligned directly underneath */}
                  {isHovered && (
                    <div className="absolute top-[calc(100%-8px)] left-0 z-50 w-72 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 border-t-2 border-t-[#005C2B] p-2.5 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-1">
                        {cat.items.map((item) => {
                          const isSubActive = activeTab === item.id;

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSubItemClick(item.id)}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start space-x-2.5 group cursor-pointer ${
                                item.isHot
                                  ? 'bg-orange-50 hover:bg-orange-100/90 border border-orange-200/80'
                                  : isSubActive
                                  ? 'bg-[#002D56] text-white shadow-xs'
                                  : 'hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                              <div className="flex-grow min-w-0">
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-xs font-bold leading-tight truncate ${
                                      item.isHot
                                        ? 'font-black text-slate-900 group-hover:text-orange-700'
                                        : isSubActive
                                        ? 'text-white'
                                        : 'text-slate-900 group-hover:text-[#002D56]'
                                    }`}
                                  >
                                    {lang === 'KO' ? item.label : item.labelEng}
                                  </span>

                                  {item.isHot && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-orange-500 text-white font-black text-[10px] shadow-xs flex-shrink-0 animate-pulse">
                                      {item.badgeText || 'HOT'}
                                    </span>
                                  )}
                                </div>

                                <p
                                  className={`text-[11px] leading-snug mt-0.5 line-clamp-1 ${
                                    isSubActive
                                      ? 'text-slate-200'
                                      : 'text-slate-500 group-hover:text-slate-700'
                                  }`}
                                >
                                  {item.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center space-x-2.5 flex-shrink-0">
            {/* CTA Button 1: [빈칸 특가로 신청하기 HOT] */}
            <button
              onClick={() => handleSubItemClick('auction')}
              className="relative inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black bg-[#005C2B]/85 hover:bg-[#005C2B] text-white shadow-xs transition-all cursor-pointer group"
            >
              <span className="text-emerald-300">🍃</span>
              <span className="text-white">{lang === 'ENG' ? 'Vacancy Special Deals' : '빈칸 특가로 신청하기'}</span>
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                HOT
              </span>
            </button>

            {/* CTA Button 2: [실시간 유휴 화차 ● LIVE] */}
            <button
              onClick={() => handleSubItemClick('vacant_wagons')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-[#0A1329] hover:bg-[#050A17] text-white border border-slate-800 shadow-xs transition-all cursor-pointer hover:border-emerald-500/50"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span className="text-white">{lang === 'ENG' ? 'Live Idle Wagons' : '실시간 유휴 화차'}</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full border border-emerald-400/40 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => handleSubItemClick('auction')}
              className="px-2.5 py-1.5 rounded-lg bg-[#005C2B] text-white text-xs font-bold flex items-center space-x-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
              </span>
              <span>{lang === 'ENG' ? 'Auction' : '역경매'}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded bg-slate-100 text-xs font-bold text-[#002D56] border border-slate-300"
            >
              {lang === 'KO' ? 'KOR' : 'ENG'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#002D56] text-white hover:bg-[#001D47]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Accordion Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
          {navCategories.map((cat) => {
            const isExpanded = expandedMobileCategories[cat.id];

            return (
              <div
                key={cat.id}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
              >
                {/* Accordion Category Header */}
                <button
                  onClick={() => toggleMobileCategory(cat.id)}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200/80 flex items-center justify-between font-bold text-sm text-[#002D56] transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#005C2B]" />
                    <span>{lang === 'KO' ? cat.title : cat.titleEng}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isExpanded ? 'rotate-180 text-[#005C2B]' : ''
                    }`}
                  />
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-2 space-y-1 bg-white border-t border-slate-200">
                    {cat.items.map((item) => {
                      const isSubActive = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSubItemClick(item.id)}
                          className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                            item.isHot
                              ? 'bg-orange-50 text-slate-900 border border-orange-200'
                              : isSubActive
                              ? 'bg-[#002D56] text-white'
                              : 'text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            {item.icon}
                            <span
                              className={`text-xs font-bold ${
                                item.isHot ? 'font-black text-slate-900' : ''
                              }`}
                            >
                              {lang === 'KO' ? item.label : item.labelEng}
                            </span>
                          </div>

                          {item.isHot && (
                            <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                              HOT
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
};

