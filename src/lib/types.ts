export type District =
  | 'Bengaluru Urban'
  | 'Mysuru'
  | 'Mumbai'
  | 'Pune'
  | 'Delhi'
  | 'Hyderabad'
  | 'Chennai'
  | 'Kolkata';

export type CrimeType =
  | 'Cyber Fraud / Financial'
  | 'Vehicle Theft'
  | 'Burglary / Breaking-in'
  | 'Robbery / Snatching'
  | 'Assault / Grievous Hurt'
  | 'Narcotics / NDPS'
  | 'Public Nuisance & Gambling';

export type RiskClassification = 'LOW' | 'MODERATE' | 'MODERATE-HIGH' | 'HIGH';

export interface Incident {
  fir_id: string;
  date: string;
  district: District | string;
  crime_type: CrimeType | string;
  hour: number;
  day_of_week: string;
  is_weekend: boolean;
  latitude: number;
  longitude: number;
  description: string;
  location_name?: string;
  status?: 'CLOSED' | 'UNDER INVESTIGATION' | 'PENDING CHARGE' | 'COURT TRIAL';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SummaryData {
  total_incidents: number;
  by_district: { district: string; count: number }[];
  by_crime_type: { crime_type: string; count: number }[];
  by_hour: { hour: number; count: number }[];
  by_month: { month: string; count: number }[];
  weekend_pct: number;
  night_pct: number;
}

export interface IncidentsResponse {
  results: Incident[];
  total: number;
  page: number;
  page_size: number;
}

export interface PredictRiskRequest {
  district: string;
  crime_type: string;
  month: string;
  hour: number;
  is_weekend: boolean;
}

export interface ContributingFactor {
  factor: string;
  pct_contribution: number;
  direction?: 'positive' | 'negative';
  description?: string;
}

export interface PredictRiskResponse {
  risk_score: number; // 0-100
  classification: RiskClassification;
  contributing_factors: ContributingFactor[];
  confidence_interval?: string;
  baseline_comparison?: string;
}

export interface DNAMatch {
  fir_id: string;
  similarity: number; // 0-1
  district: string;
  crime_type: string;
  time: string;
  matched_characteristics: string[];
  snippet?: string;
  date?: string;
}

export interface DNAMatcherResponse {
  matches: DNAMatch[];
}

export interface NLQueryRequest {
  query: string;
}

export interface ParsedFilters {
  district?: string;
  crime_type?: string;
  day_type?: 'weekend' | 'weekday' | string;
  hour_min?: number;
  hour_max?: number;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night' | string;
  keyword?: string;
}

export interface NLQueryResponse {
  parsed_filters: ParsedFilters;
  results: Incident[];
  interpretation_summary?: string;
  matched_count?: number;
}

export interface EvidenceItem {
  label: string;
  value: string;
  benchmark?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface DecisionSupportResponse {
  pattern: string;
  recommendation: string;
  evidence: EvidenceItem[];
  temporal_hotspot?: string;
  spatial_focus?: string;
  resource_gap?: string;
}

export interface SimulatorRequest {
  current_allocation: number;
  scenario: string;
  focus_district?: string;
  shift_focus?: string;
}

export interface SimulatorResponse {
  estimated_coverage_change_pct: number;
  estimated_response_time_delta_min?: number;
  hotspot_coverage_ratio?: number;
  operational_impact_notes?: string[];
}
