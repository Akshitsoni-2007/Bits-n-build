'use client';

import React, { useState } from 'react';
import { queryNaturalLanguage, getIncidentsSummary } from '@/lib/api';
import { NLQueryResponse, SummaryData, Incident } from '@/lib/types';
import GuardrailDisclaimer from '@/components/GuardrailDisclaimer';
import DistrictChart from '@/components/charts/DistrictChart';
import CrimeTypeChart from '@/components/charts/CrimeTypeChart';
import TimeOfDayChart from '@/components/charts/TimeOfDayChart';
import IncidentTable from '@/components/IncidentTable';
import {
  MessageSquareCode,
  Send,
  Code2,
  Filter,
  Sparkles,
  Search,
  CheckCircle2,
  Terminal,
  Layers,
  ArrowRight,
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'Show night vehicle thefts in Cyber City',
  'Top cyber frauds on weekends across all districts',
  'Robbery and snatching incidents in North district during night shifts',
  'Burglary patterns in South sector during weekday early morning',
];

export default function NLQueryPage() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<NLQueryResponse | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  const [tablePage, setTablePage] = useState<number>(1);
  const pageSize = 5;

  const handleQuery = async (queryText?: string) => {
    const text = queryText || query;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await queryNaturalLanguage({ query: text });
      setResponse(res);

      // Also compute summary for charts
      const sum = await getIncidentsSummary({
        district: res.parsed_filters.district,
        crime_type: res.parsed_filters.crime_type,
      });
      setSummaryData(sum);
      setTablePage(1);
    } catch (err) {
      console.error('Error executing NL query:', err);
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
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>TRANSPARENT NATURAL LANGUAGE COMPILER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Natural Language Query Interface
          </h1>
        </div>
        <GuardrailDisclaimer
          text="Semantic queries compile into deterministic database filters without generative extrapolation."
          variant="subtle"
        />
      </div>

      {/* CHAT-STYLE QUERY INPUT */}
      <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4 shadow-xl">
        <div>
          <span className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
            ANALYST PROMPT INPUT
          </span>
          <p className="text-xs text-[#A1A1AA] font-sans mt-0.5">
            Query the historical FIR database using plain conversational English. The engine translates requests into verifiable SQL/JSON filter predicates.
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuery();
          }}
          className="relative flex items-center"
        >
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the data (e.g. 'Show night vehicle thefts in Cyber City')..."
            className="w-full pl-11 pr-32 py-3.5 rounded-[12px] bg-[#050201] border border-[#27272A] text-white text-xs font-mono placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#c82a2a] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 px-4 py-2 rounded-[8px] bg-[#c82a2a] text-white font-mono text-xs font-bold uppercase hover:bg-[#a52222] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>QUERY</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[10px] font-mono text-[#A1A1AA]">SUGGESTIONS:</span>
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleQuery(q);
              }}
              className="px-2.5 py-1 rounded-[6px] bg-[#050201] border border-[#27272A] text-[10px] font-mono text-[#A1A1AA] hover:text-[#cea03d] hover:border-[#cea03d] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* QUERY OUTPUT */}
      {response ? (
        <div className="space-y-6">
          {/* (a) STRUCTURED FILTER JSON TRANSPARENCY PANEL */}
          <div className="p-5 rounded-[16px] bg-[#14161a] border border-[#27272A] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#cea03d]" />
                <span className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                  DETERMINISTIC FILTER COMPILER OUTPUT (TRANSPARENCY AUDIT)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% REPRODUCIBLE
              </span>
            </div>

            <p className="text-xs text-[#A1A1AA] font-sans">
              To avoid hallucination or unconstrained model assumptions, your query has been mapped strictly to the following structured filter parameters:
            </p>

            <pre className="p-3.5 rounded-[8px] bg-[#050201] border border-[#27272A] font-mono text-[11px] text-[#cea03d] overflow-x-auto leading-relaxed">
              {JSON.stringify(
                {
                  input_query: query,
                  compiled_predicate_ast: response.parsed_filters,
                  matched_records: response.matched_count || response.results.length,
                  execution_timestamp: new Date().toISOString(),
                },
                null,
                2
              )}
            </pre>
          </div>

          {/* (b) RESULTING FILTERED CHARTS & INCIDENTS */}
          {summaryData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
                <h3 className="font-mono text-xs font-semibold uppercase text-white">
                  DISTRICT CONCENTRATION
                </h3>
                <DistrictChart data={summaryData.by_district} />
              </div>

              <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
                <h3 className="font-mono text-xs font-semibold uppercase text-white">
                  CLASSIFICATION RATIO
                </h3>
                <CrimeTypeChart data={summaryData.by_crime_type} />
              </div>

              <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
                <h3 className="font-mono text-xs font-semibold uppercase text-white">
                  24-HR TIME DISTRIBUTION
                </h3>
                <TimeOfDayChart data={summaryData.by_hour} />
              </div>
            </div>
          )}

          {/* Resulting Incident Records Table */}
          <div className="space-y-3">
            <IncidentTable
              incidents={response.results.slice((tablePage - 1) * pageSize, tablePage * pageSize)}
              total={response.results.length}
              page={tablePage}
              pageSize={pageSize}
              onPageChange={setTablePage}
              isLoading={loading}
            />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-[16px] bg-[#191C21] border border-dashed border-[#27272A] flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#050201] border border-[#27272A] flex items-center justify-center text-[#A1A1AA]">
            <Terminal className="w-6 h-6 text-[#cea03d]" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              QUERY ENGINE READY
            </h3>
            <p className="text-xs text-[#A1A1AA] font-sans">
              Enter any query above or click a suggestion chip to view deterministic JSON predicate translation and corresponding historical data views.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
