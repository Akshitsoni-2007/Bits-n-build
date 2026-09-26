'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Gauge,
  Dna,
  MessageSquareCode,
  ShieldCheck,
  Cpu,
  Radio,
  Terminal,
  Clock,
  Menu,
  X,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import GuardrailDisclaimer from './GuardrailDisclaimer';

interface NavItem {
  name: string;
  shortLabel: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'COMMAND CENTER',
    shortLabel: 'INTEL / OVERVIEW',
    href: '/command-center',
    icon: LayoutDashboard,
    tag: '01',
  },
  {
    name: 'RISK PREDICTOR',
    shortLabel: 'SHAP & PROBABILITY',
    href: '/risk-predictor',
    icon: Gauge,
    tag: '02',
  },
  {
    name: 'CRIME DNA MATCHER',
    shortLabel: 'MO PATTERN RECOG',
    href: '/crime-dna',
    icon: Dna,
    tag: '03',
  },
  {
    name: 'NL QUERY CONSOLE',
    shortLabel: 'STRUCTURED QUERY',
    href: '/nl-query',
    icon: MessageSquareCode,
    tag: '04',
  },
  {
    name: 'DECISION SUPPORT',
    shortLabel: 'TACTICAL PATTERNS',
    href: '/decision-support',
    icon: ShieldCheck,
    tag: '05',
  },
  {
    name: 'DECISION SIMULATOR',
    shortLabel: 'RESOURCE ALLOCATION',
    href: '/decision-simulator',
    icon: Cpu,
    tag: '06',
  },
];

export default function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine current active page title
  const activeNav = NAV_ITEMS.find((item) => {
    if (item.href === '/command-center' && (pathname === '/' || pathname === '/command-center')) {
      return true;
    }
    return pathname.startsWith(item.href);
  }) || NAV_ITEMS[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050201] text-white font-sans tactical-grid-bg">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-[#27272A] bg-[#050201]/95 backdrop-blur-md z-30 shrink-0 select-none">
        <div>
          {/* Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-gradient-to-br from-[#c82a2a] to-[#7f1717] flex items-center justify-center shadow-lg shadow-[#c82a2a]/20 border border-[#c82a2a]/50">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tight text-white font-sans text-base">
                    NIRIKSHAN
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#c82a2a]/20 text-[#c82a2a] border border-[#c82a2a]/30">
                    OPS
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider block">
                  ANALYTICS & DECISION CONSOLE
                </span>
              </div>
            </div>
          </div>

          {/* System Telemetry Tag */}
          <div className="px-6 py-3 border-b border-[#27272A]/70 bg-[#191C21]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cea03d] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cea03d]"></span>
              </span>
              <span className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
                NODE: PRIMARY
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#cea03d] bg-[#cea03d]/10 px-2 py-0.5 rounded border border-[#cea03d]/20">
              RESTRICTED
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-mono font-semibold text-[#A1A1AA]/60 uppercase tracking-widest">
              CONSOLE MODULES
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/command-center'
                  ? pathname === '/' || pathname === '/command-center'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-[8px] text-xs font-mono transition-all duration-150 ${
                    isActive
                      ? 'bg-[#191C21] text-white border border-[#c82a2a]/40 shadow-sm shadow-[#c82a2a]/10'
                      : 'text-[#A1A1AA] hover:bg-[#191C21]/60 hover:text-white border border-transparent'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#c82a2a] rounded-r" />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#c82a2a]' : 'text-[#A1A1AA] group-hover:text-white'
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold uppercase tracking-wider text-[11px]">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-[#A1A1AA]/70 font-sans tracking-normal font-normal">
                        {item.shortLabel}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-medium ${
                      isActive ? 'text-[#cea03d]' : 'text-[#A1A1AA]/40 group-hover:text-[#A1A1AA]'
                    }`}
                  >
                    [{item.tag}]
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#27272A] bg-[#050201]/90 space-y-3">
          <div className="p-3 rounded-[10px] bg-[#191C21] border border-[#27272A] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#A1A1AA] uppercase">
                FIR REPOSITORY
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                SYNCED
              </span>
            </div>
            <div className="text-[11px] font-mono text-white font-semibold">
              65 HISTORICAL INCIDENTS
            </div>
            <div className="text-[9px] text-[#A1A1AA] font-sans">
              Aggregated spatial-temporal baseline index
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#A1A1AA] px-1">
            <span>DISPATCH: GRID-1</span>
            <span className="text-[#cea03d]">v2.4.0</span>
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 bg-[#050201] h-full border-r border-[#27272A] flex flex-col justify-between p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#c82a2a]" />
                  <span className="font-bold text-white font-mono text-sm">NIRIKSHAN</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded bg-[#191C21] text-[#A1A1AA] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === '/command-center'
                      ? pathname === '/' || pathname === '/command-center'
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-[8px] font-mono text-xs ${
                        isActive
                          ? 'bg-[#191C21] text-white border border-[#c82a2a]/40'
                          : 'text-[#A1A1AA] hover:bg-[#191C21]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#c82a2a]' : 'text-[#A1A1AA]'}`} />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[10px] text-[#cea03d]">[{item.tag}]</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#27272A]">
              <GuardrailDisclaimer variant="subtle" />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP STATUS BAR */}
        <header className="h-14 border-b border-[#27272A] bg-[#050201]/95 px-4 lg:px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-[8px] bg-[#191C21] border border-[#27272A] text-white"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#c82a2a] font-bold tracking-wider uppercase hidden sm:inline-block">
                SYS.MODULE //
              </span>
              <h1 className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase text-white flex items-center gap-2">
                {activeNav.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#191C21] border border-[#27272A] text-[11px] font-mono text-[#A1A1AA]">
              <Clock className="w-3.5 h-3.5 text-[#cea03d]" />
              <span className="text-white font-medium">{currentTime || '00:00:00 IST'}</span>
            </div>

            {/* Guardrail badge on top right */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#191C21]/60 border border-[#27272A] text-[11px] font-mono text-[#A1A1AA]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                GUARDRAILS ACTIVE
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER (Scrollable) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 subtle-radar-glow">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
