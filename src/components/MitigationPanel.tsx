import React, { useState } from 'react';
import {
  MitigationProtocol,
  MitigationCategory,
  MitigationPriority,
} from '../types/icesense';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  HeartHandshake,
  Stethoscope,
  Zap,
  Check,
} from 'lucide-react';

interface MitigationPanelProps {
  mitigations: MitigationProtocol[];
  onOpenBreathingModal: () => void;
}

export const MitigationPanel: React.FC<MitigationPanelProps> = ({
  mitigations,
  onOpenBreathingModal,
}) => {
  const [triggeredActuators, setTriggeredActuators] = useState<Record<string, boolean>>({});

  const handleTriggerActuator = (protocolId: string, trigger?: string) => {
    if (trigger === 'WEARABLE_HAPTIC_PACER' || trigger === 'WEARABLE_HAPTIC_RESONANCE_PACE') {
      onOpenBreathingModal();
    }
    setTriggeredActuators((prev) => ({ ...prev, [protocolId]: true }));
  };

  const getCategoryIcon = (category: MitigationCategory) => {
    switch (category) {
      case 'ENVIRONMENTAL':
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'SCHEDULE':
        return <Clock className="w-4 h-4 text-sky-400" />;
      case 'INTERPERSONAL':
        return <HeartHandshake className="w-4 h-4 text-emerald-400" />;
      case 'MEDICAL':
        return <Stethoscope className="w-4 h-4 text-rose-400" />;
    }
  };

  const getPriorityBadge = (priority: MitigationPriority) => {
    switch (priority) {
      case 'IMMEDIATE':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-red-950/80 text-red-300 border border-red-800 animate-pulse">
            IMMEDIATE ACTION
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-orange-950/80 text-orange-300 border border-orange-800">
            HIGH PRIORITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-950/80 text-amber-300 border border-amber-800">
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            ROUTINE
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Automated Mitigation Protocols
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous edge habitat triggers and crew counter-measures
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {mitigations.length} Action{mitigations.length === 1 ? '' : 's'} Formulated
        </span>
      </div>

      <div className="space-y-3">
        {mitigations.map((proto) => {
          const isTriggered = triggeredActuators[proto.protocolId];

          return (
            <div
              key={proto.protocolId}
              className={`p-4 rounded-xl border transition-all ${
                isTriggered
                  ? 'bg-emerald-950/20 border-emerald-800/40'
                  : proto.priority === 'IMMEDIATE'
                  ? 'bg-red-950/15 border-red-800/50'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getCategoryIcon(proto.category)}
                  <span className="text-xs font-semibold text-slate-200">{proto.title}</span>
                  {getPriorityBadge(proto.priority)}
                </div>
                <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                  T-{proto.targetActionDeadlineMins}m
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">{proto.description}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                {proto.automatedSystemTrigger ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Hardware Trigger: {proto.automatedSystemTrigger}</span>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-slate-500">
                    No hardware actuator needed
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {proto.automatedSystemTrigger && (
                    <button
                      onClick={() =>
                        handleTriggerActuator(proto.protocolId, proto.automatedSystemTrigger)
                      }
                      className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                        isTriggered
                          ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700'
                          : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {isTriggered ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Actuator Dispatched</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Dispatch Actuator</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
