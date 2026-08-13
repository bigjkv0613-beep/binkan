import React from 'react';
import { GnbTab, Language } from '../types';
import { Radar, Calculator, MapPin, CalendarClock, ArrowUpRight, CheckCircle2, Zap } from 'lucide-react';

interface MainServicesCardsProps {
  setActiveTab: (tab: GnbTab) => void;
  lang?: Language;
}

export const MainServicesCards: React.FC<MainServicesCardsProps> = ({ setActiveTab, lang = 'KO' }) => {
  const isEng = lang === 'ENG';

  const cards = [
    {
      id: 'tracking' as GnbTab,
      num: '01',
      title: isEng ? 'Real-time Cargo Tracking' : '실시간 화물 관제',
      badge: isEng ? 'GPS & Telemetry' : 'GPS 상태 제공',
      description: isEng
        ? '24/7 precision telemetry tracking for train position, speed, IoT temperature & humidity sensors, and station checkpoints.'
        : '열차 실시간 위치, 주행 속도, IoT 온·습도 센서 및 구간별 통과 시간을 24시간 정밀 모니터링합니다.',
      tags: isEng
        ? ['GPS Tracking', 'IoT Sensors', '98.4% On-time', 'Live Alerts']
        : ['GPS 위치 관제', '온·습도 센서', '정시율 98.4%', '실시간 알림'],
      icon: Radar,
      color: 'from-blue-600 to-indigo-700',
      accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'calculator' as GnbTab,
      num: '02',
      title: isEng ? 'Freight Cost Simulator' : '운송비 계산(시뮬레이터)',
      badge: isEng ? 'Tariff & Savings Calc' : '노선별 절감 운임 산출',
      description: isEng
        ? 'Calculate freight train tariffs and compare cost savings against road truck transport in real time.'
        : '출발/도착역, 화물 종류·무게 기반으로 KORAIL 철도 수송 운임 및 도로 트럭 대비 절감 비용을 산출합니다.',
      tags: isEng
        ? ['Rail Tariff', 'Cost Savings', 'Truck Drayage', 'Quote Print']
        : ['철도 운임 산출', '물류비 절감비교', '연계 트럭 포함', '견적서 출력'],
      icon: Calculator,
      color: 'from-emerald-700 to-[#005C2B]',
      accentBg: 'bg-emerald-50 text-[#005C2B] border-emerald-200',
    },
    {
      id: 'hubs' as GnbTab,
      num: '03',
      title: isEng ? 'Logistics Hubs & ICD' : '물류 거점 & ICD',
      badge: isEng ? 'Uiwang, Busan, Gwangyang' : '의왕, 부산신항, 양산, 광양',
      description: isEng
        ? 'Check yard status and operational details across major national rail terminals like Uiwang ICD and Busan New Port.'
        : '수도권 의왕 ICD부터 부산신항, 양산, 광양항 등 전국 주요 철도물류 거점 및 야드 현황을 확인하세요.',
      tags: isEng
        ? ['Uiwang ICD', 'Busan New Port', 'Yangsan ICD', 'Gwangyang Port']
        : ['의왕 ICD', '부산신항역', '양산 ICD', '광양항역'],
      icon: MapPin,
      color: 'from-sky-600 to-blue-800',
      accentBg: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'timetable' as GnbTab,
      num: '04',
      title: isEng ? 'Freight Timetable' : '화물열차 시간표',
      badge: isEng ? 'Direct Block Trains' : '노선별 블록트레인 시간표',
      description: isEng
        ? 'View direct block train schedules along Gyeongbu, Honam, Jeolla, and Yeongdong express freight lines.'
        : '경부선, 호남선, 전라선, 영동선 고속 직통 블록트레인 및 전용 화물열차의 실시간 운행 노선 시간표를 조회합니다.',
      tags: isEng
        ? ['Express Direct', 'Gyeongbu / Honam', 'Scheduled Run', 'Night Express']
        : ['블록트레인 직통', '경부선/호남선', '정량 운행', '야간 특송'],
      icon: CalendarClock,
      color: 'from-[#002B66] to-[#001D47]',
      accentBg: 'bg-indigo-50 text-[#002B66] border-indigo-200',
    },
  ];

  return (
    <section className="py-16 bg-slate-100/80 border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#005C2B] text-xs font-bold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>KORAIL SMART LOGISTICS SERVICES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEng ? "BinKan's Key Services" : '빈칸의 핵심 주요 서비스'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            {isEng
              ? 'Smart solutions from advanced IoT tracking to carbon-neutral ESG rail freight'
              : '첨단 IoT 관제부터 탄소중립 ESG 운송까지, 철도물류통합정보시스템이 제공하는 스마트 솔루션'}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border border-slate-200/90 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                {/* Top Number & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-600 transition-colors">
                      {card.num}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.accentBg}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {card.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-medium">
                    {card.description}
                  </p>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {card.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Line */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-800 group-hover:text-emerald-700">
                  <span>{isEng ? 'Go to Service' : '서비스 바로가기'}</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Idle Wagon LIVE Promotional Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#0A1329] via-[#002D56] to-[#005C2B] text-white rounded-3xl p-6 shadow-xl border border-emerald-400/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-emerald-500 text-slate-950 rounded-2xl font-black shadow-lg flex-shrink-0">
              <Zap className="w-7 h-7 fill-slate-950" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black border border-emerald-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isEng ? 'Same-day Live Available' : '당일 즉시 배치 LIVE'}</span>
              </div>
              <h3 className="text-xl font-black text-white">
                {isEng
                  ? 'Same-day Available Idle Wagon Slots (Uiwang ICD / Busan Port / Obong, etc.)'
                  : '당일 이용 가능한 유휴 화차 슬롯 (의왕 ICD / 부산신항역 / 오봉역 등)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {isEng
                  ? 'Up to 30% discount on same-day vacant slots for shippers! Wagon selection auto-fills the booking form.'
                  : '화주를 위한 당일 빈칸 특가 최대 30% 할인! 화차 선택 시 예약 폼으로 자동 채움이 지원됩니다.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('vacant_wagons')}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer transform hover:scale-105"
          >
            <span>{isEng ? 'View All Idle Wagon Slots' : '유휴 화차 슬롯 전체 보기'}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
