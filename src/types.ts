export type Language = 'KO' | 'ENG';

export type GnbTab =
  | 'home'
  | 'tracking'
  | 'auction'
  | 'vacant_wagons'
  | 'calculator'
  | 'hubs'
  | 'timetable'
  | 'esg'
  | 'carbon_policy'
  | 'dashboard';

export interface VacantWagon {
  id: string;
  wagonType: string;
  wagonCategory: '컨테이너' | '벌크' | '평상화차' | '냉동컨테이너' | '특수화차';
  loadType: 'FCL' | 'LCL';
  stationName: string;
  region: '수도권' | '영남권' | '호남권' | '충청권' | '강원권';
  remainingCount: number;
  departureTime: string;
  destinationRoute: string;
  destinationStation: string;
  discountRate: number;
  originalPrice: number;
  discountPrice: number;
  features: string[];
  trainNo?: string;
  isHot?: boolean;
}

export interface TrackingStep {
  station: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  description: string;
}

export interface TrackingItem {
  trackingNo: string;
  containerId: string;
  sender: string;
  receiver: string;
  cargoType: '컨테이너' | '벌크' | '시멘트' | '철강' | '위험물컨테이너';
  weightTon: number;
  trainNo: string;
  origin: string;
  destination: string;
  departureTime: string;
  estimatedArrival: string;
  currentStation: string;
  currentSpeedKm: number;
  progressPercent: number;
  latitude: number;
  longitude: number;
  statusText: string;
  temperatureC: number;
  humidityPercent: number;
  co2SavedKg: number;
  timeline: TrackingStep[];
}

export interface AuctionItem {
  id: string;
  routeTitle: string;
  origin: string;
  destination: string;
  trainNo: string;
  departureDate: string;
  departureTime: string;
  availableTeu: number;
  cargoTypeAllowed: string[];
  startingPricePerTeu: number;
  currentLowestBid: number;
  buyoutPricePerTeu: number;
  totalBids: number;
  endsAt: string; // ISO string
  status: 'ACTIVE' | 'ENDING_SOON' | 'CLOSED';
}

export interface LogisticsHub {
  id: string;
  name: string;
  region: '수도권' | '영남권' | '호남권' | '충청권' | '강원/대경권';
  category: 'ICD (내륙컨테이너기지)' | '항만연계역' | '철도물류기지' | '화물전용역' | '화물취급 일반역';
  capacityTeu: number;
  trackCount: number;
  trackLengthM: number;
  address: string;
  phone: string;
  hasCustoms: boolean;
  hasColdStorage: boolean;
  operates24h: boolean;
  lat: number;
  lng: number;
  mainCargo?: string;
}

export interface GlobalPort {
  id: string;
  name: string;
  nameEng: string;
  country: '중국' | '일본' | '러시아' | '동남아' | '유럽';
  lat: number;
  lng: number;
  annualTeu: string;
  railRoute: string; // 연계 철도 물류 노선
  keyCargo: string; // 주요 물동량 정보
  description: string;
  flagEmoji: string;
}

export interface FreightTrainSchedule {
  trainNo: string;
  lineName: '경부선' | '호남선' | '전라선' | '영동선' | '중앙선';
  trainType: '블록트레인(고속직통)' | '일반컨테이너' | '벌크/철강전용' | '시멘트수송열차';
  origin: string;
  depTime: string;
  destination: string;
  arrTime: string;
  travelTime: string;
  frequency: string;
  onTimeRate: number;
}

export interface BookingFormState {
  cargoType: '컨테이너' | '벌크' | '시멘트' | '철강';
  origin: string;
  destination: string;
  departureDate: string;
  containerType: '20ft Standard' | '40ft High Cube' | 'Reefer (냉동)' | '벌크화차';
  quantity: number;
  weightTon: number;
  ecoDiscountApplied: boolean;
  companyName: string;
  contactPerson: string;
  phone: string;
}

export interface BidHistory {
  id: string;
  auctionId: string;
  company: string;
  bidAmountTeu: number;
  quantityTeu: number;
  timestamp: string;
}
