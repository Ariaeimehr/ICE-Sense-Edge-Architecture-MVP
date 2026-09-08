import React, { useState, useEffect } from 'react';
import { Wind, X, Play, Pause, Heart } from 'lucide-react';

interface ResonanceBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResonanceBreathingModal: React.FC<ResonanceBreathingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [phase, setPhase] = useState<'Inhale' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(true);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            setPhase('Exhale');
            return 6; // 6 second exhale for parasympathetic vagal stimulation
          } else {
            setPhase('Inhale');
            setCyclesCompleted((c) => c + 1);
            return 4; // 4 second inhale
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, phase]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Resonance Breathing Pacer</h3>
              <p className="text-xs text-slate-400 font-mono">0.1 Hz Autonomous Vagal Rebalancing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breathing Animation Circle */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-52 h-52">
            <div
              className={`absolute rounded-full border-2 border-cyan-400/40 transition-all duration-1000 ease-in-out ${
                phase === 'Inhale'
                  ? 'w-48 h-48 bg-cyan-500/20 shadow-lg shadow-cyan-500/30'
                  : 'w-24 h-24 bg-cyan-950/40'
              }`}
            />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-2xl font-bold tracking-tight text-white uppercase font-mono">
                {phase}
              </span>
              <span className="text-4xl font-extrabold text-cyan-300 font-mono my-1">
                {secondsLeft}s
              </span>
              <span className="text-xs text-slate-400">
                {phase === 'Inhale' ? 'Diaphragmatic Expansion' : 'Smooth Vagal Release'}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-400">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Target RMSSD: &gt; 45ms • Cycles completed: {cyclesCompleted}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause Pacing' : 'Resume Pacing'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wide shadow-md"
          >
            Conclude Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
