'use client';

import React, { useState } from 'react';
import { predictRisk } from '@/lib/api';
import { PredictRiskResponse, RiskClassification } from '@/lib/types';
import { DISTRICTS, DISTRICT_NAMES, CRIME_TYPES, MONTHS } from '@/lib/constants';
import GuardrailDisclaimer from '@/components/GuardrailDisclaimer';
import {
  Gauge,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldAlert,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function RiskPredictorPage() {
  const [district, setDistrict] = useState<string>(DISTRICT_NAMES[0]);
  const [crimeType, setCrimeType] = useState<string>(CRIME_TYPES[0]);
  const [month, setMonth] = useState<string>('November');
  const [hour, setHour] = useState<number>(23);
  const [isWeekend, setIsWeekend] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictRiskResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await predictRisk({
        district,
        crime_type: crimeType,
        month,
        hour,
        is_weekend: isWeekend,
      });
      setPrediction(res);
    } catch (err) {
      console.error('Error calculating risk prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper for pill styling based on classification
  const getClassificationStyle = (classification: RiskClassification) => {
    switch (classification) {
      case 'HIGH':
        return 'bg-[#c82a2a]/20 text-[#c82a2a] border-[#c82a2a] shadow-[0_0_15px_rgba(200,42,42,0.3)]';
      case 'MODERATE-HIGH':
        return 'bg-[#cea03d]/20 text-[#cea03d] border-[#cea03d] shadow-[0_0_15px_rgba(206,160,61,0.25)]';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/60';
      case 'LOW':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60';
    }
  };

  // Helper for gauge dial color
  const getGaugeColor = (score: number) => {
    if (score >= 75) return '#c82a2a'; // Crimson
    if (score >= 50) return '#cea03d'; // Gold
    if (score >= 30) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Title & Guardrail */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#cea03d] uppercase tracking-wider mb-1">
            <Gauge className="w-3.5 h-3.5" />
            <span>EXPLAINABLE SHAP & PROBABILITY ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Spatial-Temporal Risk Estimator
          </h1>
        </div>
        <GuardrailDisclaimer
          text="Statistical indicator from historical data — not a guarantee of an incident occurring."
          variant="subtle"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT FORM (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <span className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
              ESTIMATION PARAMETERS
            </span>
            <span className="text-[10px] font-mono text-[#A1A1AA]">INPUT PROFILES</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* District Selection */}
            <div>
              <label className="block font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                TARGET DISTRICT / SECTOR
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#050201] border border-[#27272A] text-white font-mono focus:outline-none focus:border-[#c82a2a] transition-colors"
              >
                {DISTRICT_NAMES.map((d) => (
                  <option key={d} value={d}>
                    {d} Sector
                  </option>
                ))}
              </select>
            </div>

            {/* Crime Classification */}
            <div>
              <label className="block font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                CRIME CLASSIFICATION
              </label>
              <select
                value={crimeType}
                onChange={(e) => setCrimeType(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#050201] border border-[#27272A] text-white font-mono focus:outline-none focus:border-[#c82a2a] transition-colors"
              >
                {CRIME_TYPES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                SEASONAL CYCLE (MONTH)
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#050201] border border-[#27272A] text-white font-mono focus:outline-none focus:border-[#c82a2a] transition-colors"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Hour (0-23) Slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#cea03d]" />
                  TIME OF DAY (24-HR)
                </label>
                <span className="font-mono text-xs font-bold text-[#cea03d] px-2 py-0.5 rounded bg-[#050201] border border-[#27272A]">
                  {hour.toString().padStart(2, '0')}:00 HRS
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value, 10))}
                className="w-full accent-[#c82a2a] bg-[#050201] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#A1A1AA]/60 mt-1">
                <span>00:00 (MIDNIGHT)</span>
                <span>12:00 (NOON)</span>
                <span>23:00 (NIGHT)</span>
              </div>
            </div>

            {/* Weekend Toggle */}
            <div className="pt-2">
              <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#14161a] border border-[#27272A]">
                <div>
                  <span className="font-mono text-[11px] text-white font-semibold uppercase block">
                    WEEKEND CYCLE
                  </span>
                  <span className="text-[10px] text-[#A1A1AA]">
                    Friday 20:00 through Sunday 23:59 shift
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWeekend(!isWeekend)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isWeekend ? 'bg-[#c82a2a] justify-end' : 'bg-[#27272A] justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-[8px] bg-[#c82a2a] text-white font-mono font-bold text-xs tracking-wider uppercase hover:bg-[#a52222] transition-colors shadow-lg shadow-[#c82a2a]/20 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>COMPUTING EXPLAINABLE SHAP...</span>
                </>
              ) : (
                <>
                  <span>RUN RISK ESTIMATION MODEL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* OUTPUT PANEL (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {prediction ? (
            <>
              {/* GAUGE & CLASSIFICATION CARD */}
              <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-full flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                    RISK PROBABILITY GAUGE
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> MODEL COMPUTED
                  </span>
                </div>

                {/* Tactical SVG Semi-Circle Gauge */}
                <div className="relative w-64 h-36 flex flex-col items-center justify-end">
                  <svg className="w-64 h-36" viewBox="0 0 200 110">
                    {/* Background Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#27272A"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    {/* Value Arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke={getGaugeColor(prediction.risk_score)}
                      strokeWidth="16"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * (prediction.risk_score / 100))}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Gauge Value in Center */}
                  <div className="absolute top-10 flex flex-col items-center">
                    <div
                      className="text-5xl font-medium tracking-tight font-sans leading-none"
                      style={{ color: getGaugeColor(prediction.risk_score) }}
                    >
                      {prediction.risk_score}
                    </div>
                    <span className="font-mono text-[10px] text-[#A1A1AA] mt-1">
                      INDEX (0–100)
                    </span>
                  </div>
                </div>

                {/* CLASSIFICATION PILL BELOW GAUGE */}
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div
                    className={`px-5 py-1.5 rounded-full font-mono text-xs font-bold tracking-widest uppercase border ${getClassificationStyle(
                      prediction.classification
                    )}`}
                  >
                    ESTIMATED RISK: {prediction.classification}
                  </div>
                  <span className="text-xs text-[#A1A1AA] font-sans">
                    {prediction.baseline_comparison}
                  </span>
                </div>

                {/* PERSISTENT NON-DISMISSABLE DISCLAIMER */}
                <div className="w-full mt-6">
                  <GuardrailDisclaimer
                    variant="prominent"
                    text="Statistical indicator from historical data — not a guarantee of an incident occurring. Intended exclusively for strategic resource allocation analysis."
                  />
                </div>
              </div>

              {/* CONTRIBUTING FACTORS BREAKDOWN (SHAP EVIDENCE) */}
              <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                      SHAP CONTRIBUTING FACTORS EVIDENCE
                    </h3>
                    <p className="text-xs text-[#A1A1AA] font-sans">
                      Decomposition of positive and negative historical risk drivers
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#cea03d]">EXPLAINABLE AI</span>
                </div>

                <div className="space-y-3.5">
                  {prediction.contributing_factors.map((item, idx) => {
                    const isPositive = item.direction !== 'negative';
                    const absPct = Math.abs(item.pct_contribution);

                    return (
                      <div key={idx} className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white font-sans">{item.factor}</span>
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              isPositive ? 'text-[#c82a2a]' : 'text-emerald-400'
                            }`}
                          >
                            {isPositive ? `+${absPct.toFixed(1)}%` : `-${absPct.toFixed(1)}%`}
                          </span>
                        </div>

                        {/* Horizontal Bar */}
                        <div className="w-full h-2 rounded-full bg-[#050201] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isPositive ? 'bg-[#c82a2a]' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, absPct * 3.5)}%` }}
                          />
                        </div>

                        {item.description && (
                          <span className="text-[10px] text-[#A1A1AA] block">
                            {item.description}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* EMPTY INITIAL STATE */
            <div className="h-full min-h-[440px] p-8 rounded-[16px] bg-[#191C21] border border-dashed border-[#27272A] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#050201] border border-[#27272A] flex items-center justify-center">
                <Gauge className="w-7 h-7 text-[#cea03d]" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                  RISK ESTIMATOR AWAITING PARAMETERS
                </h3>
                <p className="text-xs text-[#A1A1AA] font-sans">
                  Select district, crime classification, month, and temporal shift on the left to compute historical probability & SHAP factor weights.
                </p>
              </div>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs font-mono text-[#cea03d] hover:border-[#cea03d] transition-colors"
              >
                RUN WITH DEFAULT PARAMETERS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
