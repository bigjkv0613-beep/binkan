import React, { useState, useEffect, useRef } from 'react';
import { GnbTab, TrackingItem } from '../types';
import { SAMPLE_TRACKING_ITEMS } from '../data/mockData';
import { calculateParcelFreight, ParcelCargoResult } from '../utils/korailFreight';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Search,
  Calculator,
  ShieldCheck,
  Package,
  Train,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Info,
  MapPin,
  Clock,
  Scale
} from 'lucide-react';

interface AiChatAssistantProps {
  setActiveTab: (tab: GnbTab) => void;
  onSearchTracking?: (code: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  trackingData?: TrackingItem;
  parcelData?: {
    weightKg: number;
    sizeSumCm: number;
    quantity: number;
    regionZone: 'same_region' | 'other_region' | 'island';
    result: ParcelCargoResult;
  };
  policyLinks?: { name: string; url: string; org: string }[];
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  setActiveTab,
  onSearchTracking,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: '안녕하세요! 한국철도공사 KORAIL 실시간 AI 물류 상담 도우미입니다. ✨\n화물 추적, 소량 화물/택배 운임 견적, 대량 철도 수송 및 정부 탄소 감축 정책에 대해 무엇이든 물어보세요!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Dynamic state for in-chat interactive parcel calculator
  const [chatParcelWeight, setChatParcelWeight] = useState(5);
  const [chatParcelQty, setChatParcelQty] = useState(10);
  const [chatParcelZone, setChatParcelZone] = useState<'same_region' | 'other_region' | 'island'>('same_region');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Helper function to simulate streaming answer text
  const addStreamingResponse = async (fullText: string, extraData?: Partial<ChatMessage>) => {
    if (!isMountedRef.current) return;
    setIsTyping(true);

    // Initial message holder
    const newMessageId = `ai-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Wait short delay for "AI 답변 작성 중..." effect
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!isMountedRef.current) return;

    setMessages((prev) => [
      ...prev,
      {
        id: newMessageId,
        sender: 'ai',
        text: '',
        timestamp,
        ...extraData,
      },
    ]);

    setIsTyping(false);

    // Stream characters
    const chunkSize = 4;
    for (let i = 0; i <= fullText.length; i += chunkSize) {
      if (!isMountedRef.current) return;
      const currentChunk = fullText.slice(0, i);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessageId ? { ...msg, text: currentChunk } : msg))
      );
      await new Promise((resolve) => setTimeout(resolve, 15));
    }

    if (isMountedRef.current) {
      // Ensure complete text
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessageId ? { ...msg, text: fullText } : msg))
      );
    }
  };

  const processUserQuery = async (queryText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    const lower = queryText.toLowerCase().trim();

    // 1. CARGO TRACKING QUERY
    if (
      lower.includes('추적') ||
      lower.includes('위치') ||
      lower.includes('8801') ||
      lower.includes('8802') ||
      lower.includes('배송') ||
      lower.includes('컨테이너') ||
      lower.startsWith('kr-')
    ) {
      // Find matching item or default to KR-2026-8801
      let matched = SAMPLE_TRACKING_ITEMS.find(
        (item) =>
          item.trackingNo.toLowerCase().includes(lower) ||
          item.containerId.toLowerCase().includes(lower)
      );

      if (!matched) {
        matched = SAMPLE_TRACKING_ITEMS[0]; // KR-2026-8801
      }

      const responseText = `요청하신 운송장 [${matched.trackingNo}] 의 실시간 수송 현황입니다.\n현재 ${matched.currentStation} 위치에 있으며, 정시 운행 진행률은 ${matched.progressPercent}% 입니다.`;

      await addStreamingResponse(responseText, {
        trackingData: matched,
      });
      return;
    }

    // 2. PARCEL / SMALL FREIGHT CALCULATOR QUERY
    if (
      lower.includes('택배') ||
      lower.includes('소량') ||
      lower.includes('kg') ||
      lower.includes('박스') ||
      lower.includes('단가') ||
      lower.includes('개당') ||
      lower.includes('운임') ||
      lower.includes('계산')
    ) {
      // Extract numbers if present
      const weightMatch = lower.match(/(\d+)\s*kg/);
      const qtyMatch = lower.match(/(\d+)\s*(개|박스)/);

      const parsedWeight = weightMatch ? parseInt(weightMatch[1]) : chatParcelWeight;
      const parsedQty = qtyMatch ? parseInt(qtyMatch[1]) : chatParcelQty;

      const parcelResult = calculateParcelFreight({
        weightKg: parsedWeight,
        sizeSumCm: 100,
        quantity: parsedQty,
        regionZone: chatParcelZone,
      });

      const responseText = `📦 소량 화물 / 택배비 견적 안내\n개당 중량 ${parsedWeight}kg, 발송 수량 ${parsedQty}개 기준 실시간 예상 운임입니다.\n수량 증가에 따른 다량 우대 할인(${Math.round(parcelResult.discountRate * 100)}%)이 반영되었습니다.`;

      await addStreamingResponse(responseText, {
        parcelData: {
          weightKg: parsedWeight,
          sizeSumCm: 100,
          quantity: parsedQty,
          regionZone: chatParcelZone,
          result: parcelResult,
        },
      });
      return;
    }

    // 3. CARBON & ESG POLICY QUERY
    if (
      lower.includes('탄소') ||
      lower.includes('정책') ||
      lower.includes('인센티브') ||
      lower.includes('지원') ||
      lower.includes('배출권') ||
      lower.includes('녹색') ||
      lower.includes('esg')
    ) {
      const responseText = `🌿 정부 탄소 감축 지원 및 기업 인센티브 주요 정책 안내\n\n철도물류 전환 및 친환경 경영 기업에 제공되는 대표적 지원 제도입니다:\n\n1. 배출권거래제 유상할당 혜택 & 감축실적 인센티브\n2. 탄소중립 전환 선도설비 장기 저리 융자 지원\n3. 녹색인증(녹색기술·녹색기업) 세제 및 금융 우대\n4. 철도물류 연계 전환교통 보조금 우대\n\n상세 정보 및 신청은 아래 공식 기관 포털을 이용해 주세요.`;

      await addStreamingResponse(responseText, {
        policyLinks: [
          { name: '한국환경공단 배출권거래제 포털', url: 'https://www.keco.or.kr', org: '한국환경공단' },
          { name: '중소벤처기업부 기업마당 정책자금', url: 'https://www.bizinfo.go.kr', org: '중소벤처기업부' },
          { name: '녹색인증 공식 홈페이지 바로가기', url: 'https://www.greencert.or.kr', org: '녹색인증제도' },
        ],
      });
      return;
    }

    // 4. GENERAL DEFAULT LOGISTICS RESPONSE
    const defaultResponse = `문의해주신 내용 [${queryText}] 에 대해 안내해 드립니다.\n\nKORAIL 철도물류통합정보시스템에서는 친환경 스마트 수송 서비스를 제공하고 있습니다.\n• 화물 추적: 운송장 번호(예: KR-2026-8801)로 실시간 위치 확인 가능\n• 운임 시뮬레이터: 소량 택배비부터 대량 컨테이너 및 카카오 T 화물 트럭 연계 운임 산출\n• ESG 정책: 탄소 감축 기업 대상 인센티브 및 보조금 제도 안내\n\n아래 퀵 버튼을 선택하시면 바로 안내받으실 수 있습니다!`;

    await addStreamingResponse(defaultResponse);
  };

  const handleQuickReply = (text: string) => {
    processUserQuery(text);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    processUserQuery(inputMessage);
  };

  // Re-calculate live inline parcel calculator in chat
  const currentParcelCalcResult = calculateParcelFreight({
    weightKg: chatParcelWeight,
    sizeSumCm: 100,
    quantity: chatParcelQty,
    regionZone: chatParcelZone,
  });

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2">
        {!isOpen && (
          <button
            onClick={handleOpenToggle}
            className="bg-white/95 hover:bg-white text-[#002D56] font-black text-xs px-4 py-3 rounded-full shadow-2xl border border-slate-300 backdrop-blur-md transition-all flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95 group"
          >
            <span className="text-emerald-600 animate-spin group-hover:scale-125 transition-transform">✨</span>
            <span>AI 물류 상담 도우미</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
              실시간 24h
            </span>
          </button>
        )}

        <button
          onClick={handleOpenToggle}
          className={`relative p-3.5 rounded-full shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center ${
            isOpen ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#002D56] hover:bg-[#001D47] text-white'
          }`}
          title={isOpen ? '도우미 닫기' : 'AI 물류 도우미 열기'}
        >
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <MessageSquare className="w-5 h-5 text-emerald-300" />
          )}
        </button>
      </div>

      {/* Floating Interactive Chat Drawer/Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002B66] to-[#001D47] text-white p-4 flex items-center justify-between border-b border-blue-900 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative p-2 rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-md">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-[#002B66] animate-ping" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black text-white">KORAIL AI 물류 도우미</h3>
                  <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Live Chat
                  </span>
                </div>
                <p className="text-[11px] text-blue-200">화물추적 · 소량택배비 · ESG 탄소정책 상담</p>
              </div>
            </div>

            <button
              onClick={handleOpenToggle}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-[#002B66] text-emerald-400 font-bold flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[84%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Bubble Text */}
                  <div
                    className={`p-3.5 rounded-2xl shadow-sm text-slate-800 leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#002B66] text-white rounded-tr-none font-medium'
                        : 'bg-white border border-slate-200 rounded-tl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* EMBEDDED IN-CHAT CARGO TRACKING CARD */}
                  {msg.trackingData && (
                    <div className="bg-white rounded-2xl p-4 border border-emerald-300 shadow-md space-y-3 mt-2 text-slate-900">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="font-black text-xs text-[#002B66] flex items-center gap-1">
                          <Train className="w-3.5 h-3.5 text-emerald-600" />
                          {msg.trackingData.trackingNo}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {msg.trackingData.statusText}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 font-bold block">출발지 ➔ 도착지</span>
                          <span className="font-extrabold text-slate-800">{msg.trackingData.origin} ➔ {msg.trackingData.destination}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block">열차편 / 화물</span>
                          <span className="font-extrabold text-slate-800">{msg.trackingData.trainNo}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span>수송 진행률</span>
                          <span className="text-emerald-600 font-black">{msg.trackingData.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${msg.trackingData.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] font-bold text-slate-700 flex justify-between items-center">
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          현재 위치
                        </span>
                        <span className="text-emerald-700 font-extrabold">{msg.trackingData.currentStation}</span>
                      </div>

                      <button
                        onClick={() => {
                          if (onSearchTracking) onSearchTracking(msg.trackingData!.trackingNo);
                          else setActiveTab('tracking');
                          setIsOpen(false);
                        }}
                        className="w-full py-2 bg-[#002B66] hover:bg-[#001F4D] text-white font-extrabold rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer text-xs shadow-sm"
                      >
                        <span>전체 실시간 관제 지도 보기</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* EMBEDDED IN-CHAT PARCEL FREIGHT CALCULATOR CARD */}
                  {msg.parcelData && (
                    <div className="bg-indigo-50/90 rounded-2xl p-4 border border-indigo-200 shadow-md space-y-3 mt-2 text-slate-900">
                      <div className="flex justify-between items-center border-b border-indigo-200/60 pb-2">
                        <span className="font-black text-xs text-indigo-900 flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-indigo-600" />
                          소량 화물/택배 정밀 견적
                        </span>
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          {msg.parcelData.result.weightGradeLabel}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-indigo-100 space-y-2 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">• 개당 단가:</span>
                          <span className="font-mono font-extrabold text-slate-900">
                            {msg.parcelData.result.finalPricePerItem.toLocaleString()} 원
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">• 발송 수량:</span>
                          <span className="font-mono font-extrabold text-slate-900">
                            {msg.parcelData.quantity} 개
                          </span>
                        </div>
                        {msg.parcelData.result.discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-extrabold">
                            <span>• 우대 할인 ({Math.round(msg.parcelData.result.discountRate * 100)}%):</span>
                            <span className="font-mono">-{msg.parcelData.result.discountAmount.toLocaleString()} 원</span>
                          </div>
                        )}
                        <div className="pt-1 border-t border-slate-100 flex justify-between items-center font-black text-xs text-indigo-950">
                          <span>최종 택배 총 운임:</span>
                          <span className="text-base text-indigo-700 font-mono">
                            {msg.parcelData.result.finalTotalCost.toLocaleString()} 원
                          </span>
                        </div>
                      </div>

                      {/* Interactive In-Chat Controls */}
                      <div className="bg-white/80 p-3 rounded-xl border border-indigo-100 space-y-2 text-[11px]">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>실시간 수량 조절:</span>
                          <span className="text-indigo-700 font-extrabold">{chatParcelQty} 개</span>
                        </div>
                        <div className="flex gap-1.5">
                          {[1, 5, 10, 30, 50].map((qty) => (
                            <button
                              key={qty}
                              type="button"
                              onClick={() => {
                                setChatParcelQty(qty);
                                const updated = calculateParcelFreight({
                                  weightKg: chatParcelWeight,
                                  sizeSumCm: 100,
                                  quantity: qty,
                                  regionZone: chatParcelZone,
                                });
                                // update message
                                msg.parcelData!.quantity = qty;
                                msg.parcelData!.result = updated;
                              }}
                              className={`flex-1 py-1 rounded text-[10px] font-bold border cursor-pointer ${
                                chatParcelQty === qty
                                  ? 'bg-indigo-600 text-white border-indigo-700'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                            >
                              {qty}개
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('calculator');
                          setIsOpen(false);
                        }}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer text-xs shadow-sm"
                      >
                        <span>대량 트럭 / 철도 운임 종합 비교하기</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* EMBEDDED POLICY LINKS */}
                  {msg.policyLinks && (
                    <div className="bg-emerald-50/90 rounded-2xl p-4 border border-emerald-200 shadow-md space-y-2 mt-2">
                      <div className="text-xs font-black text-emerald-900 flex items-center gap-1.5 mb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>공식 탄소 정책 포털 신청 바로가기</span>
                      </div>
                      {msg.policyLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-100/80 transition-all flex items-center justify-between group text-[11px] font-bold text-slate-800"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{link.name}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      ))}
                      <button
                        onClick={() => {
                          setActiveTab('carbon_policy');
                          setIsOpen(false);
                        }}
                        className="w-full mt-2 py-2 bg-[#005C2B] hover:bg-[#00421F] text-white font-extrabold rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer text-xs shadow-sm"
                      >
                        <span>탄소 감축 정책 전체 페이지로 이동</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 font-medium px-1 block">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs italic pl-9">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="font-bold text-emerald-700">AI 답변 작성 중...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto flex space-x-1.5 shrink-0">
            <button
              onClick={() => handleQuickReply('KR-2026-8801 화물 실시간 위치 추적해줘')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-[11px] rounded-full border border-slate-200 shrink-0 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Search className="w-3 h-3 text-emerald-600" />
              <span>화물 추적</span>
            </button>
            <button
              onClick={() => handleQuickReply('5kg 10박스 소량 택배비 운임 계산해줘')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-[11px] rounded-full border border-slate-200 shrink-0 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Package className="w-3 h-3 text-indigo-600" />
              <span>소량 택배비 견적</span>
            </button>
            <button
              onClick={() => handleQuickReply('정부 탄소 감축 지원 및 기업 인센티브 정책 알려줘')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-[11px] rounded-full border border-slate-200 shrink-0 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>탄소 감축 정책</span>
            </button>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="운송장 번호, 소량 택배비, 탄소 정책 등 문의..."
              className="flex-grow bg-slate-100 text-slate-900 placeholder-slate-400 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#002B66] font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="bg-[#002B66] hover:bg-[#001D47] disabled:opacity-50 text-white p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md"
            >
              <Send className="w-4 h-4 text-emerald-300" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
