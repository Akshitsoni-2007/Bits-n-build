'use client';

import React, { useState, useEffect } from 'react';
import { analyzeDecisionSupport } from '@/lib/api';
import { DecisionSupportResponse } from '@/lib/types';
import { DISTRICTS, CRIME_TYPES } from '@/lib/mock-data';
import GuardrailDisclaimer from '@/components/GuardrailDisclaimer';
import {
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Filter,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function DecisionSupportPage() {
  const [district, setDistrict] = useState<string>('North');
  const [crimeType, setCrimeType] = useState<string>('Robbery / Snatching');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DecisionSupportResponse | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analyzeDecisionSupport({
        district: district || undefined,
        crime_type: crimeType || undefined,
      });
      setData(res);
    } catch (err) {
      console.error('Error fetching decision support analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [district, crimeType]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title & Guardrail */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#c82a2a] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TACTICAL DECISION SUPPORT & EVIDENCE MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Operational Decision Support
          </h1>
        </div>
        <GuardrailDisclaimer
          text="Operational considerations are heuristic models based on aggregated historical patterns. Field command discretion remains paramount."
          variant="subtle"
        />
      </div>

      {/* SCOPE SELECTOR */}
      <div className="p-4 rounded-[16px] bg-[#191C21] border border-[#27272A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA]">
            <Filter className="w-3.5 h-3.5 text-[#cea03d]" />
            <span className="uppercase font-semibold">ANALYSIS SECTOR:</span>
          </div>

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-1.5 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs font-mono text-white focus:outline-none focus:border-[#c82a2a]"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()} SECTOR
              </option>
            ))}
          </select>

          <select
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            className="px-3 py-1.5 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs font-mono text-white focus:outline-none focus:border-[#c82a2a]"
          >
            {CRIME_TYPES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#cea03d] ${loading ? 'animate-spin' : ''}`} />
          <span>RE-ANALYZE EVIDENCE</span>
        </button>
      </div>

      {data && (
        <div className="space-y-6">
          {/* TWO MAIN CARDS: DETECTED PATTERN vs RECOMMENDED OPERATIONAL CONSIDERATION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. DETECTED HISTORICAL PATTERN */}
            <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#c82a2a]/40 shadow-lg shadow-[#c82a2a]/5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c82a2a] animate-ping" />
                  <span className="font-mono text-xs font-bold uppercase text-[#c82a2a] tracking-wider">
                    DETECTED HISTORICAL PATTERN
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#A1A1AA]">TELEMETRY SIGNAL</span>
              </div>

              <p className="text-base text-white font-sans leading-relaxed font-medium">
                {data.pattern}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-[8px] bg-[#14161a] border border-[#27272A]/70">
                  <span className="font-mono text-[9px] text-[#A1A1AA] uppercase block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#cea03d]" /> TEMPORAL HOTSPOT
                  </span>
                  <span className="font-mono text-xs text-white mt-1 block font-semibold">
                    {data.temporal_hotspot || '21:30–02:30 IST'}
                  </span>
                </div>

                <div className="p-3 rounded-[8px] bg-[#14161a] border border-[#27272A]/70">
                  <span className="font-mono text-[9px] text-[#A1A1AA] uppercase block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#c82a2a]" /> SPATIAL CORRIDOR
                  </span>
                  <span className="font-mono text-xs text-white mt-1 block font-semibold truncate">
                    {data.spatial_focus || `${district} Sector`}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. RECOMMENDED OPERATIONAL CONSIDERATION (Distinct styling, non-command phrasing) */}
            <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#cea03d]/50 shadow-lg shadow-[#cea03d]/5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#cea03d]" />
                  <span className="font-mono text-xs font-bold uppercase text-[#cea03d] tracking-wider">
                    OPERATIONAL CONSIDERATION (ADVISORY)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#cea03d] bg-[#cea03d]/10 px-2 py-0.5 rounded border border-[#cea03d]/20">
                  NON-BINDING
                </span>
              </div>

              <div className="p-4 rounded-[12px] bg-[#14161a] border border-[#27272A] text-sm text-[#D4D4D8] leading-relaxed font-sans">
                {data.recommendation}
              </div>

              <div className="text-xs text-[#A1A1AA] font-sans flex items-center gap-2 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Model advisory formulated to maximize resource efficiency while preserving daytime baseline coverage.
                </span>
              </div>
            </div>
          </div>

          {/* EVIDENCE PANEL UNDERNEATH */}
          <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
                  SUPPORTING EVIDENCE & HISTORICAL DATA POINTS
                </h3>
                <p className="text-xs text-[#A1A1AA] font-sans">
                  Empirical metrics and benchmark variance underpinning the detected pattern
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#cea03d]">AUDITABLE MATRIX</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.evidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[12px] bg-[#14161a] border border-[#27272A] flex flex-col justify-between space-y-2 hover:border-[#3F3F46] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                      {ev.label}
                    </span>
                    {ev.trend === 'up' ? (
                      <TrendingUp className="w-3.5 h-3.5 text-[#c82a2a]" />
                    ) : ev.trend === 'down' ? (
                      <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>

                  <div className="text-sm font-semibold text-white font-sans">{ev.value}</div>

                  {ev.benchmark && (
                    <div className="text-[10px] font-mono text-[#A1A1AA] pt-2 border-t border-[#27272A]/50">
                      {ev.benchmark}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Guardrail footnote */}
            <div className="pt-2">
              <GuardrailDisclaimer
                variant="prominent"
                text="Always review field tactical conditions before modifying patrol schedules. Decision support outputs represent aggregate statistical indicators."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
