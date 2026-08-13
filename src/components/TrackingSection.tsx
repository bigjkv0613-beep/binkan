import React, { useEffect, useState } from 'react';
import { TrackingItem, GnbTab, Language } from '../types';
import { SAMPLE_TRACKING_ITEMS } from '../data/mockData';
import { Search, Train, Thermometer, Droplets, MapPin, ShieldCheck, Download, RefreshCw, CheckCircle2, AlertCircle, Home, Radar, ArrowLeft } from 'lucide-react';

interface TrackingSectionProps {
  initialSearchCode?: string;
  setActiveTab?: (tab: GnbTab) => void;
  lang?: Language;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({
  initialSearchCode = 'KR-2026-8801',
  setActiveTab,
  lang = 'KO',
}) => {
  const isEng = lang === 'ENG';
  const [query, setQuery] = useState(initialSearchCode);
  const [selectedItem, setSelectedItem] = useState<TrackingItem>(
    SAMPLE_TRACKING_ITEMS.find((i) => i.trackingNo.toLowerCase() === initialSearchCode.toLowerCase() || i.containerId.toLowerCase() === initialSearchCode.toLowerCase()) ||
      SAMPLE_TRACKING_ITEMS[0]
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialSearchCode) {
      setQuery(initialSearchCode);
      const found = SAMPLE_TRACKING_ITEMS.find(
        (i) =>
          i.trackingNo.toLowerCase() === initialSearchCode.toLowerCase() ||
          i.containerId.toLowerCase() === initialSearchCode.toLowerCase()
      );
      if (found) {
        setSelectedItem(found);
      }
    }
  }, [initialSearchCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = SAMPLE_TRACKING_ITEMS.find(
      (item) =>
        item.trackingNo.toLowerCase().includes(query.trim().toLowerCase()) ||
        item.containerId.toLowerCase().includes(query.trim().toLowerCase())
    );
    if (found) {
      setSelectedItem(found);
    } else {
      // Create dynamic tracking response for custom queries
      const customItem: TrackingItem = {
        trackingNo: query.toUpperCase().startsWith('KR-') ? query.toUpperCase() : `KR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        containerId: `KORU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`,
        sender: '(주)코레일물류 가상고객사',
        receiver: '부산신항 ICD 제3물류센터',
        cargoType: '컨테이너',
        weightTon: 28.0,
        trainNo: '#3005 (경부선 직통)',
        origin: '의왕 ICD',
        destination: '부산신항역',
        departureTime: '2026-08-12 09:00',
        estimatedArrival: '2026-08-12 15:30',
        currentStation: '대전조차장역 경유 정시 운행 중',
        currentSpeedKm: 88,
        progressPercent: 52,
        latitude: 36.35,
        longitude: 127.38,
        statusText: 'GPS 신호 정상, 정시 운행',
        temperatureC: 19.5,
        humidityPercent: 48,
        co2SavedKg: 380.0,
        timeline: [
          { station: '의왕 ICD', time: '09:00', status: 'completed', description: '화물검수 완료 및 상적' },
          { station: '대전조차장역', time: '11:40', status: 'current', description: '실시간 GPS 수신 정상' },
          { station: '부산신항역', time: '15:30', status: 'upcoming', description: '도착 예정' },
        ],
      };
      setSelectedItem(customItem);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        
        {/* Header & Search */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          {/* Breadcrumb / Back to Home */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
              <button
                type="button"
                onClick={() => setActiveTab?.('home')}
                className="hover:text-[#002D56] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isEng ? 'Home' : '메인 홈'}</span>
              </button>
              <span>/</span>
              <span className="text-[#002D56] font-extrabold">
                {isEng ? 'Real-time Cargo Tracking' : '실시간 화물추적 관제'}
              </span>
            </div>

            {setActiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-[#002D56] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEng ? 'Back to Home' : '메인 홈으로 돌아가기'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#002B66] text-xs font-bold border border-blue-200 mb-2">
                <Radar className="w-3.5 h-3.5 text-blue-600" />
                <span>REAL-TIME FREIGHT TRACKING SYSTEM</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {isEng ? 'Live Freight Tracking & Control Service' : '실시간 화물추적 관제 서비스'}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                {isEng
                  ? 'Track live GPS location, train speed, temperature, and humidity sensors by Waybill No. or Container ID.'
                  : '운송장 번호 또는 컨테이너 번호로 화물의 현재 GPS 위치, 주행 속도, 온·습도를 실시간 확인하세요.'}
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start md:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isEng ? 'Refresh GPS Signal' : '실시간 GPS 새로고침'}</span>
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isEng ? 'Enter Waybill No. or Container ID (e.g. KR-2026-8801)' : '운송장 번호 또는 컨테이너 번호 입력 (예: KR-2026-8801)'}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm font-semibold text-slate-900 bg-slate-50"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#002B66] hover:bg-[#003B85] text-white font-bold text-sm shadow-md transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{isEng ? 'Track Status' : '배송 상태 실시간 조회하기'}</span>
            </button>
          </form>

          {/* Quick Preset Selector */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">{isEng ? 'Sample Cargo Items:' : '등록된 테스트 화물:'}</span>
            {SAMPLE_TRACKING_ITEMS.map((item) => (
              <button
                key={item.trackingNo}
                onClick={() => {
                  setQuery(item.trackingNo);
                  setSelectedItem(item);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  selectedItem.trackingNo === item.trackingNo
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {item.trackingNo} ({item.origin} ➔ {item.destination})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Freight Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-[#002B66] via-[#003B85] to-[#005C2B] p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded">
                  {selectedItem.cargoType}
                </span>
                <span className="text-xs text-blue-200 font-mono">
                  {isEng ? 'Container ID:' : '컨테이너 ID:'} {selectedItem.containerId}
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                {isEng ? 'Waybill No:' : '운송장 번호:'} {selectedItem.trackingNo}
              </h3>
              <p className="text-xs text-blue-100 font-medium mt-1">
                {isEng ? 'Train No:' : '열차편명:'} <span className="font-bold text-emerald-300">{selectedItem.trainNo}</span> | {isEng ? 'Weight:' : '중량:'} {selectedItem.weightTon} Ton
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <div className="text-[11px] text-emerald-200 font-semibold">{isEng ? 'Current Status' : '현재 운행 상태'}</div>
                <div className="text-sm font-extrabold text-white">{selectedItem.statusText}</div>
              </div>
            </div>
          </div>

          {/* Body Content Grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Timeline Progress (2 Cols width) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Route Progress Bar */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{isEng ? 'Origin:' : '출발:'} <strong className="text-blue-900">{selectedItem.origin}</strong></span>
                  </div>
                  <div className="text-xs text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-extrabold border border-emerald-300">
                    {isEng ? 'Progress' : '진행률'} {selectedItem.progressPercent}%
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{isEng ? 'Destination:' : '도착:'} <strong className="text-emerald-900">{selectedItem.destination}</strong></span>
                  </div>
                </div>

                {/* Animated Train Progress Line */}
                <div className="relative w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-600 h-full transition-all duration-700 rounded-full"
                    style={{ width: `${selectedItem.progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>{isEng ? 'Departure:' : '출발시각:'} {selectedItem.departureTime}</span>
                  <span>{isEng ? 'Est. Arrival:' : '도착예정:'} {selectedItem.estimatedArrival}</span>
                </div>
              </div>

              {/* Station Timeline List */}
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                  <Train className="w-5 h-5 text-blue-700" />
                  <span>{isEng ? 'Station Timeline & Waypoints' : '실시간 경유역 및 운행 이력'}</span>
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {selectedItem.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start space-x-4">
                      {/* Step Dot */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          step.status === 'completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : step.status === 'current'
                            ? 'bg-blue-600 border-blue-600 text-white animate-bounce'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {step.status === 'current' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>

                      <div className="flex-grow bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {step.station}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Live Sensor & Telemetry Data */}
            <div className="space-y-4">
              
              <div className="bg-white text-slate-900 rounded-2xl p-5 space-y-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-sm font-extrabold text-[#005C2B] flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isEng ? 'IoT Sensor Telemetry' : 'IoT 센서 텔레메트리 관제'}</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-[#005C2B] px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
                      <Train className="w-3.5 h-3.5 text-[#002D56]" />
                      <span>{isEng ? 'Current Speed' : '현재 운행 속도'}</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      {selectedItem.currentSpeedKm} <span className="text-xs text-slate-500 font-normal">km/h</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-orange-600" />
                      <span>{isEng ? 'Temperature' : '컨테이너 온도'}</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      {selectedItem.temperatureC} <span className="text-xs text-slate-500 font-normal">°C</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isEng ? 'Humidity' : '내부 습도'}</span>
                    </div>
                    <div className="text-xl font-black text-white">
                      {selectedItem.humidityPercent} <span className="text-xs text-slate-400 font-normal">%</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isEng ? 'ESG Carbon Saved' : 'ESG 탄소절감'}</span>
                    </div>
                    <div className="text-xl font-black text-emerald-400">
                      {selectedItem.co2SavedKg} <span className="text-xs text-slate-400 font-normal">kg CO₂</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl text-xs text-slate-300 space-y-1 border border-slate-700">
                  <div className="flex justify-between">
                    <span>{isEng ? 'Shipper:' : '송하인:'}</span>
                    <strong className="text-white">{selectedItem.sender}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{isEng ? 'Consignee:' : '수하인:'}</span>
                    <strong className="text-white">{selectedItem.receiver}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{isEng ? 'GPS Coords:' : 'GPS 좌표:'}</span>
                    <strong className="text-emerald-400 font-mono">
                      {selectedItem.latitude.toFixed(4)}, {selectedItem.longitude.toFixed(4)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Downloads */}
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-emerald-950 space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-emerald-700" />
                  <h5 className="font-extrabold text-sm text-emerald-900">{isEng ? 'Official e-Waybill Issuance' : '공식 철도화물 적하목록 발행'}</h5>
                </div>
                <p className="text-xs text-emerald-800 font-medium">
                  {isEng
                    ? 'Download official KORAIL electronic waybill and customs certificate in real time.'
                    : '한국철도공사가 공인하는 전자화물운송장(e-Waybill) 및 세관 제출용 증명서를 실시간 발급합니다.'}
                </p>
                <button
                  onClick={() => {
                    const msg = isEng
                      ? `[Download Complete] e-Waybill (${selectedItem.trackingNo}) PDF generated.`
                      : `[발급 완료] 운송장 ${selectedItem.trackingNo} 번호의 공식 전자화물운송장이 PDF로 출력되었습니다.`;
                    setDownloadToast(msg);
                    setTimeout(() => setDownloadToast(null), 4000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isEng ? 'Download e-Waybill PDF' : '전자화물운송장 PDF 다운로드'}</span>
                </button>
                {downloadToast && (
                  <div className="p-3 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg border border-emerald-600 animate-fade-in flex items-center justify-between">
                    <span>{downloadToast}</span>
                    <button onClick={() => setDownloadToast(null)} className="text-emerald-200 hover:text-white ml-2">✕</button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

function RadarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
      <path d="M4.93 19.07a10 10 0 0 0 14.14 0" />
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M12 12l4-4" />
    </svg>
  );
}
