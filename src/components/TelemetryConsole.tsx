import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Mic,
  Sliders,
  Send,
  Sparkles,
  AlertOctagon,
  Clock,
  Gauge,
  Layers,
  CheckCircle,
  FileText,
  Radio,
  Zap,
} from 'lucide-react';
import { CREW_MEMBERS, SCENARIO_PRESETS } from '../data/scenarios';
import { runEdgeInference } from '../utils/inferenceEngine';
import { AssessmentResult, RiskLevel } from '../types/icesense';
import { MitigationPanel } from './MitigationPanel';
import { ResonanceBreathingModal } from './ResonanceBreathingModal';

interface TelemetryConsoleProps {
  onAssessmentCompleted: (result: AssessmentResult) => void;
}

export const TelemetryConsole: React.FC<TelemetryConsoleProps> = ({
  onAssessmentCompleted,
}) => {
  const [selectedCrewId, setSelectedCrewId] = useState<string>(CREW_MEMBERS[0].id);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('eva-crisis');

  // Interactive vitals state
  const [heartRate, setHeartRate] = useState<number>(118);
  const [rmssd, setRmssd] = useState<number>(14.2);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(26);
  const [gsr, setGsr] = useState<number>(8.9);
  const [sqi, setSqi] = useState<number>(0.96);

  // Multimodal text transcript
  const [transcript, setTranscript] = useState<string>(
    SCENARIO_PRESETS[0].transcript
  );
  const [speechWpm, setSpeechWpm] = useState<number>(198);

  // Result state
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);

  // Load initial preset
  useEffect(() => {
    handleSelectScenario('eva-crisis');
  }, []);

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    const preset = SCENARIO_PRESETS.find((s) => s.id === scenarioId);
    if (!preset) return;

    setSelectedCrewId(preset.crewId);
    setHeartRate(preset.vitals.heartRateBpm);
    setRmssd(preset.vitals.hrv.rmssd);
    setRespiratoryRate(preset.vitals.respiratoryRateBpm);
    setGsr(preset.vitals.galvanicSkinResponseUs);
    setSqi(preset.vitals.signalQualityIndex);
    setTranscript(preset.transcript);
    setSpeechWpm(preset.speechWpm);

    // Auto-run inference for selected scenario
    const vitalsObj = {
      timestamp: new Date().toISOString(),
      heartRateBpm: preset.vitals.heartRateBpm,
      hrv: preset.vitals.hrv,
      respiratoryRateBpm: preset.vitals.respiratoryRateBpm,
      galvanicSkinResponseUs: preset.vitals.galvanicSkinResponseUs,
      skinTempCelsius: preset.vitals.skinTempCelsius,
      signalQualityIndex: preset.vitals.signalQualityIndex,
    };
    const res = runEdgeInference(preset.crewId, vitalsObj, preset.transcript, preset.speechWpm);
    setAssessment(res);
    onAssessmentCompleted(res);
  };

  const handleRunInference = () => {
    setIsEvaluating(true);

    setTimeout(() => {
      const vitalsObj = {
        timestamp: new Date().toISOString(),
        heartRateBpm: heartRate,
        hrv: {
          rmssd: rmssd,
          sdnn: rmssd * 1.4,
          lf_hf_ratio: rmssd < 25 ? 4.2 : 1.2,
        },
        respiratoryRateBpm: respiratoryRate,
        galvanicSkinResponseUs: gsr,
        skinTempCelsius: 34.6,
        signalQualityIndex: sqi,
      };

      const result = runEdgeInference(selectedCrewId, vitalsObj, transcript, speechWpm);
      setAssessment(result);
      onAssessmentCompleted(result);
      setIsEvaluating(false);
    }, 80);
  };

  const currentCrew = CREW_MEMBERS.find((c) => c.id === selectedCrewId) || CREW_MEMBERS[0];

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'MISSION_CRITICAL':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-700 animate-pulse flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            MISSION CRITICAL STRAIN
          </span>
        );
      case 'ACUTE_STRAIN':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-950 text-orange-300 border border-orange-700 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-orange-400" />
            ACUTE STRAIN DETECTED
          </span>
        );
      case 'ELEVATED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            ELEVATED STRESS
          </span>
        );
      case 'NOMINAL':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            NOMINAL HOMEOSTASIS
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Scenario Presets */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Mission Simulation Presets
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Quick-load extreme mission conditions into edge pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SCENARIO_PRESETS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario.id)}
              className={`text-left p-3 rounded-lg border transition-all text-xs ${
                selectedScenarioId === scenario.id
                  ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-200 truncate">{scenario.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    scenario.category === 'Critical'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : scenario.category === 'Elevated'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {scenario.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {scenario.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Telemetry Feeds on Left, Multimodal Inference on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Wearable Vitals + Voice Log Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Crew Subject Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Monitored Crew Subject
              </span>
              <span className="text-xs font-mono text-cyan-400">
                UWB Body Area Network: Connected
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentCrew.avatar}</span>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{currentCrew.name}</h3>
                  <p className="text-xs text-slate-400">{currentCrew.role}</p>
                  <p className="text-[11px] font-mono text-cyan-400/80">{currentCrew.mission}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {CREW_MEMBERS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCrewId(c.id)}
                    className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                      selectedCrewId === c.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {c.id.split('-')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time-Series Biosensors (ECG/PPG HRV, HR, Respiration, GSR) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Time-Series Biosensor Ingest
                </h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Streaming 100 Hz
              </span>
            </div>

            {/* Biosensor Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Heart Rate */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    Heart Rate (BPM)
                  </span>
                  <span className="font-mono font-bold text-rose-300">{heartRate} bpm</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>40 Resting</span>
                  <span>Baseline: {currentCrew.baselineHr}</span>
                  <span>160 Max</span>
                </div>
              </div>

              {/* HRV RMSSD (Parasympathetic Tone) */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    HRV (RMSSD)
                  </span>
                  <span className="font-mono font-bold text-cyan-300">{rmssd} ms</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="100"
                  step="0.5"
                  value={rmssd}
                  onChange={(e) => setRmssd(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>&lt;20 Critical Strain</span>
                  <span>Norm: 45-75</span>
                  <span>100 Deep Rest</span>
                </div>
              </div>

              {/* Respiratory Rate */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-sky-400" />
                    Respiratory Rate
                  </span>
                  <span className="font-mono font-bold text-sky-300">
                    {respiratoryRate} bpm
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="36"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>8 Bradypnea</span>
                  <span>14 Normal</span>
                  <span>36 Hyperventilating</span>
                </div>
              </div>

              {/* Galvanic Skin Response (GSR) */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Galvanic Skin Response
                  </span>
                  <span className="font-mono font-bold text-amber-300">{gsr} µS</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="18"
                  step="0.1"
                  value={gsr}
                  onChange={(e) => setGsr(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>1.0 Basal</span>
                  <span>Sympathetic Arousal</span>
                  <span>18.0 Extreme Shock</span>
                </div>
              </div>
            </div>
          </div>

          {/* Multimodal Modality 2: Text Logs & Voice Transcripts */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Acoustic & Semantic Transcript Input
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Habitat Intercom / Daily Sol Log
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Spoken Log or Workstation Console Journal Entry:
              </label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Transcribed crew dialogue or keyboard journal entry..."
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 font-sans leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono">Speech Cadence:</span>
                <span className="font-mono text-cyan-300 font-semibold">{speechWpm} WPM</span>
                <span className="text-[10px] text-slate-500">
                  {speechWpm > 180 ? '(Pressured Speech)' : speechWpm < 90 ? '(Lethargic)' : '(Nominal)'}
                </span>
              </div>

              {/* Action Button */}
              <button
                id="run-inference-btn"
                onClick={handleRunInference}
                disabled={isEvaluating}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Running Edge ML...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Evaluate Edge Multimodal Telemetry</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Assessment Score, Breakdown & Mitigations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {assessment ? (
            <>
              {/* Psychological Stress Score Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white tracking-tight">
                      Psychological Stress Assessment
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Latency: {assessment.inferenceLatencyMs}ms (Edge Local)
                  </span>
                </div>

                {/* Score Gauge & Risk Badge */}
                <div className="flex flex-col items-center justify-center my-3">
                  <div className="relative flex items-center justify-center w-36 h-36">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#1e293b"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Stress Score Bar */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={
                          assessment.stressScore >= 80
                            ? '#ef4444'
                            : assessment.stressScore >= 60
                            ? '#f97316'
                            : assessment.stressScore >= 38
                            ? '#eab308'
                            : '#10b981'
                        }
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * assessment.stressScore) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-black font-mono text-white tracking-tight">
                        {assessment.stressScore}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                        Score / 100
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">{getRiskBadge(assessment.riskLevel)}</div>
                </div>

                {/* Multimodal Feature Breakdown */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="text-slate-400">Physiological Strain (HRV + Vitals):</span>
                      <span className="font-bold text-cyan-300">
                        {assessment.breakdown.physiologicalStrainIndex}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${assessment.breakdown.physiologicalStrainIndex}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="text-slate-400">Cognitive & Linguistic Load:</span>
                      <span className="font-bold text-purple-300">
                        {assessment.breakdown.cognitiveSentimentLoad}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${assessment.breakdown.cognitiveSentimentLoad}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span>Autonomic Dysregulation:</span>
                    <span className="text-amber-400 font-bold">
                      {assessment.breakdown.autonomicDysregulationFactor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Automated Mitigation Protocols Panel */}
              <MitigationPanel
                mitigations={assessment.mitigations}
                onOpenBreathingModal={() => setIsBreathingModalOpen(true)}
              />
            </>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
              <p className="text-xs font-mono">Select a scenario or click Evaluate to generate assessment</p>
            </div>
          )}
        </div>
      </div>

      {/* Guided Resonance Breathing Pacer Modal */}
      <ResonanceBreathingModal
        isOpen={isBreathingModalOpen}
        onClose={() => setIsBreathingModalOpen(false)}
      />
    </div>
  );
};
