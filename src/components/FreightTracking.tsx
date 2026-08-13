import React from 'react';
import { TrackingSection } from './TrackingSection';
import { GnbTab, Language } from '../types';

interface FreightTrackingProps {
  initialSearchCode?: string;
  setActiveTab?: (tab: GnbTab) => void;
  lang?: Language;
}

export const FreightTracking: React.FC<FreightTrackingProps> = (props) => {
  return <TrackingSection {...props} />;
};

export default FreightTracking;
