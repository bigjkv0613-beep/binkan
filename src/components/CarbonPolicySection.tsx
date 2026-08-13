import React from 'react';
import { Language } from '../types';
import {
  ShieldCheck,
  Zap,
  Award,
  Train,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Leaf
} from 'lucide-react';

interface CarbonPolicySectionProps {
  lang?: Language;
}

export const CarbonPolicySection: React.FC<CarbonPolicySectionProps> = ({ lang = 'KO' }) => {
  const isEng = lang === 'ENG';
  return (
    <div className="pb-12 bg-[#F1F6F7] min-h-screen text-slate-900">
      
      {/* Header Banner - Deep Green (Full Width Top Banner) */}
      <div className="w-full bg-[#00381A] text-white py-10 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8 shadow-xl relative overflow-hidden border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 text-white border border-white/30 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>정부 친환경 탄소중립 지원 가이드</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              정부 탄소 감축 지원 및 기업 인센티브 정책
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-white/95 font-medium leading-relaxed break-words">
              철도물류 전환 및 친환경 경영을 실천하는 기업에 제공되는 정부의 주요 지원 제도와 혜택을 안내합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12 space-y-12">

        {/* 4 Main Policy Cards - 3D White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Policy Card 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/80 flex flex-col justify-between hover:shadow-2xl hover:border-emerald-500/30 transition-all space-y-6 text-slate-900">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-emerald-50 text-[#005C2B] border border-emerald-200/80">
                  <TrendingUp className="w-6 h-6 text-[#005C2B]" />
                </div>
                <span className="bg-emerald-50 text-[#005C2B] text-xs font-black px-3 py-1 rounded-full border border-emerald-200/80">
                  배출권 및 인센티브
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 leading-snug">
                배출권거래제 유상할당 혜택 및 감축실적 인센티브
              </h3>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                철도물류 전환 및 에너지 절감을 통해 이산화탄소 배출량을 감축한 기업은 감축실적(KOC)을 인정받아 배출권을 추가 확보하거나 시장 판매로 추가 수익을 창출할 수 있으며, 유상할당 비율 감면 혜택을 적용받습니다.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#005C2B] flex-shrink-0" />
                  <span>배출권 추가 확보 및 시장 매각 수익 창출</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#005C2B] flex-shrink-0" />
                  <span>온실가스 유상할당 대상 지정 시 할당 비율 감면</span>
                </div>
              </div>
            </div>

            <a
              href="https://www.keco.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-[#002B66] text-white font-black text-xs transition-all cursor-pointer group shadow-md"
            >
              <span>한국환경공단 배출권거래제 정보포털 바로가기</span>
              <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Policy Card 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/80 flex flex-col justify-between hover:shadow-2xl hover:border-emerald-500/30 transition-all space-y-6 text-slate-900">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200/80">
                  <Zap className="w-6 h-6 text-sky-700" />
                </div>
                <span className="bg-sky-50 text-sky-700 text-xs font-black px-3 py-1 rounded-full border border-sky-200/80">
                  정책자금 융자
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 leading-snug">
                탄소중립 전환 선도설비 융자 지원
              </h3>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                친환경 물류 장비 도입, 전기·수소 화물 수송 장비 및 고효율 온실가스 감축 설비 교체 시 정부 정책 자금을 장기 저리로 융자 지원하여 기업의 친환경 설비 투자 부담을 획기적으로 낮춰드립니다.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span>장기 저리(1~2%대) 정책자금 융자 및 거치기간 제공</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span>스마트 물류 센터 및 친환경 화물 이송 장비 구축 지원</span>
                </div>
              </div>
            </div>

            <a
              href="https://www.bizinfo.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-[#002B66] text-white font-black text-xs transition-all cursor-pointer group shadow-md"
            >
              <span>중소벤처기업부 기업마당 정책자금 신청</span>
              <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Policy Card 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/80 flex flex-col justify-between hover:shadow-2xl hover:border-emerald-500/30 transition-all space-y-6 text-slate-900">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80">
                  <Award className="w-6 h-6 text-amber-700" />
                </div>
                <span className="bg-amber-50 text-amber-700 text-xs font-black px-3 py-1 rounded-full border border-amber-200/80">
                  세제 및 금융 우대
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 leading-snug">
                녹색인증(녹색기술·녹색기업) 세제 및 금융 우대
              </h3>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                정부 녹색인증을 획득한 친환경 기술 및 물류 기업을 대상으로 환경 보전 시설 투자 세액 공제 혜택과 시중 주요 금융기관의 녹색금융 우대금리 금리 감면 보증 지원을 부여합니다.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>친환경 물류 시설 및 기술 투자 세액 공제</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>시중은행 대출 우대 금리 및 신용보증기금 보증 우대</span>
                </div>
              </div>
            </div>

            <a
              href="https://www.greencert.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-[#002B66] text-white font-black text-xs transition-all cursor-pointer group shadow-md"
            >
              <span>녹색인증 공식 홈페이지 바로가기</span>
              <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Policy Card 4 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/80 flex flex-col justify-between hover:shadow-2xl hover:border-emerald-500/30 transition-all space-y-6 text-slate-900">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-emerald-50 text-[#005C2B] border border-emerald-200/80">
                  <Train className="w-6 h-6 text-[#005C2B]" />
                </div>
                <span className="bg-emerald-50 text-[#005C2B] text-xs font-black px-3 py-1 rounded-full border border-emerald-200/80">
                  철도물류 연계 특화
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 leading-snug">
                물류·운송 분야 특화 지원 (철도물류 연계 혜택)
              </h3>

              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                기존 도로 화물 운송을 친환경 KORAIL 철도물류 수송으로 전환하는 기업에게 전환교통 보조금을 가산 지원하며, 주요 공공기관 및 대기업 ESG 평가 시 높은 가점을 부여합니다.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#005C2B] flex-shrink-0" />
                  <span>도로➔철도 수송 전환에 따른 전환교통 보조금 가산</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#005C2B] flex-shrink-0" />
                  <span>KORAIL 친환경 화물 수송 검증서 발급 및 ESG 가점 인정</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 text-slate-900 font-bold text-xs flex items-center justify-between border border-emerald-200/80">
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-[#005C2B]" />
                <span>KORAIL 철도물류 전환 지원센터 문의</span>
              </div>
              <span className="text-[#005C2B] font-mono font-black">1544-7788</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

