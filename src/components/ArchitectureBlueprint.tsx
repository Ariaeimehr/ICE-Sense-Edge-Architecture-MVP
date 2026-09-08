import React from 'react';
import {
  Layers,
  Cpu,
  Radio,
  HardDrive,
  Shield,
  Zap,
  FolderTree,
  Server,
  ArrowRight,
  Database,
  Lock,
  WifiOff,
} from 'lucide-react';

export const ArchitectureBlueprint: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Executive Edge-First Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Edge-First Architecture: 100% Offline Resilience
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Designed for Speed-of-Light Time Delays & Extreme Subsurface Isolation
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          In Isolated, Confined, and Extreme (ICE) operational theaters—such as a crewed Mars transit
          vehicle (3 to 22-minute one-way light delay to Earth), a submerged nuclear submarine under
          radio silence, or an Antarctic winter station during polar storms—relying on external cloud
          infrastructure for life-critical psychological monitoring is catastrophic.
          <br /><br />
          <strong className="text-cyan-300 font-medium">ICE-Sense</strong> executes all multimodal
          signal ingestion, acoustic linguistic feature extraction, and closed-loop mitigation logic
          entirely inside the local habitat perimeter. The edge server runs locally, maintaining
          continuous situational awareness with sub-25ms inference latency and zero reliance on
          terrestrial uplink.
        </p>

        {/* Core SLA Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block">Cloud Dependency</span>
            <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">0% (Pure Edge)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block">Inference Latency</span>
            <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">&lt; 25 ms (Local)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block">Memory Footprint</span>
            <span className="text-sm font-bold text-purple-400 font-mono mt-0.5 block">&lt; 250 MB RAM</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block">Security Baseline</span>
            <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">AES-256 + mTLS</span>
          </div>
        </div>
      </div>

      {/* 4-Tier Interactive End-to-End Data Flow */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-white tracking-tight uppercase font-mono text-cyan-400 mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          End-to-End Data Flow Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center mb-3 border border-cyan-500/40">
              1
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Wearables & Terminals
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Chest straps, smart rings & habitat microphones collect high-frequency ECG/PPG, RMSSD,
              GSR, and voice audio logs.
            </p>
            <div className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Transport: BLE 5.3 / UWB
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center mb-3 border border-cyan-500/40">
              2
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Local Edge Gateway
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Pre-processes biosignal streams, filters motion artifacts, packages multimodal payloads
              and authenticates via hardware keys.
            </p>
            <div className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Protocol: HTTPS / mTLS
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 relative shadow-md shadow-cyan-950/40">
            <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center mb-3 shadow-md">
              3
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              FastAPI + ML Engine
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Extracts autonomic HRV features, runs NLP lexical stress classification, computes composite
              score (0-100), and formulates mitigations.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Engine: 100% Offline FastAPI
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center mb-3 border border-cyan-500/40">
              4
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Closed-Loop Actuation
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Dispatches automated signals to habitat lighting (circadian warm dim), HVAC airflow,
              wearable haptic pacer, and queues flight surgeon alerts.
            </p>
            <div className="text-[10px] font-mono text-amber-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Actuators: Local MQTT / DALI
            </div>
          </div>
        </div>

        {/* Secondary Asynchronous Deep Space Sync */}
        <div className="mt-4 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-300">
              <strong className="text-white">Store-and-Forward Spool:</strong> All assessments are encrypted
              and buffered to local NVMe. When scheduled Deep Space Network (DSN) or satellite comms
              windows open, telemetry bundles are asynchronously synchronized to Ground Control without
              blocking edge operations.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-indigo-950/60 text-indigo-300 font-mono text-[11px] border border-indigo-800/40">
            DTN / CCSDS Compatible
          </span>
        </div>
      </div>

      {/* Production Directory Structure Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Production-Ready Backend Directory Structure
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Clean Architecture • Scalable Microservice Layout
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <pre className="text-slate-300">{`ice-sense-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI application entrypoint, lifespan, CORS, and routing
│   ├── models.py                # Pydantic data contracts (multimodal telemetry, assessments, mitigations)
│   ├── config.py                # Pydantic BaseSettings for hardware IDs, sensor thresholds, port binding
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py        # Centralized v1 API router grouping endpoints
│   │   │   ├── telemetry.py     # Multimodal POST /analyze endpoint and raw stream buffer
│   │   │   ├── mitigations.py   # Habitat actuator command execution and acknowledgment
│   │   │   └── health.py        # K8s liveness (/healthz) and readiness (/readyz) probes
│   │
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── inference.py         # Deterministic edge multimodal engine & feature fusion
│   │   ├── hrv_processor.py     # Time-domain (SDNN, RMSSD) and frequency-domain (LF/HF) signal DSP
│   │   └── nlp_classifier.py    # Local quantized ONNX token classifier for acoustic & lexical fatigue
│   │
│   ├── actuators/
│   │   ├── __init__.py
│   │   ├── lighting.py          # DALI/Hue protocol integration for circadian cabin dimming
│   │   ├── environmental.py     # Modbus TCP driver for habitat HVAC temperature and CO2 ventilation
│   │   └── alerts.py            # Local audio/haptic dispatch to wearable terminals
│   │
│   └── storage/
│       ├── __init__.py
│       ├── buffer.py            # Circular disk-backed ring buffer for zero-data-loss resilience
│       └── store_and_forward.py # Opportunistic bundle protocol sync to ground control
│
├── k8s/
│   ├── deployment.yaml          # Production Kubernetes/K3s edge deployment and service manifest
│   └── daemonset.yaml           # Optional edge node daemonset for multi-habitat deployments
│
├── tests/
│   ├── test_inference.py        # Unit tests verifying stress score bounding and mitigation logic
│   └── test_telemetry_api.py    # Integration tests against FastAPI test client
│
├── Dockerfile                   # Highly optimized multi-stage build for ARM64/AMD64 edge devices
├── requirements.txt             # Pinned production Python dependencies
├── .dockerignore                # Excludes virtualenvs, cache, and local logs from image
└── README.md                    # System blueprint, SLA specifications, and deployment guide`}</pre>
        </div>
      </div>
    </div>
  );
};
