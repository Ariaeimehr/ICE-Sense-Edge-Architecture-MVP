import { CrewMember, VitalsReading } from '../types/icesense';

export const CREW_MEMBERS: CrewMember[] = [
  {
    id: 'CREW-04-ELENA',
    name: 'Dr. Elena Rostova',
    role: 'Lead EVA Specialist & Flight Engineer',
    mission: 'Artemis Deep Surface Habitat (Sol 142)',
    avatar: '👩‍🚀',
    baselineHr: 62,
    baselineRmssd: 58,
  },
  {
    id: 'CREW-02-MARCUS',
    name: 'Lt. Cmdr. Marcus Vance',
    role: 'Acoustic Sonar Officer & Watch Commander',
    mission: 'Vanguard Deep Submersible (Day 67)',
    avatar: '⚓',
    baselineHr: 66,
    baselineRmssd: 52,
  },
  {
    id: 'CREW-09-AISHA',
    name: 'Dr. Aisha Al-Mansoor',
    role: 'Polar Astrobiologist & Solo Sensor Tech',
    mission: 'Amundsen-Scott Isolated Outpost (Day 210)',
    avatar: '🔬',
    baselineHr: 64,
    baselineRmssd: 60,
  },
];

export interface ScenarioPreset {
  id: string;
  name: string;
  category: 'Critical' | 'Elevated' | 'Nominal';
  crewId: string;
  vitals: Omit<VitalsReading, 'timestamp'>;
  transcript: string;
  speechWpm: number;
  description: string;
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'eva-crisis',
    name: 'EVA Airlock Pressure Fault & Acute Alarm',
    category: 'Critical',
    crewId: 'CREW-04-ELENA',
    vitals: {
      heartRateBpm: 118,
      hrv: { rmssd: 14.2, sdnn: 22.0, lf_hf_ratio: 4.8 },
      respiratoryRateBpm: 26,
      galvanicSkinResponseUs: 8.9,
      skinTempCelsius: 35.8,
      signalQualityIndex: 0.96,
    },
    transcript:
      "Airlock seal secondary valve failed seal check. Pressure gauge is fluctuating rapidly. I feel dizzy and my chest is tight. We can't afford a failure on this repress cycle, need immediate clearance.",
    speechWpm: 198,
    description: 'High autonomic arousal, rapid respiration, suppressed HRV vagal tone, and acute alarm semantics.',
  },
  {
    id: 'sub-sleep-deprivation',
    name: 'Submersible 48hr Patrol & Chronic Fatigue',
    category: 'Elevated',
    crewId: 'CREW-02-MARCUS',
    vitals: {
      heartRateBpm: 84,
      hrv: { rmssd: 24.5, sdnn: 31.0, lf_hf_ratio: 2.9 },
      respiratoryRateBpm: 18,
      galvanicSkinResponseUs: 4.2,
      skinTempCelsius: 34.2,
      signalQualityIndex: 0.94,
    },
    transcript:
      "Hour 46 on active passive sonar array. Experiencing persistent headache and difficulty sustaining visual focus on waterfall display. Cannot sleep due to machinery vibration.",
    speechWpm: 105,
    description: 'Moderate HRV depression, elevated basal resting rate, lexical fatigue markers and sensory strain.',
  },
  {
    id: 'nominal-exercise',
    name: 'Nominal Orbital Habitat Routine Watch',
    category: 'Nominal',
    crewId: 'CREW-04-ELENA',
    vitals: {
      heartRateBpm: 65,
      hrv: { rmssd: 64.0, sdnn: 72.0, lf_hf_ratio: 1.1 },
      respiratoryRateBpm: 13,
      galvanicSkinResponseUs: 2.1,
      skinTempCelsius: 34.6,
      signalQualityIndex: 0.99,
    },
    transcript:
      "Completed scheduled water recycling pump diagnostics. All telemetry streams are nominal and stable. Heading to dining compartment for scheduled meal with crew.",
    speechWpm: 132,
    description: 'Optimal autonomic balance, robust parasympathetic vagal brake (high RMSSD), calm linguistic valence.',
  },
  {
    id: 'polar-monotony',
    name: 'Polar Winter Isolation & Circadian Desynchrony',
    category: 'Elevated',
    crewId: 'CREW-09-AISHA',
    vitals: {
      heartRateBpm: 78,
      hrv: { rmssd: 28.0, sdnn: 36.0, lf_hf_ratio: 2.2 },
      respiratoryRateBpm: 16,
      galvanicSkinResponseUs: 3.8,
      skinTempCelsius: 34.0,
      signalQualityIndex: 0.95,
    },
    transcript:
      "Outside blizzard wind reached 62 knots. Total darkness outside for 90 consecutive days. Disrupted circadian rhythm; felt completely exhausted during noon sample prep.",
    speechWpm: 92,
    description: 'Sluggish speech cadence, circadian disruption, mild autonomic dysregulation.',
  },
];
