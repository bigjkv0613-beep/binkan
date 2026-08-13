import React from 'react';
import { Train, ShieldCheck, Phone, Mail, Building2 } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang?: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang = 'KO' }) => {
  const isEng = lang === 'ENG';
  return (
    <footer className="bg-white text-slate-700 border-t border-slate-200 pt-12 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 text-xs">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-[#002D56] flex items-center justify-center font-black">
                <Train className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-sm text-slate-900">
                {isEng ? 'Binkan' : '빈칸'}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {isEng ? 'Integrated Freight Logistics Platform' : '철도물류통합정보시스템 (Binkan Freight Logistics Platform)'}
            </p>
            <p className="text-slate-400">
              {isEng ? '240 Jungang-ro, Dong-gu, Daejeon, Republic of Korea' : '34141 대전광역시 동구 중앙로 240 (정동) 빈칸'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">
              {isEng ? 'Logistics Services' : '물류 서비스 안내'}
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>• {isEng ? 'Real-time Cargo Tracking (GPS/IoT)' : '실시간 화물 위치 관제 (GPS/IoT)'}</li>
              <li>• {isEng ? 'Container/Bulk/Steel Booking' : '컨테이너·벌크·철강 수송 예약'}</li>
              <li>• {isEng ? 'Vacancy Discount Auction' : '여유선로 빈칸 특가로 신청하기'}</li>
              <li>• {isEng ? 'ESG Carbon Reduction Certificates' : 'ESG 탄소절감 산출 및 인증서 발급'}</li>
            </ul>
          </div>

          {/* Logistics Networks */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">
              {isEng ? 'Major Freight Hubs' : '주요 철도 물류 기지'}
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>• {isEng ? 'Uiwang ICD (Obong Station link)' : '의왕 ICD (오봉역 연계)'}</li>
              <li>• {isEng ? 'Busan New Port Yard' : '부산신항역 컨테이너 야드'}</li>
              <li>• {isEng ? 'Yangsan ICD / Gwangyang Port' : '양산 ICD / 광양항역 철도기지'}</li>
              <li>• {isEng ? 'Osong Logistics Hub / Donghae' : '오송 물류중앙기지 / 동해역'}</li>
            </ul>
          </div>

          {/* Call Center */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-1">
              <Phone className="w-4 h-4 text-[#005C2B]" />
              <span>{isEng ? 'Integrated Customer Center' : '화물 통합 고객 센터'}</span>
            </h4>
            <div className="text-xl font-black text-[#002D56] font-mono">1544-7788</div>
            <p className="text-slate-500 text-[11px]">
              {isEng ? 'Hours: Weekdays 08:00 ~ 20:00 (24h Smart Monitoring)' : '운영시간: 평일 08:00 ~ 20:00 (24시간 스마트 관제 상시 가동)'}
            </p>
            <p className="text-slate-500 text-[11px]">
              E-mail: freight@korail.com
            </p>
          </div>

        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 space-y-2 sm:space-y-0">
          <div className="flex flex-wrap items-center space-x-4">
            <span className="text-slate-900 font-bold cursor-pointer hover:underline">
              {isEng ? 'Privacy Policy' : '개인정보처리방침'}
            </span>
            <span>|</span>
            <span className="cursor-pointer hover:underline">
              {isEng ? 'Terms of Carriage' : '화물운송약관'}
            </span>
            <span>|</span>
            <span className="cursor-pointer hover:underline">
              {isEng ? 'User Guide' : '이용안내'}
            </span>
            <span>|</span>
            <span className="cursor-pointer hover:underline">
              {isEng ? 'Copyright Policy' : '저작권보호정책'}
            </span>
          </div>

          <div>
            © 2026 Binkan. All Rights Reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
