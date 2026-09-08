export type RiskLevel = 'NOMINAL' | 'ELEVATED' | 'ACUTE_STRAIN' | 'MISSION_CRITICAL';

export type MitigationCategory = 'ENVIRONMENTAL' | 'SCHEDULE' | 'INTERPERSONAL' | 'MEDICAL';
export type MitigationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';

export interface HRVMetrics {
  rmssd: number;
  sdnn: number;
  lf_hf_ratio?: number;
}

export interface VitalsReading {
  timestamp: string;
  heartRateBpm: number;
  hrv: HRVMetrics;
  respiratoryRateBpm: number;
  galvanicSkinResponseUs: number;
  skinTempCelsius: number;
  signalQualityIndex: number;
}

export interface MitigationProtocol {
  protocolId: string;
  priority: MitigationPriority;
  category: MitigationCategory;
  title: string;
  description: string;
  automatedSystemTrigger?: string;
  targetActionDeadlineMins: number;
  isExecuted?: boolean;
}

export interface StressBreakdown {
  physiologicalStrainIndex: number;
  cognitiveSentimentLoad: number;
  autonomicDysregulationFactor: number;
  weights: {
    vitals: number;
    textNlp: number;
  };
}

export interface AssessmentResult {
  assessmentId: string;
  crewMemberId: string;
  timestamp: string;
  stressScore: number; // 0 - 100
  riskLevel: RiskLevel;
  breakdown: StressBreakdown;
  mitigations: MitigationProtocol[];
  inferenceLatencyMs: number;
  edgeDeviceId: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  mission: string;
  avatar: string;
  baselineHr: number;
  baselineRmssd: number;
}
