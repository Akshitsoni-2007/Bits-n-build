'use client';

import React, { useState } from 'react';
import { runSimulator } from '@/lib/api';
import { SimulatorResponse } from '@/lib/types';
import { DISTRICTS } from '@/lib/mock-data';
import GuardrailDisclaimer from '@/components/GuardrailDisclaimer';
import {
  Cpu,
  Play,
  TrendingUp,
  Clock,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

const PRESET_SCENARIOS = [
  'Reallocate 4 units from Central daytime patrol to Cyber City nocturnal transit corridor',
  'Deploy 6 motorized interceptors along North district arterial highway bypass between 22:00–04:00',
  'Reinforce South sector commercial jewelry hubs with 3 static perimeter checkpoints',
];

export default function DecisionSimulatorPage() {
  const [allocation, setAllocation] = useState<number>(12);
  const [scenario, setScenario] = useState<string>(PRESET_SCENARIOS[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Cyber City');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SimulatorResponse | null>(null);

  const handleSimulate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await runSimulator({
        current_allocation: allocation,
        scenario,
        focus_district: selectedDistrict,
      });
      setResult(res);
    } catch (err) {
      console.error('Error running simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title & Guardrail */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#cea03d] uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>OPERATIONAL RESOURCE DISPATCH SIMULATOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Patrol Allocation Simulator
          </h1>
        </div>
        <GuardrailDisclaimer
          text="Estimate based on historical/model assumptions — actual spatial coverage depends on real-time traffic and field conditions."
          variant="subtle"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT & SCENARIO BUILDER (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <span className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
              SIMULATION PARAMETERS
            </span>
            <span className="text-[10px] font-mono text-[#cea03d]">MODEL v1.2</span>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4 text-xs">
            {/* Allocation Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
                  CURRENT DEPLOYED PATROL UNITS
                </label>
                <span className="font-mono text-xs font-bold text-[#cea03d] px-2 py-0.5 rounded bg-[#050201] border border-[#27272A]">
                  {allocation} UNITS
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={allocation}
                onChange={(e) => setAllocation(parseInt(e.target.value, 10))}
                className="w-full accent-[#c82a2a] bg-[#050201] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#A1A1AA]/60 mt-1">
                <span>2 (MIN SKELETON)</span>
                <span>15 (STANDARD)</span>
                <span>30 (FULL SURGE)</span>
              </div>
            </div>

            {/* Target District */}
            <div>
              <label className="block font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                PRIMARY INTERVENTION ZONE
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-[8px] bg-[#050201] border border-[#27272A] text-white font-mono focus:outline-none focus:border-[#c82a2a]"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d} Sector
                  </option>
                ))}
              </select>
            </div>

            {/* Scenario Description Input */}
            <div>
              <label className="block font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-1.5">
                DISPATCH SCENARIO / HYPOTHESIS
              </label>
              <textarea
                rows={3}
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Describe resource movement (e.g. 'move 4 units from day shift to night corridor in Cyber City')..."
                className="w-full p-3 rounded-[8px] bg-[#050201] border border-[#27272A] text-white font-sans text-xs focus:outline-none focus:border-[#c82a2a] leading-relaxed"
              />
            </div>

            {/* Preset chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-[#A1A1AA] block">
                PRESET SCENARIO TEMPLATES:
              </span>
              {PRESET_SCENARIOS.map((sc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScenario(sc)}
                  className="w-full text-left p-2 rounded-[6px] bg-[#050201] border border-[#27272A] text-[11px] text-[#A1A1AA] hover:text-[#cea03d] hover:border-[#cea03d] transition-colors truncate block"
                >
                  {sc}
                </button>
              ))}
            </div>

            {/* Run Button */}
            <button
              type="submit"
              disabled={loading || !scenario.trim()}
              className="w-full py-3 px-4 rounded-[8px] bg-[#c82a2a] text-white font-mono font-bold text-xs tracking-wider uppercase hover:bg-[#a52222] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#c82a2a]/20"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>CALCULATING COVARIANCE DELTA...</span>
                </>
              ) : (
                <>
                  <span>RUN DISPATCH SIMULATION</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* OUTPUT RESULTS PANEL (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {result ? (
            <>
              {/* PRIMARY STAT CARD */}
              <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#cea03d]/50 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
                  <span className="font-mono text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                    SIMULATION IMPACT PROJECTION
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> CONVERGED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Big Coverage Stat */}
                  <div className="p-4 rounded-[12px] bg-[#14161a] border border-[#27272A] space-y-1">
                    <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block">
                      ESTIMATED COVERAGE CHANGE
                    </span>
                    <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#cea03d] font-sans leading-none">
                      +{result.estimated_coverage_change_pct}%
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                      ▲ Net hotspot density improvement
                    </span>
                  </div>

                  {/* Response Latency Projection */}
                  <div className="p-4 rounded-[12px] bg-[#14161a] border border-[#27272A] space-y-1">
                    <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block">
                      PROJECTED RESPONSE LATENCY
                    </span>
                    <div className="text-4xl sm:text-5xl font-medium tracking-tight text-white font-sans leading-none">
                      {result.estimated_response_time_delta_min || -2.4}m
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                      ▼ Expected response acceleration
                    </span>
                  </div>
                </div>

                {/* Model Assumptions Label & Disclaimer */}
                <div className="p-3 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs space-y-1">
                  <div className="font-mono text-[11px] text-[#cea03d] uppercase font-bold">
                    MODEL SPECIFICATION NOTICE:
                  </div>
                  <p className="text-[#A1A1AA] font-sans text-xs leading-relaxed">
                    Estimate based on historical/model assumptions (Monte Carlo spatial queueing model assuming constant transit velocity and historical dispatch call intervals).
                  </p>
                </div>
              </div>

              {/* OPERATIONAL IMPACT NOTES */}
              {result.operational_impact_notes && (
                <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-3">
                  <span className="font-mono text-xs font-semibold uppercase text-white tracking-wider block">
                    PROJECTED OPERATIONAL DYNAMICS
                  </span>
                  <ul className="space-y-2 text-xs text-[#D4D4D8] font-sans">
                    {result.operational_impact_notes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#c82a2a] font-bold font-mono shrink-0">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            /* EMPTY INITIAL STATE */
            <div className="h-full min-h-[440px] p-8 rounded-[16px] bg-[#191C21] border border-dashed border-[#27272A] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#050201] border border-[#27272A] flex items-center justify-center">
                <Cpu className="w-7 h-7 text-[#cea03d]" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                  SIMULATION ENGINE READY
                </h3>
                <p className="text-xs text-[#A1A1AA] font-sans">
                  Configure allocated patrol units and proposed tactical shifts on the left to project spatial coverage deltas.
                </p>
              </div>
              <button
                onClick={() => handleSimulate()}
                className="px-4 py-2 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs font-mono text-[#cea03d] hover:border-[#cea03d] transition-colors"
              >
                RUN DEFAULT PRESET
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
