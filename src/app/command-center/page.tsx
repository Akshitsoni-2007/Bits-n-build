'use client';

import React, { useState, useEffect } from 'react';
import { getIncidentsSummary, getIncidents } from '@/lib/api';
import { SummaryData, Incident } from '@/lib/types';
import { DISTRICTS, DISTRICT_NAMES } from '@/lib/constants';
import { CRIME_TYPES } from '@/lib/constants';
import StatCard from '@/components/StatCard';
import GuardrailDisclaimer from '@/components/GuardrailDisclaimer';
import DistrictChart from '@/components/charts/DistrictChart';
import CrimeTypeChart from '@/components/charts/CrimeTypeChart';
import TimeOfDayChart from '@/components/charts/TimeOfDayChart';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import IncidentMap from '@/components/IncidentMap';
import IncidentTable from '@/components/IncidentTable';
import {
  Filter,
  RefreshCw,
  Layers,
  AlertTriangle,
  Moon,
  CalendarCheck,
  Shield,
  Radio,
  Clock,
  Sparkles,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export default function CommandCenterPage() {
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [crimeTypeFilter, setCrimeTypeFilter] = useState<string>('');
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [allMapIncidents, setAllMapIncidents] = useState<Incident[]>([]);
  const [tableTotal, setTableTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sumData = await getIncidentsSummary({
        district: districtFilter || undefined,
        crime_type: crimeTypeFilter || undefined,
      });
      setSummary(sumData);

      // Fetch paginated incidents for table
      const incData = await getIncidents({
        district: districtFilter || undefined,
        crime_type: crimeTypeFilter || undefined,
        page,
        page_size: pageSize,
      });
      setIncidents(incData.results);
      setTableTotal(incData.total);

      // Fetch full set for spatial map
      const allData = await getIncidents({
        district: districtFilter || undefined,
        crime_type: crimeTypeFilter || undefined,
        page: 1,
        page_size: 100,
      });
      setAllMapIncidents(allData.results);
    } catch (err) {
      console.error('Error fetching command center data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [districtFilter, crimeTypeFilter, page]);

  // Compute top district and top crime type
  const topDistrict =
    summary?.by_district && summary.by_district.length > 0
      ? [...summary.by_district].sort((a, b) => b.count - a.count)[0]
      : null;

  const topCrimeType =
    summary?.by_crime_type && summary.by_crime_type.length > 0
      ? [...summary.by_crime_type].sort((a, b) => b.count - a.count)[0]
      : null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & Guardrail */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#c82a2a] uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>METROPOLITAN DISPATCH TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Operations & Incident Intelligence
          </h1>
        </div>
        <GuardrailDisclaimer variant="subtle" />
      </div>

      {/* FILTER BAR */}
      <div className="p-4 rounded-[16px] bg-[#191C21] border border-[#27272A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1AA]">
            <Filter className="w-3.5 h-3.5 text-[#cea03d]" />
            <span className="uppercase font-semibold">QUERY SCOPE:</span>
          </div>

          {/* District Dropdown */}
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs font-mono text-white focus:outline-none focus:border-[#c82a2a] transition-colors"
          >
            <option value="">ALL DISTRICTS (METRO GRID)</option>
            {DISTRICT_NAMES.map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()} SECTOR
              </option>
            ))}
          </select>

          {/* Crime Type Dropdown */}
          <select
            value={crimeTypeFilter}
            onChange={(e) => {
              setCrimeTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs font-mono text-white focus:outline-none focus:border-[#c82a2a] transition-colors"
          >
            <option value="">ALL CRIME CLASSIFICATIONS</option>
            {CRIME_TYPES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>

          {(districtFilter || crimeTypeFilter) && (
            <button
              onClick={() => {
                setDistrictFilter('');
                setCrimeTypeFilter('');
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-[8px] bg-[#27272A] text-[11px] font-mono text-[#A1A1AA] hover:text-white hover:bg-[#3F3F46] transition-colors"
            >
              RESET FILTERS
            </button>
          )}
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#050201] border border-[#27272A] text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-[#cea03d] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#cea03d] ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH METRICS</span>
        </button>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL REGISTERED INCIDENTS"
          value={summary?.total_incidents ?? '--'}
          isPrimary={true}
          tag="PRIMARY DATASET"
          subLabel="Aggregated historical FIR base"
          trend={{ value: 'Active Baseline', isPositive: false }}
          icon={Shield}
        />

        <StatCard
          label="TOP INCIDENT DISTRICT"
          value={topDistrict ? topDistrict.district : '--'}
          subValue={topDistrict ? `(${topDistrict.count} cases)` : ''}
          tag="HIGHEST DENSITY"
          subLabel="Relative spatial concentration"
          trend={{
            value: topDistrict ? `${Math.round((topDistrict.count / (summary?.total_incidents || 1)) * 100)}% share` : '',
            isPositive: true,
          }}
          icon={MapPin}
        />

        <StatCard
          label="PREDOMINANT MODALITY"
          value={topCrimeType ? topCrimeType.crime_type.split('/')[0].trim() : '--'}
          subValue={topCrimeType ? `(${topCrimeType.count})` : ''}
          tag="TOP VOLUME"
          subLabel="Leading historical categorization"
          trend={{
            value: topCrimeType ? `${Math.round((topCrimeType.count / (summary?.total_incidents || 1)) * 100)}% volume` : '',
            isPositive: true,
          }}
          icon={TrendingUp}
        />

        {/* WEEKEND & NIGHT-TIME PATTERN INDICATORS */}
        <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
              TEMPORAL SURGE INDEX
            </span>
            <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-[#c82a2a]/15 text-[#c82a2a] border border-[#c82a2a]/30">
              CLUSTER
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            <div className="p-2.5 rounded-[10px] bg-[#14161a] border border-[#27272A]/70">
              <div className="flex items-center gap-1.5 text-[#cea03d] mb-1">
                <Moon className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase font-semibold">NIGHT RATIO</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {summary ? `${summary.night_pct}%` : '--'}
              </div>
              <span className="text-[9px] text-[#A1A1AA]">20:00–05:00 hrs</span>
            </div>

            <div className="p-2.5 rounded-[10px] bg-[#14161a] border border-[#27272A]/70">
              <div className="flex items-center gap-1.5 text-[#c82a2a] mb-1">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase font-semibold">WEEKENDS</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {summary ? `${summary.weekend_pct}%` : '--'}
              </div>
              <span className="text-[9px] text-[#A1A1AA]">Fri–Sun shifts</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#A1A1AA]/80 flex items-center justify-between pt-1 border-t border-[#27272A]/50">
            <span>SHIFT VARIATION MODEL</span>
            <span className="text-emerald-400">SIGNIFICANT</span>
          </div>
        </div>
      </div>

      {/* GEOGRAPHIC MAP (Leaflet with clustered incident locations) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase text-white tracking-wider">
              GEOSPATIAL INCIDENT CLUSTER MAP
            </span>
            <span className="text-[10px] font-mono text-[#cea03d] bg-[#cea03d]/10 px-2 py-0.5 rounded border border-[#cea03d]/20">
              INTERACTIVE GIS
            </span>
          </div>
          <span className="text-xs text-[#A1A1AA] font-mono hidden sm:inline-block">
            CLICK ON PINS FOR INCIDENT TELEMETRY
          </span>
        </div>
        <IncidentMap
          incidents={allMapIncidents}
          selectedDistrict={districtFilter}
          selectedCrime={crimeTypeFilter}
        />
      </div>

      {/* 4 RECHARTS ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Distribution */}
        <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                DISTRICT-WISE INCIDENT VOLUME
              </h3>
              <p className="text-xs text-[#A1A1AA] font-sans">
                Comparative historical density across administrative zones
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#cea03d]">BAR CHART</span>
          </div>
          {summary?.by_district ? (
            <DistrictChart
              data={summary.by_district}
              selectedDistrict={districtFilter}
              onSelectDistrict={(d) => setDistrictFilter(d === districtFilter ? '' : d)}
            />
          ) : (
            <div className="h-72 flex items-center justify-center font-mono text-xs text-[#A1A1AA]">
              LOADING METRICS...
            </div>
          )}
        </div>

        {/* Crime Type Distribution */}
        <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                CRIME CLASSIFICATION BREAKDOWN
              </h3>
              <p className="text-xs text-[#A1A1AA] font-sans">
                Distribution by offense categorization & Modus Operandi
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#c82a2a]">DONUT RATIO</span>
          </div>
          {summary?.by_crime_type ? (
            <CrimeTypeChart
              data={summary.by_crime_type}
              selectedCrime={crimeTypeFilter}
              onSelectCrime={(c) => setCrimeTypeFilter(c === crimeTypeFilter ? '' : c)}
            />
          ) : (
            <div className="h-72 flex items-center justify-center font-mono text-xs text-[#A1A1AA]">
              LOADING METRICS...
            </div>
          )}
        </div>

        {/* Time of Day Analysis */}
        <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                TIME-OF-DAY 24-HOUR DENSITY
              </h3>
              <p className="text-xs text-[#A1A1AA] font-sans">
                Diurnal vs nocturnal peak distribution curve (00:00 – 23:00 hrs)
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#c82a2a]">TEMPORAL DENSITY</span>
          </div>
          {summary?.by_hour ? (
            <TimeOfDayChart data={summary.by_hour} />
          ) : (
            <div className="h-72 flex items-center justify-center font-mono text-xs text-[#A1A1AA]">
              LOADING METRICS...
            </div>
          )}
        </div>

        {/* Monthly Trend Chart */}
        <div className="p-6 rounded-[16px] bg-[#191C21] border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                ANNUAL MONTHLY TRAJECTORY
              </h3>
              <p className="text-xs text-[#A1A1AA] font-sans">
                Aggregated seasonal fluctuations (Jan – Dec historical baseline)
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#cea03d]">TREND LINE</span>
          </div>
          {summary?.by_month ? (
            <MonthlyTrendChart data={summary.by_month} />
          ) : (
            <div className="h-72 flex items-center justify-center font-mono text-xs text-[#A1A1AA]">
              LOADING METRICS...
            </div>
          )}
        </div>
      </div>

      {/* HISTORICAL INCIDENT TABLE BELOW THE FOLD */}
      <div className="space-y-3">
        <IncidentTable
          incidents={incidents}
          total={tableTotal}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
