import React, { useState } from 'react';
import { FREIGHT_TIMETABLE } from '../data/mockData';
import { GnbTab, Language } from '../types';
import { CalendarClock, Train, ShieldCheck, Search, ArrowRight } from 'lucide-react';

interface TimetableSectionProps {
  setActiveTab: (tab: GnbTab) => void;
  lang?: Language;
}

export const TimetableSection: React.FC<TimetableSectionProps> = ({ setActiveTab, lang = 'KO' }) => {
  const isEng = lang === 'ENG';
  const [selectedLine, setSelectedLine] = useState<string>('전체');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const lineLabels: Record<string, { ko: string; en: string }> = {
    '전체': { ko: '전체', en: 'All Lines' },
    '경부선': { ko: '경부선', en: 'Gyeongbu Line' },
    '호남선': { ko: '호남선', en: 'Honam Line' },
    '전라선': { ko: '전라선', en: 'Jeolla Line' },
    '영동선': { ko: '영동선', en: 'Yeongdong Line' },
  };

  const lines = ['전체', '경부선', '호남선', '전라선', '영동선'];

  const filteredSchedules = FREIGHT_TIMETABLE.filter((schedule) => {
    const matchesLine = selectedLine === '전체' || schedule.lineName === selectedLine;
    const matchesQuery =
      schedule.trainNo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      schedule.origin.includes(filterQuery) ||
      schedule.destination.includes(filterQuery);
    return matchesLine && matchesQuery;
  });

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-[#002B66] text-xs font-bold border border-indigo-200 mb-2">
            <CalendarClock className="w-3.5 h-3.5" />
            <span>KORAIL BLOCK TRAIN TIMETABLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEng ? 'National Freight Block Train Timetable' : '전국 정량 화물열차 운행 시간표'}
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-1">
            {isEng
              ? 'Check real-time arrival & departure schedules for express block trains across Gyeongbu, Honam, Jeolla, and Yeongdong lines.'
              : '경부선, 호남선, 전라선, 영동선 고속 직통 블록트레인 및 화물열차의 실시간 출도착 시간표를 조회하세요.'}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Lines selector */}
            <div className="flex flex-wrap gap-2">
              {lines.map((lineKey) => (
                <button
                  key={lineKey}
                  onClick={() => setSelectedLine(lineKey)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    selectedLine === lineKey
                      ? 'bg-[#002B66] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isEng ? lineLabels[lineKey]?.en || lineKey : lineLabels[lineKey]?.ko || lineKey}
                </button>
              ))}
            </div>

            {/* Query Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={isEng ? 'Search train no. or station' : '열차번호 또는 정차역 검색'}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Timetable Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002B66] text-white text-xs font-extrabold uppercase tracking-wider">
                  <th className="p-4">{isEng ? 'Train No' : '열차 번호'}</th>
                  <th className="p-4">{isEng ? 'Line' : '노선'}</th>
                  <th className="p-4">{isEng ? 'Category' : '열차 종별'}</th>
                  <th className="p-4">{isEng ? 'Origin (Departure)' : '출발역 (시각)'}</th>
                  <th className="p-4">{isEng ? 'Destination (Arrival)' : '도착역 (시각)'}</th>
                  <th className="p-4">{isEng ? 'Travel Time' : '소요시간'}</th>
                  <th className="p-4">{isEng ? 'Frequency' : '운행 주기'}</th>
                  <th className="p-4">{isEng ? 'On-time Rate' : '정시율'}</th>
                  <th className="p-4 text-center">{isEng ? 'Book' : '예약'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-semibold text-slate-800">
                {filteredSchedules.map((item) => (
                  <tr key={item.trainNo} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-black text-[#002B66]">
                      {item.trainNo}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                        {isEng ? (lineLabels[item.lineName]?.en || item.lineName) : item.lineName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-extrabold text-[#005C2B] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        {item.trainType}
                      </span>
                    </td>
                    <td className="p-4">
                      <strong className="text-slate-900">{item.origin}</strong>
                      <div className="text-xs text-slate-500 font-mono">{item.depTime}</div>
                    </td>
                    <td className="p-4">
                      <strong className="text-slate-900">{item.destination}</strong>
                      <div className="text-xs text-slate-500 font-mono">{item.arrTime}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-mono">{item.travelTime}</td>
                    <td className="p-4 text-slate-600">{item.frequency}</td>
                    <td className="p-4">
                      <span className="text-emerald-700 font-black">{item.onTimeRate}%</span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setActiveTab('booking')}
                        className="px-3 py-1.5 rounded-lg bg-[#005C2B] hover:bg-emerald-800 text-white font-bold text-xs shadow flex items-center justify-center space-x-1 cursor-pointer mx-auto"
                      >
                        <span>{isEng ? 'Book' : '예약'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
