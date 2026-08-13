import React from 'react';
import { GnbTab, Language } from '../types';
import { SAMPLE_TRACKING_ITEMS } from '../data/mockData';
import { LayoutDashboard, Train, PackageCheck, ShieldCheck, ArrowUpRight, Clock, MapPin } from 'lucide-react';

interface MyDashboardProps {
  setActiveTab: (tab: GnbTab) => void;
  onSearchTracking: (code: string) => void;
  lang?: Language;
}

export const MyDashboard: React.FC<MyDashboardProps> = ({ setActiveTab, onSearchTracking, lang = 'KO' }) => {
  const isEng = lang === 'ENG';
  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#002B66] text-xs font-bold border border-blue-200 mb-2">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>MY LOGISTICS CONTROL CENTER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isEng ? 'My Logistics' : '내물류'}
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1">
              (주)한국글로벌물류 님, 진행 중인 화물 수송 상태 및 역경매 입찰 현황을 한눈에 확인하세요.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-4 py-2.5 rounded-xl bg-[#002B66] hover:bg-[#003B85] text-white font-bold text-xs shadow flex items-center space-x-1 cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              <span>운송비 계산기</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 mb-1">현재 운행 중인 화물</div>
            <div className="text-2xl font-black text-[#002B66]">3 건</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">전건 정시 운행 중</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 mb-1">대기 중인 예약 신청</div>
            <div className="text-2xl font-black text-slate-800">1 건</div>
            <div className="text-[11px] text-blue-700 font-bold mt-1">승인 심사 진행 중</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 mb-1">참여 중인 역경매</div>
            <div className="text-2xl font-black text-[#005C2B]">2 건</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">최저가 유지 중</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-500 mb-1">이번 달 누적 CO₂ 감축</div>
            <div className="text-2xl font-black text-[#005C2B]">1,880 kg</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">ESG 뱃지 획득</div>
          </div>
        </div>

        {/* Active Shipments List */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Train className="w-5 h-5 text-blue-700" />
              <span>실시간 수송 진행 화물 목록</span>
            </h3>
            <button
              onClick={() => setActiveTab('tracking')}
              className="text-xs font-extrabold text-[#002B66] hover:underline flex items-center"
            >
              <span>화물관제 전체보기</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {SAMPLE_TRACKING_ITEMS.map((item) => (
              <div
                key={item.trackingNo}
                onClick={() => {
                  onSearchTracking(item.trackingNo);
                  setActiveTab('tracking');
                }}
                className="bg-slate-50 hover:bg-emerald-50/60 p-4 rounded-xl border border-slate-200 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {item.trackingNo}
                    </span>
                    <span className="bg-blue-100 text-[#002B66] text-[11px] font-bold px-2 py-0.5 rounded">
                      {item.trainNo}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-1 flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.origin} ➔ {item.destination}</span>
                    <span>|</span>
                    <span>{item.currentStation}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-800">{item.statusText}</div>
                    <div className="text-[11px] text-slate-500 font-mono">도착예정: {item.estimatedArrival}</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold">
                    GPS 위치 확인 ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
