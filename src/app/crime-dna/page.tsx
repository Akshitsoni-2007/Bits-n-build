'use client';

import React, { useState } from 'react';
import { searchCrimeDNA } from '@/lib/api';
import { DNAMatch } from '@/lib/types';
import GuardrailDisclaimer from '@/components/GuardrailDisclaimer';
import {
  Dna,
  Search,
  Check,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  FileText,
  Copy,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const SAMPLE_NARRATIVES = [
  {
    title: 'Nocturnal Two-Wheeler Snatching',
    text: 'Two suspects riding a dark motorcycle intercepted a pedestrian at 23:30 hrs near the metro subway exit, forcefully snatched handbag containing phone and cash, and fled into the arterial highway bypass.',
  },
  {
    title: 'Commercial Shutter Forced Entry',
    text: 'Forced structural breach of retail electronics shop lock and rolling shutter between 02:00 and 04:00 hrs. Cash register emptied and inventory loaded into unmarked carrier vehicle.',
  },
  {
    title: 'ATM Skimming & Card Cloning',
    text: 'ATM skimming device detected at midnight with duplicate cloned magnetic card attempts draining multiple corporate payroll accounts across consecutive transactions.',
  },
];

export default function CrimeDNAPage() {
  const [narrative, setNarrative] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<DNAMatch[] | null>(null);

  const handleSearch = async (textToSearch?: string) => {
    const text = textToSearch || narrative;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await searchCrimeDNA({ narrative: text });
      setMatches(res.matches);
    } catch (err) {
      console.error('Error searching Crime DNA:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sampleText: string) => {
    setNarrative(sampleText);
    handleSearch(sampleText);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title & Guardrail */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#c82a2a] uppercase tracking-wider mb-1">
            <Dna className="w-3.5 h-3.5" />
            <span>MODUS OPERANDI (MO) PATTERN RECOGNITION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Crime DNA & MO Similarity Engine
          </h1>
        </div>
        <GuardrailDisclaimer
          text="Heuristic semantic similarity against historical FIR narratives — indicates behavioral pattern correlation, not culpability."
          variant="subtle"
        />
      </div>

      {/* INPUT NARRATIVE SECTION */}
      <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#27272A]">
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
              INCIDENT NARRATIVE / CASE MEMO
            </h2>
            <p className="text-xs text-[#A1A1AA] font-sans">
              Paste registered complaint text, witness statements, or field investigator notes
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-[#A1A1AA]">SAMPLE LOADS:</span>
            {SAMPLE_NARRATIVES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => loadSample(sample.text)}
                className="px-2.5 py-1 rounded-[6px] bg-[#050201] border border-[#27272A] text-[10px] font-mono text-[#cea03d] hover:border-[#cea03d] hover:text-white transition-colors"
              >
                {sample.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={4}
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Paste case narrative here (e.g. 'Suspects on black motorcycle approached pedestrian near metro terminal at 23:00 hrs, snatched gold chain and fled towards bypass...')"
            className="w-full p-4 rounded-[12px] bg-[#050201] border border-[#27272A] text-white text-xs font-sans placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c82a2a] transition-colors leading-relaxed"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[11px] font-mono text-[#A1A1AA]">
            {narrative.length} CHARACTERS ENTERED • VECTOR EMBEDDING READY
          </span>

          <div className="flex items-center gap-2">
            {narrative && (
              <button
                onClick={() => {
                  setNarrative('');
                  setMatches(null);
                }}
                className="px-3 py-2 rounded-[8px] bg-[#27272A] text-xs font-mono text-[#A1A1AA] hover:text-white"
              >
                CLEAR
              </button>
            )}

            <button
              onClick={() => handleSearch()}
              disabled={loading || !narrative.trim()}
              className="px-5 py-2 rounded-[8px] bg-[#c82a2a] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a52222] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#c82a2a]/20"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>COMPARING HISTORICAL PATTERNS...</span>
                </>
              ) : (
                <>
                  <span>SEARCH SIMILAR HISTORICAL CASES</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS LIST SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
              RANKED HISTORICAL MATCHES
            </h2>
            {matches && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#cea03d]/15 text-[#cea03d] border border-[#cea03d]/30">
                {matches.length} PATTERN CORRELATIONS FOUND
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-[#A1A1AA] hidden sm:inline-block">
            SORTED BY COSINE SIMILARITY SCORE
          </span>
        </div>

        {loading ? (
          /* SKELETON LOADING STATE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4 animate-pulse"
              >
                <div className="h-5 bg-[#27272A] rounded w-2/3"></div>
                <div className="h-10 bg-[#27272A] rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-[#27272A] rounded w-full"></div>
                  <div className="h-3 bg-[#27272A] rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : matches === null ? (
          /* EMPTY STATE BEFORE FIRST SEARCH */
          <div className="p-12 rounded-[16px] bg-[#191C21] border border-dashed border-[#27272A] flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#050201] border border-[#27272A] flex items-center justify-center text-[#A1A1AA]">
              <Dna className="w-6 h-6 text-[#c82a2a]" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                CRIME DNA ENGINE IDLE
              </h3>
              <p className="text-xs text-[#A1A1AA] font-sans">
                Enter an incident narrative above or click one of the sample presets to analyze historical Modus Operandi (MO) signatures.
              </p>
            </div>
          </div>
        ) : matches.length === 0 ? (
          <div className="p-8 rounded-[16px] bg-[#191C21] border border-[#27272A] text-center font-mono text-xs text-[#A1A1AA]">
            NO CORRELATED MODUS OPERANDI SIGNATURES LOCATED
          </div>
        ) : (
          /* MATCHED CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => {
              const similarityPct = Math.round(match.similarity * 100);
              const isHighSimilarity = similarityPct >= 85;

              return (
                <div
                  key={match.fir_id}
                  className={`p-6 rounded-[16px] bg-[#191C21] border transition-all duration-200 flex flex-col justify-between space-y-4 hover:-translate-y-1 ${
                    isHighSimilarity
                      ? 'border-[#cea03d]/60 shadow-lg shadow-[#cea03d]/5 hover:border-[#cea03d]'
                      : 'border-[#27272A] hover:border-[#3F3F46]'
                  }`}
                >
                  <div>
                    {/* Header: FIR ID + Similarity % */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#27272A]/70">
                      <div>
                        <span className="font-mono text-sm font-bold text-white block">
                          {match.fir_id}
                        </span>
                        <span className="text-[10px] font-mono text-[#A1A1AA] block mt-0.5">
                          {match.date || 'Historical Archive'}
                        </span>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-2xl sm:text-3xl font-bold font-mono leading-none ${
                            isHighSimilarity ? 'text-[#cea03d]' : 'text-white'
                          }`}
                        >
                          {similarityPct}%
                        </div>
                        <span className="text-[9px] font-mono text-[#A1A1AA] uppercase">
                          MATCH SCORE
                        </span>
                      </div>
                    </div>

                    {/* Meta: District & Crime Type & Time */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                      <div className="p-2 rounded-[6px] bg-[#14161a] border border-[#27272A]/50">
                        <span className="font-mono text-[9px] text-[#A1A1AA] uppercase block">
                          DISTRICT
                        </span>
                        <span className="font-mono font-semibold text-white mt-0.5 block">
                          {match.district}
                        </span>
                      </div>
                      <div className="p-2 rounded-[6px] bg-[#14161a] border border-[#27272A]/50">
                        <span className="font-mono text-[9px] text-[#A1A1AA] uppercase block">
                          TEMPORAL
                        </span>
                        <span className="font-mono text-white text-[11px] mt-0.5 block truncate">
                          {match.time}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-[#D4D4D8] font-sans font-medium mb-3">
                      {match.crime_type}
                    </div>

                    {/* Matched Characteristics Checklist */}
                    <div className="space-y-2 pt-2 border-t border-[#27272A]/60">
                      <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider block">
                        MATCHED MO CHARACTERISTICS:
                      </span>
                      <ul className="space-y-1.5">
                        {match.matched_characteristics.map((char, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-[#D4D4D8] font-sans"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer snippet */}
                  {match.snippet && (
                    <div className="pt-3 border-t border-[#27272A]/60 text-[11px] text-[#A1A1AA] italic font-sans line-clamp-2">
                      &quot;{match.snippet}&quot;
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
