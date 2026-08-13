import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LogisticsHub, GlobalPort } from '../types';
import { GLOBAL_PORTS } from '../data/mockData';
import { Anchor, Compass, Globe2, MapPin } from 'lucide-react';

interface InteractiveHubMapProps {
  hubs: LogisticsHub[];
  selectedHub: LogisticsHub;
  onSelectHub: (hub: LogisticsHub) => void;
}

export const InteractiveHubMap: React.FC<InteractiveHubMapProps> = ({
  hubs,
  selectedHub,
  onSelectHub,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const hubMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const portMarkersRef = useRef<{ [key: string]: L.Marker }>({});

  const [activePort, setActivePort] = useState<GlobalPort | null>(null);

  // Helper for Domestic Hub Markers (Simple, minimal style with vivid badges)
  const createHubIcon = (category: string, isSelected: boolean) => {
    let bgColor = '#002B66'; // default navy
    let borderColor = '#3b82f6';
    let iconChar = '🚉';

    if (category.includes('ICD')) {
      bgColor = '#005C2B'; // emerald
      borderColor = '#10b981';
      iconChar = '🏢';
    } else if (category.includes('항만')) {
      bgColor = '#0284c7'; // sky blue
      borderColor = '#38bdf8';
      iconChar = '⚓';
    } else if (category.includes('물류기지')) {
      bgColor = '#7c3aed'; // purple
      borderColor = '#a78bfa';
      iconChar = '📦';
    } else if (category.includes('일반역')) {
      bgColor = '#d97706'; // amber/orange
      borderColor = '#fbbf24';
      iconChar = '🚉';
    }

    const size = isSelected ? 42 : 32;
    const activeRing = isSelected
      ? 'box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.6), 0 10px 15px -3px rgba(0, 0, 0, 0.3); transform: scale(1.15); z-index: 999;'
      : 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);';

    const html = `
      <div style="
        background-color: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${isSelected ? '20px' : '15px'};
        transition: all 0.3s ease;
        cursor: pointer;
        ${activeRing}
      ">
        ${iconChar}
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-hub-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };

  // Helper for Global Port Markers (Chip format with Flag + Port Name)
  const createGlobalPortIcon = (port: GlobalPort) => {
    const isRotterdam = port.id === 'PORT-10';
    const bgGradient = isRotterdam
      ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' // deep indigo for Rotterdam / Europe
      : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'; // ocean blue

    const html = `
      <div style="
        background: ${bgGradient};
        border: 2px solid #ffffff;
        border-radius: 20px;
        padding: 4px 10px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
        cursor: pointer;
        white-space: nowrap;
        transition: transform 0.2s ease;
      ">
        <span style="font-size: 13px;">${port.flagEmoji}</span>
        <span>⚓ ${port.name}</span>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-global-port-marker',
      iconAnchor: [40, 16],
      popupAnchor: [0, -18],
    });
  };

  // Fix Leaflet default icon issue if default markers are ever created
  try {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  } catch (e) {
    // ignore
  }

  // Initialize Map with CartoDB Positron Minimal Tile Layer
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
      try {
        // Korea Centered view (36.0, 127.5), Zoom level 7 to show East Asia & domestic hubs
        const map = L.map(mapContainerRef.current, {
          center: [36.0, 127.5],
          zoom: 7,
          zoomControl: true,
        });

        // CartoDB Positron Minimal Light Tile Layer (Simple pastel map showing land, sea, borders)
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> | KORAIL Logistics',
            subdomains: 'abcd',
            maxZoom: 18,
          }
        ).addTo(map);

        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Error initializing Leaflet map:', err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Leaflet map cleanup warning:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Domestic Hub & Global Port Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing hub markers
    (Object.values(hubMarkersRef.current) as L.Marker[]).forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        // ignore
      }
    });
    hubMarkersRef.current = {};

    // Clear existing port markers
    (Object.values(portMarkersRef.current) as L.Marker[]).forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        // ignore
      }
    });
    portMarkersRef.current = {};

    // 1. Render Domestic Hub Markers
    hubs.forEach((hub) => {
      const isSelected = selectedHub && selectedHub.id === hub.id;
      const icon = createHubIcon(hub.category, isSelected);

      try {
        const marker = L.marker([hub.lat, hub.lng], { icon }).addTo(map);

        const popupHtml = `
          <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 250px;">
            <div style="font-size: 10px; font-weight: 800; color: #005C2B; text-transform: uppercase; margin-bottom: 2px;">
              ${hub.region} • ${hub.category}
            </div>
            <h4 style="font-size: 14px; font-weight: 900; color: #0f172a; margin: 0 0 6px 0;">
              ${hub.name}
            </h4>
            <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.4;">
              ${hub.address}
            </p>
            ${
              hub.mainCargo
                ? `<div style="font-size: 10px; font-weight: 700; color: #002B66; background: #eff6ff; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px;">주요취급: ${hub.mainCargo}</div>`
                : ''
            }
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <span style="font-size: 11px; font-weight: 800; color: #0f172a;">
                ${(hub.capacityTeu / 10000).toFixed(0)}만 TEU/년
              </span>
              <span style="font-size: 10px; color: #005C2B; font-weight: 800;">
                📞 ${hub.phone}
              </span>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml, { closeButton: true });

        marker.on('click', () => {
          onSelectHub(hub);
        });

        hubMarkersRef.current[hub.id] = marker;
      } catch (err) {
        console.error('Error adding hub marker:', err);
      }
    });

    // 2. Render Global Major Port Markers
    GLOBAL_PORTS.forEach((port) => {
      const icon = createGlobalPortIcon(port);
      try {
        const marker = L.marker([port.lat, port.lng], { icon }).addTo(map);

        const portPopupHtml = `
          <div style="font-family: system-ui, sans-serif; padding: 6px; max-width: 290px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 2px 8px; border-radius: 12px;">
                ${port.flagEmoji} ${port.country} • 글로벌 주요 항구
              </span>
              <span style="font-size: 10px; font-weight: 800; color: #0369a1;">
                TEU: ${port.annualTeu}
              </span>
            </div>

            <h4 style="font-size: 15px; font-weight: 900; color: #0f172a; margin: 0 0 2px 0;">
              ${port.name} <span style="font-size: 12px; font-weight: 600; color: #64748b;">(${port.nameEng})</span>
            </h4>

            <p style="font-size: 11px; color: #334155; margin: 0 0 8px 0; line-height: 1.35;">
              ${port.description}
            </p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px; font-size: 11px; margin-bottom: 6px;">
              <div style="font-weight: 800; color: #002B66; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                <span>🛤️</span> <span>연계 철도 물류 노선:</span>
              </div>
              <div style="color: #1e293b; font-weight: 600; line-height: 1.4;">
                ${port.railRoute}
              </div>
            </div>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 8px; font-size: 11px;">
              <div style="font-weight: 800; color: #005C2B; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                <span>📦</span> <span>주요 물동량 정보:</span>
              </div>
              <div style="color: #14532d; font-weight: 600; line-height: 1.4;">
                ${port.keyCargo}
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(portPopupHtml, { closeButton: true, maxWidth: 310 });

        marker.on('click', () => {
          setActivePort(port);
        });

        portMarkersRef.current[port.id] = marker;
      } catch (err) {
        console.error('Error adding port marker:', err);
      }
    });

    // Auto Center map on selected domestic hub if active
    if (selectedHub && hubMarkersRef.current[selectedHub.id]) {
      try {
        hubMarkersRef.current[selectedHub.id].openPopup();
      } catch (e) {
        // ignore
      }
    }
  }, [hubs, selectedHub, onSelectHub]);

  // Quick Pan Actions
  const handleQuickPan = (regionKey: 'korea' | 'china' | 'japan' | 'vladivostok' | 'rotterdam') => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      if (regionKey === 'korea') {
        map.flyTo([36.0, 127.5], 7, { duration: 1.2 });
      } else if (regionKey === 'china') {
        map.flyTo([36.5, 120.0], 5.5, { duration: 1.2 });
      } else if (regionKey === 'japan') {
        map.flyTo([35.2, 137.5], 6, { duration: 1.2 });
      } else if (regionKey === 'vladivostok') {
        map.flyTo([43.11, 131.88], 8, { duration: 1.2 });
        if (portMarkersRef.current['PORT-08']) {
          portMarkersRef.current['PORT-08'].openPopup();
        }
      } else if (regionKey === 'rotterdam') {
        // Rotterdam (Europe)
        map.flyTo([51.95, 4.14], 7, { duration: 1.8 });
        if (portMarkersRef.current['PORT-10']) {
          portMarkersRef.current['PORT-10'].openPopup();
        }
      }
    } catch (e) {
      console.warn('Map quick pan error:', e);
    }
  };

  return (
    <div className="relative w-full h-[460px] lg:h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-xl z-10">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Quick Navigation Controls Bar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-slate-200 max-w-[90%]">
        <span className="text-[11px] font-black text-slate-800 px-2 flex items-center gap-1">
          <Globe2 className="w-3.5 h-3.5 text-[#002B66]" />
          빠른 이동:
        </span>
        <button
          onClick={() => handleQuickPan('korea')}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          🇰🇷 대한민국
        </button>
        <button
          onClick={() => handleQuickPan('china')}
          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#002B66] rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          🇨🇳 중국 주요항
        </button>
        <button
          onClick={() => handleQuickPan('japan')}
          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          🇯🇵 일본 주요항
        </button>
        <button
          onClick={() => handleQuickPan('vladivostok')}
          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          🇷🇺 블라디보스토크
        </button>
        <button
          onClick={() => handleQuickPan('rotterdam')}
          className="px-2.5 py-1 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-black transition-all shadow cursor-pointer flex items-center gap-1"
        >
          <span>🇪🇺</span>
          <span>로테르담 (유럽 칩)</span>
        </button>
      </div>

      {/* Map Legend & Style Indicator Badge */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 z-[1000] text-xs font-bold text-slate-800 space-y-2">
        <div className="text-[11px] font-black text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
          <span>범례 및 마커 가이드</span>
          <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded">CartoDB 미니멀 타일</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shrink-0" />
            <span>ICD (내륙컨테이너기지)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-sky-600 border border-white shrink-0" />
            <span>항만연계역</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-purple-600 border border-white shrink-0" />
            <span>철도물류기지</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-600 border border-white shrink-0" />
            <span>화물취급 일반역</span>
          </div>
          <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
            <span className="px-2 py-0.5 rounded-full bg-sky-600 text-white font-extrabold text-[10px] flex items-center gap-0.5">
              <span>⚓</span> <span>글로벌 항구</span>
            </span>
            <span className="text-slate-600 font-extrabold text-[10px]">칭다오/상하이/오사카/로테르담 등</span>
          </div>
        </div>
      </div>
    </div>
  );
};
