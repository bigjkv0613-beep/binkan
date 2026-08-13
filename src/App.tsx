import React, { useState } from 'react';
import { GnbTab, Language, VacantWagon } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MainServicesCards } from './components/MainServicesCards';
import { FreightTracking } from './components/FreightTracking';
import { AuctionSection } from './components/AuctionSection';
import { VacantWagonsSection } from './components/VacantWagonsSection';
import { FreightCalculator } from './components/FreightCalculator';
import { LogisticsHubs } from './components/LogisticsHubs';
import { TimetableSection } from './components/TimetableSection';
import { EsgSection } from './components/EsgSection';
import { CarbonPolicySection } from './components/CarbonPolicySection';
import { MyDashboard } from './components/MyDashboard';
import { Footer } from './components/Footer';
import { AiChatAssistant } from './components/AiChatAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState<GnbTab>('home');
  const [lang, setLang] = useState<Language>('KO');
  const [trackingSearchCode, setTrackingSearchCode] = useState<string>('KR-2026-8801');
  const [selectedWagonForBooking, setSelectedWagonForBooking] = useState<VacantWagon | null>(null);

  const handleSearchTracking = (code: string) => {
    setTrackingSearchCode(code);
    setActiveTab('tracking');
  };

  const handleTabChange = (tab: GnbTab) => {
    setActiveTab(tab);
  };

  const handleSelectWagonForBooking = (wagon: VacantWagon) => {
    setSelectedWagonForBooking(wagon);
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Noto_Sans_KR',sans-serif]">
      {/* 1. Top Header & Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Main Home Landing Page (Hero + Service Cards only; no tracking detail card) */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              setActiveTab={handleTabChange}
              onSearchTracking={handleSearchTracking}
              lang={lang}
            />

            <MainServicesCards setActiveTab={handleTabChange} lang={lang} />
          </>
        )}

        {/* Dedicated Real-time Freight Tracking Standalone Page */}
        {activeTab === 'tracking' && (
          <FreightTracking
            initialSearchCode={trackingSearchCode}
            setActiveTab={setActiveTab}
            lang={lang}
          />
        )}

        {/* Real-time Idle Freight Cars LIVE Section */}
        {activeTab === 'vacant_wagons' && (
          <VacantWagonsSection
            onSelectWagonForBooking={handleSelectWagonForBooking}
            setActiveTab={setActiveTab}
            lang={lang}
          />
        )}

        {/* Other GNB Tabs */}
        {activeTab === 'auction' && <AuctionSection lang={lang} />}

        {activeTab === 'calculator' && (
          <FreightCalculator lang={lang} setActiveTab={handleTabChange} />
        )}

        {activeTab === 'hubs' && <LogisticsHubs lang={lang} />}

        {activeTab === 'timetable' && (
          <TimetableSection setActiveTab={setActiveTab} lang={lang} />
        )}

        {activeTab === 'esg' && <EsgSection lang={lang} />}

        {activeTab === 'carbon_policy' && <CarbonPolicySection lang={lang} />}

        {activeTab === 'dashboard' && (
          <MyDashboard
            setActiveTab={setActiveTab}
            onSearchTracking={handleSearchTracking}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Interactive AI Logistics Chat Assistant Widget */}
      <AiChatAssistant
        setActiveTab={handleTabChange}
        onSearchTracking={handleSearchTracking}
      />
    </div>
  );
}
