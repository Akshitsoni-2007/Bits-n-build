'use client';

import React, { useEffect, useState } from 'react';
import { Incident } from '@/lib/types';
import { MapPin, ShieldAlert, Crosshair, ZoomIn, ZoomOut, Layers, Eye } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface IncidentMapProps {
  incidents: Incident[];
  selectedDistrict?: string;
  selectedCrime?: string;
  onSelectIncident?: (incident: Incident) => void;
}

export default function IncidentMapClient({
  incidents,
  selectedDistrict,
  selectedCrime,
  onSelectIncident,
}: IncidentMapProps) {
  const [mapId] = useState(() => `tactical-map-${Math.random().toString(36).substring(2, 9)}`);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    // Clean up if re-rendering
    const container = document.getElementById(mapId);
    if (!container) return;

    // Center map around metropolitan Delhi/NCR coordinates
    const defaultCenter: [number, number] = [28.6139, 77.2090];
    const map = L.map(mapId, {
      center: defaultCenter,
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Matter CartoDB tiles
    const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY;
if (cartoKey) {
  L.tileLayer(`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${cartoKey}`, {
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);
} else {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: 'abc',
  }).addTo(map);
}
  
  
  

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, [mapId]);

  // Update markers whenever incidents or map changes
  useEffect(() => {
    if (!mapInstance) return;

    const layerGroup = L.layerGroup().addTo(mapInstance);

    incidents.forEach((inc) => {
      // Color based on crime type and priority
      const isHighPriority = inc.priority === 'HIGH' || inc.hour >= 22 || inc.hour <= 4;
      const markerColor = isHighPriority ? '#c82a2a' : '#cea03d';

      const customIcon = L.divIcon({
        className: 'custom-tactical-pin',
        html: `
          <div style="
            width: 18px; 
            height: 18px; 
            background: ${markerColor}; 
            border: 2px solid #FFFFFF; 
            border-radius: 50%; 
            box-shadow: 0 0 12px ${markerColor}99;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 4px; height: 4px; background: #FFFFFF; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; min-width: 220px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #cea03d;">
              ${inc.fir_id}
            </span>
            <span style="font-size: 9px; padding: 2px 6px; border-radius: 4px; background: ${isHighPriority ? '#c82a2a22' : '#27272A'}; color: ${isHighPriority ? '#c82a2a' : '#A1A1AA'}; font-weight: bold;">
              ${inc.priority || 'MEDIUM'} PRIORITY
            </span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #FFFFFF; margin-bottom: 4px;">
            ${inc.crime_type}
          </div>
          <div style="font-size: 11px; color: #A1A1AA; margin-bottom: 6px;">
            📍 ${inc.location_name || inc.district} (${inc.hour}:00 hrs, ${inc.day_of_week})
          </div>
          <p style="font-size: 11px; color: #D4D4D8; line-height: 1.4; margin: 0 0 8px 0;">
            ${inc.description}
          </p>
          <div style="font-family: monospace; font-size: 10px; color: #71717A;">
            COORDS: [${inc.latitude.toFixed(4)}, ${inc.longitude.toFixed(4)}]
          </div>
        </div>
      `);

      marker.on('click', () => {
        setActiveIncident(inc);
        if (onSelectIncident) onSelectIncident(inc);
      });

      layerGroup.addLayer(marker);
    });

    return () => {
      layerGroup.clearLayers();
    };
  }, [mapInstance, incidents, onSelectIncident]);

  return (
    <div className="relative w-full h-[460px] rounded-[16px] overflow-hidden border border-[#27272A] bg-[#191C21]">
      {/* Tactical Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-[#050201]/90 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-[#27272A] shadow-md pointer-events-auto">
        <Crosshair className="w-3.5 h-3.5 text-[#cea03d] animate-pulse" />
        <span className="font-mono text-[11px] font-semibold text-white uppercase tracking-wider">
          TACTICAL GRID: DELHI-NCR
        </span>
        <span className="text-[10px] font-mono text-[#A1A1AA] border-l border-[#27272A] pl-2">
          {incidents.length} PLOTTED INCIDENTS
        </span>
      </div>

      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-3 bg-[#050201]/90 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-[#27272A] shadow-md pointer-events-auto text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c82a2a] inline-block shadow-[0_0_8px_#c82a2a]"></span>
          <span className="text-white">NIGHT / HIGH-ALERT</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#cea03d] inline-block shadow-[0_0_8px_#cea03d]"></span>
          <span className="text-[#A1A1AA]">STANDARD DISPATCH</span>
        </div>
      </div>

      {/* Map Element Container */}
      <div id={mapId} className="w-full h-full z-0" />

      {/* Bottom overlay status */}
      <div className="absolute bottom-3 left-3 z-[400] bg-[#050201]/90 backdrop-blur-md px-3 py-1.5 rounded-[8px] border border-[#27272A] text-[10px] font-mono text-[#A1A1AA] flex items-center gap-2">
        <span className="text-emerald-400">● LIVE PROJECTION</span>
        <span>• CLUSTERING ACTIVE</span>
        <span>• CARTOGRAPHIC BASE: CARTO DARK</span>
      </div>
    </div>
  );
}
