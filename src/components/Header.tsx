import React from 'react';
import { Activity, Cpu, ShieldCheck, Radio, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: 'console' | 'architecture' | 'code';
  setActiveTab: (tab: 'console' | 'architecture' | 'code') => void;
  pendingSyncCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingSyncCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo and System Identification */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
              <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-lg font-bold tracking-tight text-white">
                  ICE-Sense<span className="text-cyan-400 font-normal">::Edge</span>
                </span>
                <span className="px-2 py-0.5 text-[11px] font-mono tracking-wide uppercase rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  MVP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Isolated, Confined & Extreme Environments • Multimodal Psychological Telemetry
              </p>
            </div>
          </div>

          {/* Edge Node Hardware & Network Status Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EDGE-01: ONLINE</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>ARM64 4-CORE</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>CLOUD DISCONNECTED (EDGE-FIRST)</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>SPOOL: {pendingSyncCount}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-t border-slate-800/70 pt-2 pb-2">
          <button
            id="tab-console-btn"
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'console'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Mission Telemetry & AI Inference</span>
          </button>

          <button
            id="tab-architecture-btn"
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'architecture'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>System Architecture & Data Flow</span>
          </button>

          <button
            id="tab-code-btn"
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'code'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>FastAPI & Docker Blueprint</span>
          </button>
        </div>
      </div>
    </header>
  );
};
