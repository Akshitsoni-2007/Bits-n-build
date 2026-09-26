'use client';

import React, { useState } from 'react';
import { Incident } from '@/lib/types';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
  Shield,
  Clock,
  MapPin,
  Calendar,
  X,
  FileText,
  Activity,
} from 'lucide-react';

interface IncidentTableProps {
  incidents: Incident[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export default function IncidentTable({
  incidents,
  total,
  page,
  pageSize,
  onPageChange,
  isLoading = false,
}: IncidentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Incident>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Client-side search filtering
  const filtered = incidents.filter((inc) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      inc.fir_id.toLowerCase().includes(term) ||
      inc.district.toLowerCase().includes(term) ||
      inc.crime_type.toLowerCase().includes(term) ||
      inc.description.toLowerCase().includes(term) ||
      (inc.location_name && inc.location_name.toLowerCase().includes(term))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(total / pageSize) || 1;

  const handleSort = (field: keyof Incident) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="rounded-[16px] border border-[#27272A] bg-[#191C21] overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
              HISTORICAL INCIDENT REGISTER
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#27272A] text-[#A1A1AA]">
              {total} TOTAL ENTRIES
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] font-sans mt-0.5">
            Audit-ready log of registered First Information Reports with spatial coordinates
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FIR, keywords, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs text-white placeholder-[#A1A1AA]/60 focus:outline-none focus:border-[#c82a2a] transition-colors"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#14161a] border-b border-[#27272A] text-[#A1A1AA] font-mono text-[11px] uppercase tracking-wider">
            <tr>
              <th
                onClick={() => handleSort('fir_id')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                FIR ID / REF
              </th>
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                DATE & TIME
              </th>
              <th
                onClick={() => handleSort('district')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                DISTRICT
              </th>
              <th
                onClick={() => handleSort('crime_type')}
                className="py-3 px-4 cursor-pointer hover:text-white"
              >
                CLASSIFICATION
              </th>
              <th className="py-3 px-4">COORDINATES</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]/60">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td colSpan={7} className="py-4 px-4">
                    <div className="h-4 bg-[#27272A]/60 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#A1A1AA] font-mono">
                  NO HISTORICAL RECORDS MATCH CRITERIA
                </td>
              </tr>
            ) : (
              sorted.map((inc) => (
                <tr
                  key={inc.fir_id}
                  onClick={() => setSelectedIncident(inc)}
                  className="hover:bg-[#22262c] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#cea03d]">
                    {inc.fir_id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-sans">{inc.date}</div>
                    <div className="font-mono text-[10px] text-[#A1A1AA]">
                      {inc.hour.toString().padStart(2, '0')}:00 hrs ({inc.day_of_week})
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#050201] border border-[#27272A] text-white">
                      {inc.district}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-white font-sans font-medium">
                    {inc.crime_type}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#A1A1AA]">
                    [{inc.latitude.toFixed(3)}, {inc.longitude.toFixed(3)}]
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold tracking-wider uppercase border ${
                        inc.status === 'UNDER INVESTIGATION'
                          ? 'bg-[#c82a2a]/15 text-[#c82a2a] border-[#c82a2a]/30'
                          : inc.status === 'CLOSED'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#cea03d]/15 text-[#cea03d] border-[#cea03d]/30'
                      }`}
                    >
                      {inc.status || 'LOGGED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(inc);
                      }}
                      className="p-1.5 rounded-[6px] bg-[#050201] text-[#A1A1AA] hover:text-white hover:border-[#c82a2a] border border-[#27272A] transition-colors inline-flex items-center gap-1 font-mono text-[10px]"
                    >
                      <Eye className="w-3 h-3 text-[#cea03d]" />
                      <span>INSPECT</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#27272A] bg-[#14161a] flex items-center justify-between">
        <div className="text-xs font-mono text-[#A1A1AA]">
          SHOWING PAGE <span className="text-white font-bold">{page}</span> OF{' '}
          <span className="text-white font-bold">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || isLoading}
            className="p-1.5 rounded-[6px] bg-[#050201] border border-[#27272A] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#191C21] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs px-2 text-[#cea03d]">{page}</span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || isLoading}
            className="p-1.5 rounded-[6px] bg-[#050201] border border-[#27272A] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#191C21] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal / Drawer */}
      {selectedIncident && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedIncident(null)}
        >
          <div
            className="w-full max-w-xl rounded-[16px] bg-[#191C21] border border-[#27272A] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c82a2a]" />
                <span className="font-mono text-sm font-bold text-[#cea03d]">
                  {selectedIncident.fir_id}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#27272A] text-[#A1A1AA]">
                  AUDIT RECORD
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-[6px] bg-[#050201] text-[#A1A1AA] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-[8px] bg-[#14161a] border border-[#27272A]/70">
                <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block">
                  DISTRICT / SECTOR
                </span>
                <span className="font-semibold text-white mt-1 block">
                  {selectedIncident.district}
                </span>
                <span className="text-[11px] text-[#A1A1AA]">
                  {selectedIncident.location_name || 'Grid Sector Central'}
                </span>
              </div>

              <div className="p-3 rounded-[8px] bg-[#14161a] border border-[#27272A]/70">
                <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block">
                  CRIME CATEGORY
                </span>
                <span className="font-semibold text-white mt-1 block">
                  {selectedIncident.crime_type}
                </span>
                <span className="text-[11px] text-[#A1A1AA]">
                  Priority: {selectedIncident.priority || 'MEDIUM'}
                </span>
              </div>

              <div className="p-3 rounded-[8px] bg-[#14161a] border border-[#27272A]/70">
                <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block">
                  TIMESTAMP & CYCLE
                </span>
                <span className="font-mono text-white mt-1 block">
                  {selectedIncident.date} @ {selectedIncident.hour}:00 hrs
                </span>
                <span className="text-[11px] text-[#A1A1AA]">
                  {selectedIncident.day_of_week} ({selectedIncident.is_weekend ? 'Weekend Surge' : 'Weekday Shift'})
                </span>
              </div>

              <div className="p-3 rounded-[8px] bg-[#14161a] border border-[#27272A]/70">
                <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block">
                  GEO-COORDINATES
                </span>
                <span className="font-mono text-white mt-1 block">
                  {selectedIncident.latitude.toFixed(4)} N, {selectedIncident.longitude.toFixed(4)} E
                </span>
                <span className="text-[11px] text-[#A1A1AA]">Metropolitan GIS Grid</span>
              </div>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#14161a] border border-[#27272A] space-y-1.5">
              <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider block">
                NARRATIVE / MODUS OPERANDI SUMMARY
              </span>
              <p className="text-xs text-[#D4D4D8] leading-relaxed font-sans">
                {selectedIncident.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#27272A] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#A1A1AA]">
                STATUS: <span className="text-white font-bold">{selectedIncident.status}</span>
              </span>
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-1.5 rounded-[8px] bg-[#c82a2a] text-white font-mono text-xs hover:bg-[#a52222] transition-colors"
              >
                CLOSE INSPECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Eye({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
