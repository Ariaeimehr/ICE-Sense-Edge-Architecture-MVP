import React, { useState } from 'react';
import { Header } from './components/Header';
import { TelemetryConsole } from './components/TelemetryConsole';
import { ArchitectureBlueprint } from './components/ArchitectureBlueprint';
import { CodeExplorer } from './components/CodeExplorer';
import { AssessmentResult } from './types/icesense';

export default function App() {
  const [activeTab, setActiveTab] = useState<'console' | 'architecture' | 'code'>('console');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(42);
  const [recentAssessments, setRecentAssessments] = useState<AssessmentResult[]>([]);

  const handleAssessmentCompleted = (result: AssessmentResult) => {
    setPendingSyncCount((prev) => prev + 1);
    setRecentAssessments((prev) => [result, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Edge System Navigation & Status Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Main Mission View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'console' && (
          <TelemetryConsole onAssessmentCompleted={handleAssessmentCompleted} />
        )}

        {activeTab === 'architecture' && <ArchitectureBlueprint />}

        {activeTab === 'code' && <CodeExplorer />}
      </main>

      {/* Persistent Mission Footer Bar */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-8 mt-auto text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>ICE-Sense Autonomous Edge Telemetry System • Commercial MVP v1.0</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Local Inference: Active</span>
            <span>Cloud Dependency: None</span>
            <span>Zero-Trust Ring Buffer: Enabled</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
