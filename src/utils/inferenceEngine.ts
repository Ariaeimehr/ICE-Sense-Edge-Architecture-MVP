import {
  AssessmentResult,
  MitigationCategory,
  MitigationPriority,
  MitigationProtocol,
  RiskLevel,
  VitalsReading,
} from '../types/icesense';

const HIGH_STRESS_WORDS: Record<string, number> = {
  exhausted: 4.5,
  overwhelmed: 5.0,
  alarm: 4.0,
  critical: 4.0,
  "can't focus": 4.5,
  'cannot sleep': 4.0,
  dizzy: 4.5,
  pressure: 3.5,
  malfunction: 3.5,
  tight: 3.0,
  conflict: 4.0,
  headache: 3.5,
  failure: 4.0,
  suffocating: 5.5,
  panicking: 6.0,
  fatigue: 3.5,
};

const CALM_WORDS: Record<string, number> = {
  stable: -3.0,
  rested: -4.0,
  nominal: -3.5,
  calm: -4.0,
  focused: -3.5,
  smooth: -3.0,
  routine: -3.0,
  clear: -2.5,
  ready: -2.5,
};

export function runEdgeInference(
  crewId: string,
  vitals: VitalsReading,
  transcript: string,
  speechWpm: number = 130
): AssessmentResult {
  const startTime = performance.now();

  // 1. Physiological Strain Calculation
  // RMSSD inverted sigmoid: high RMSSD (>60ms) -> low stress; low RMSSD (<20ms) -> high strain
  const normRmssd = Math.max(5, Math.min(120, vitals.hrv.rmssd));
  const hrvStrain = 100 / (1 + Math.exp((normRmssd - 32) / 10));

  // Heart rate strain (resting threshold ~55bpm, max ~125bpm)
  const hrStrain = Math.max(0, Math.min(100, (vitals.heartRateBpm - 55) * 1.5));

  // GSR strain (electrodermal activity: 1-3 baseline, >8 acute arousal)
  const gsrStrain = Math.max(0, Math.min(100, (vitals.galvanicSkinResponseUs - 2.0) * 12));

  // Respiratory rate (12-16 normal, >22 tachypnea)
  const rrStrain = Math.max(0, Math.min(100, (vitals.respiratoryRateBpm - 14) * 7.5));

  const rawPhysio = 0.45 * hrvStrain + 0.3 * hrStrain + 0.15 * gsrStrain + 0.1 * rrStrain;
  const confidenceAdjustedPhysio =
    rawPhysio * vitals.signalQualityIndex + 20 * (1 - vitals.signalQualityIndex);
  const physioScore = Math.max(0, Math.min(100, confidenceAdjustedPhysio));

  const dysregulation = Math.max(0.05, Math.min(0.99, (hrStrain + hrvStrain) / 200));

  // 2. Cognitive / Linguistic Sentiment Strain
  const lowerText = transcript.toLowerCase();
  let cognitiveScore = 30.0; // Baseline neutral score

  for (const [word, weight] of Object.entries(HIGH_STRESS_WORDS)) {
    if (lowerText.includes(word)) {
      cognitiveScore += weight * 7.5;
    }
  }

  for (const [word, weight] of Object.entries(CALM_WORDS)) {
    if (lowerText.includes(word)) {
      cognitiveScore += weight * 5.0;
    }
  }

  // Acoustic / speech pacing penalty
  if (speechWpm > 180) {
    cognitiveScore += (speechWpm - 180) * 0.25; // Pressure/rapid speech
  } else if (speechWpm < 85) {
    cognitiveScore += (85 - speechWpm) * 0.3; // Lethargy
  }

  cognitiveScore = Math.max(5, Math.min(98, cognitiveScore));

  // 3. Composite Sensor Fusion
  const weightPhysio = 0.55;
  const weightCognitive = 0.45;
  const compositeScore = Math.round(
    Math.max(0, Math.min(100, physioScore * weightPhysio + cognitiveScore * weightCognitive)) * 10
  ) / 10;

  // 4. Risk Level Determination
  let riskLevel: RiskLevel = 'NOMINAL';
  if (compositeScore >= 80) {
    riskLevel = 'MISSION_CRITICAL';
  } else if (compositeScore >= 60) {
    riskLevel = 'ACUTE_STRAIN';
  } else if (compositeScore >= 38) {
    riskLevel = 'ELEVATED';
  }

  // 5. Automated Mitigation Protocols Dispatch
  const mitigations: MitigationProtocol[] = [];

  if (compositeScore >= 75) {
    mitigations.push({
      protocolId: 'PROTO-CRIT-01',
      priority: 'IMMEDIATE',
      category: 'ENVIRONMENTAL',
      title: 'Engage Circadian Dimming & Acoustic Masking',
      description:
        'Trigger habitat environmental control: transition cabin lighting to 2700K warm 80 Lux, engage active acoustic cancellation at 45 dBA.',
      automatedSystemTrigger: 'CABIN_LIGHTS_DIM_WARM_2700K',
      targetActionDeadlineMins: 5,
    });
    mitigations.push({
      protocolId: 'PROTO-CRIT-02',
      priority: 'HIGH',
      category: 'SCHEDULE',
      title: 'Mandatory Non-Sleep Deep Rest (NSDR) Protocol',
      description:
        'Pause active console or EVA duty checklist. Enforce 45-minute quiet recovery sequence and shift tasks to secondary specialist.',
      automatedSystemTrigger: 'CONSOLE_DUTY_PAUSE_ALERT',
      targetActionDeadlineMins: 15,
    });
    mitigations.push({
      protocolId: 'PROTO-CRIT-03',
      priority: 'HIGH',
      category: 'MEDICAL',
      title: 'Confidential Alert to Habitat Medical Officer',
      description:
        'Encrypted local notification placed in Habitat Flight Surgeon / Executive Officer medical queue for discrete check-in.',
      automatedSystemTrigger: 'LOCAL_SURGEON_QUEUE_DISPATCH',
      targetActionDeadlineMins: 30,
    });
  } else if (compositeScore >= 45) {
    mitigations.push({
      protocolId: 'PROTO-MOD-01',
      priority: 'MEDIUM',
      category: 'ENVIRONMENTAL',
      title: 'Optimize Cabin Airflow & Drop Temperature 1.2°C',
      description:
        'Increase ventilation air changes (+15%) and decrease ambient setpoint by 1.2°C to suppress sympathetic thermal arousal.',
      automatedSystemTrigger: 'HVAC_COOLING_CYCLE_1.2C',
      targetActionDeadlineMins: 20,
    });
    mitigations.push({
      protocolId: 'PROTO-MOD-02',
      priority: 'MEDIUM',
      category: 'INTERPERSONAL',
      title: 'Guided Resonance Breathing (0.1 Hz Paced Respiration)',
      description:
        'Haptic biofeedback cue delivered to wearable: 4s inhale, 6s exhale pacing to re-elevate RMSSD vagal tone.',
      automatedSystemTrigger: 'WEARABLE_HAPTIC_PACER',
      targetActionDeadlineMins: 15,
    });
  } else {
    mitigations.push({
      protocolId: 'PROTO-NOM-01',
      priority: 'LOW',
      category: 'SCHEDULE',
      title: 'Nominal Homeostasis Maintained',
      description:
        'Physiological and linguistic metrics within healthy baseline parameters. Continue scheduled mission timeline.',
      automatedSystemTrigger: undefined,
      targetActionDeadlineMins: 120,
    });
  }

  const latency = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    assessmentId: `ASSESS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    crewMemberId: crewId,
    timestamp: new Date().toISOString(),
    stressScore: compositeScore,
    riskLevel,
    breakdown: {
      physiologicalStrainIndex: Math.round(physioScore * 10) / 10,
      cognitiveSentimentLoad: Math.round(cognitiveScore * 10) / 10,
      autonomicDysregulationFactor: Math.round(dysregulation * 1000) / 1000,
      weights: { vitals: weightPhysio, textNlp: weightCognitive },
    },
    mitigations,
    inferenceLatencyMs: latency || 1.4,
    edgeDeviceId: 'ICE-EDGE-NODE-HAB-ALPHA-01',
  };
}
