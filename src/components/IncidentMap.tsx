'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Incident } from '@/lib/types';
import { MapPin } from 'lucide-react';

const IncidentMapClient = dynamic(() => import('./IncidentMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] rounded-[16px] border border-[#27272A] bg-[#191C21] flex flex-col items-center justify-center gap-3 animate-pulse">
      <MapPin className="w-8 h-8 text-[#cea03d] animate-bounce" />
      <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-wider">
        INITIALIZING SPATIAL CARTOGRAPHY ENGINE...
      </span>
    </div>
  ),
});

interface IncidentMapProps {
  incidents: Incident[];
  selectedDistrict?: string;
  selectedCrime?: string;
  onSelectIncident?: (incident: Incident) => void;
}

export default function IncidentMap(props: IncidentMapProps) {
  return <IncidentMapClient {...props} />;
}
