import React from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface GuardrailDisclaimerProps {
  text?: string;
  variant?: 'subtle' | 'prominent' | 'banner';
  className?: string;
}

export default function GuardrailDisclaimer({
  text = 'Aggregated statistical indicator from historical FIR/incident data — not a certainty or guarantee of an event occurrence.',
  variant = 'subtle',
  className = '',
}: GuardrailDisclaimerProps) {
  if (variant === 'banner') {
    return (
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-[8px] bg-[#191C21] border border-[#27272A] text-[#A1A1AA] text-xs font-sans ${className}`}>
        <ShieldAlert className="w-4 h-4 text-[#cea03d] shrink-0" />
        <div className="flex-1">
          <span className="font-semibold text-white font-mono text-[11px] uppercase tracking-wider mr-2">
            [STATISTICAL GUARDRAIL]
          </span>
          {text}
        </div>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <div className={`p-3.5 rounded-[12px] bg-[#14161a] border border-[#c82a2a]/30 text-xs font-sans text-[#A1A1AA] flex items-start gap-3 shadow-inner ${className}`}>
        <AlertTriangle className="w-4 h-4 text-[#c82a2a] shrink-0 mt-0.5" />
        <div>
          <div className="font-mono text-[11px] text-[#c82a2a] uppercase font-bold tracking-wider mb-0.5">
            ANALYTICAL NOTICE — HISTORICAL PATTERN MODEL
          </div>
          <p className="leading-relaxed text-[#A1A1AA]">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#191C21]/90 border border-[#27272A] text-[11px] font-mono text-[#A1A1AA] ${className}`}>
      <Info className="w-3.5 h-3.5 text-[#cea03d] shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}
