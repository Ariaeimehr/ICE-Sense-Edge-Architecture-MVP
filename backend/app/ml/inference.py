"""
ICE-Sense Edge Machine Learning & Psychological Inference Engine.
Designed for 100% offline edge execution on low-power compute (NVIDIA Jetson, Intel NUC, K3s edge node).
"""

import math
import re
import time
import uuid
from datetime import datetime
from typing import List, Tuple

from app.models import (
    MitigationCategory,
    MitigationPriority,
    MitigationProtocol,
    MultimodalTelemetryPayload,
    PsychologicalAssessmentResponse,
    RiskLevel,
    StressBreakdown,
)

# High-frequency linguistic markers associated with acute stress in isolated crew
HIGH_STRESS_KEYWORDS = {
    "exhausted": 4.5,
    "overwhelmed": 5.0,
    "alarm": 4.0,
    "critical": 4.0,
    "can't focus": 4.5,
    "cannot sleep": 4.0,
    "dizzy": 4.5,
    "pressure": 3.5,
    "malfunction": 3.5,
    "tight": 3.0,
    "conflict": 4.0,
    "headache": 3.5,
    "failure": 4.0,
    "suffocating": 5.5,
    "panicking": 6.0,
    "fatigue": 3.5,
}

CALM_KEYWORDS = {
    "stable": -3.0,
    "rested": -4.0,
    "nominal": -3.5,
    "calm": -4.0,
    "focused": -3.5,
    "smooth": -3.0,
    "routine": -3.0,
    "clear": -2.5,
    "ready": -2.5,
}


class EdgeInferenceEngine:
    """
    Edge-resident Multimodal Psychological Stress Predictor.
    Combines physiological time-series (ECG/PPG HRV) with conversational/log semantics.
    """

    def __init__(self, model_version: str = "v1.4.2-edge-quant"):
        self.model_version = model_version

    def _extract_physiological_strain(self, payload: MultimodalTelemetryPayload) -> Tuple[float, float]:
        """
        Calculates physiological strain based on autonomic nervous system balance:
        - Low RMSSD (< 20 ms) indicates suppressed parasympathetic brake -> high strain.
        - High Heart Rate above baseline (> 90 bpm at rest) indicates sympathetic hyperarousal.
        - Elevated GSR (> 6 uS) indicates sympathetic sweat gland arousal.
        - High Respiratory Rate (> 20 bpm) signals hyperventilation.
        Returns: (physiological_score 0-100, autonomic_dysregulation_factor 0.0-1.0)
        """
        vitals = payload.vitals
        hr = vitals.heart_rate_bpm
        rmssd = vitals.hrv.rmssd
        gsr = vitals.galvanic_skin_response_us or 2.5
        rr = vitals.respiratory_rate_bpm or 14.0

        # RMSSD inverted sigmoid: 10ms -> high stress, 60ms+ -> relaxed
        # Standard healthy resting RMSSD: 35-70ms. Under extreme strain: 10-22ms.
        norm_rmssd = max(5.0, min(120.0, rmssd))
        hrv_strain = 100.0 / (1.0 + math.exp((norm_rmssd - 32.0) / 10.0))

        # Heart rate component (assumes seated/active duty baseline ~68 bpm)
        hr_strain = max(0.0, min(100.0, (hr - 55.0) * 1.5))

        # GSR component (electrodermal activity: 1-3 baseline, >8 acute arousal)
        gsr_strain = max(0.0, min(100.0, (gsr - 2.0) * 12.0))

        # Respiratory component (12-16 normal, >22 tachypnea)
        rr_strain = max(0.0, min(100.0, (rr - 14.0) * 7.5))

        # Weighted combination of physiological features
        raw_physio = (0.45 * hrv_strain) + (0.30 * hr_strain) + (0.15 * gsr_strain) + (0.10 * rr_strain)

        # Signal quality index dampening
        confidence_adjusted = raw_physio * vitals.signal_quality_index + 20.0 * (1.0 - vitals.signal_quality_index)
        physio_score = max(0.0, min(100.0, confidence_adjusted))

        # Autonomic dysregulation index: ratio of sympathetic tone over parasympathetic resilience
        dysregulation = max(0.05, min(0.99, (hr_strain + hrv_strain) / 200.0))

        return physio_score, dysregulation

    def _extract_cognitive_sentiment_load(self, payload: MultimodalTelemetryPayload) -> float:
        """
        Extracts cognitive and linguistic stress from textual entries / voice transcripts.
        Scans lexical valence, sentiment friction, and optional speech acoustic parameters.
        """
        text = payload.text_log.content.lower()
        base_score = 30.0  # neutral mission baseline

        # Scan for stress keywords
        for word, weight in HIGH_STRESS_KEYWORDS.items():
            if re.search(r"\b" + re.escape(word) + r"\b", text):
                base_score += weight * 7.5

        # Scan for calm/affirmative keywords
        for word, weight in CALM_KEYWORDS.items():
            if re.search(r"\b" + re.escape(word) + r"\b", text):
                base_score += weight * 5.0

        # Acoustic indicators if available from on-edge audio feature extractor
        if payload.text_log.speech_rate_wpm:
            # Rapid pressured speech (>180 wpm) or lethargic depression (<90 wpm)
            wpm = payload.text_log.speech_rate_wpm
            if wpm > 185:
                base_score += (wpm - 185) * 0.25
            elif wpm < 85:
                base_score += (85 - wpm) * 0.3

        if payload.text_log.acoustic_jitter_percent and payload.text_log.acoustic_jitter_percent > 2.5:
            # Vocal micro-tremors indicate acute sympathetic vocal cord tension
            base_score += (payload.text_log.acoustic_jitter_percent - 2.5) * 5.0

        return max(5.0, min(98.0, base_score))

    def _determine_mitigations(
        self,
        composite_score: float,
        physio_score: float,
        cognitive_score: float,
        payload: MultimodalTelemetryPayload
    ) -> List[MitigationProtocol]:
        """
        Rule and threshold-based automated mitigation matrix.
        Generates edge-actionable commands for automated habitat systems or crew guidance.
        """
        mitigations: List[MitigationProtocol] = []

        if composite_score >= 75.0:
            # Critical strain level
            mitigations.append(
                MitigationProtocol(
                    protocol_id="PROTO-CRIT-01",
                    priority=MitigationPriority.IMMEDIATE,
                    category=MitigationCategory.ENVIRONMENTAL,
                    title="Engage Circadian Dimming & Acoustic Masking",
                    description="Automated signal sent to environmental control: Reduce cabin lighting to 2700K warm 80 Lux, engage active acoustic white noise cancellation at 45 dBA.",
                    automated_system_trigger="CABIN_LIGHTS_DIM_WARM_2700K",
                    target_action_deadline_mins=5,
                )
            )
            mitigations.append(
                MitigationProtocol(
                    protocol_id="PROTO-CRIT-02",
                    priority=MitigationPriority.HIGH,
                    category=MitigationCategory.SCHEDULE,
                    title="Mandatory Non-Sleep Deep Rest (NSDR) Protocol",
                    description="Pause critical extravehicular activity (EVA) or high-load console shift. Reassign mission checklist tasks to secondary operator for 45 minutes.",
                    automated_system_trigger="WORKSTATION_SCHEDULE_LOCKOUT_WARNING",
                    target_action_deadline_mins=15,
                )
            )
            mitigations.append(
                MitigationProtocol(
                    protocol_id="PROTO-CRIT-03",
                    priority=MitigationPriority.HIGH,
                    category=MitigationCategory.MEDICAL,
                    title="Telemetry Flag to Habitat Medical Officer",
                    description="Autonomous local edge notification logged on Habitat Flight Surgeon / Executive Officer dashboard for confidential check-in.",
                    automated_system_trigger="NOTIFY_EDGE_MEDICAL_CONSOLES",
                    target_action_deadline_mins=30,
                )
            )

        elif composite_score >= 50.0:
            # Elevated stress level
            mitigations.append(
                MitigationProtocol(
                    protocol_id="PROTO-MOD-01",
                    priority=MitigationPriority.MEDIUM,
                    category=MitigationCategory.ENVIRONMENTAL,
                    title="Optimize Cabin Airflow & Temperature",
                    description="Minor adjustment to cabin ventilation (+15% flow) and drop ambient setpoint by 1.2°C to alleviate autonomic hyperarousal.",
                    automated_system_trigger="HVAC_COOLING_CYCLE_1.2C",
                    target_action_deadline_mins=20,
                )
            )
            mitigations.append(
                MitigationProtocol(
                    protocol_id="PROTO-MOD-02",
                    priority=MitigationPriority.MEDIUM,
                    category=MitigationCategory.INTERPERSONAL,
                    title="Guided Resonance Breathing (0.1 Hz Paced Respiration)",
                    description="Deliver haptic cue on crew wearable providing 4s inhale, 6s exhale resonant pacing to restore vagal tone and elevate RMSSD.",
                    automated_system_trigger="WEARABLE_HAPTIC_RESONANCE_PACE",
                    target_action_deadline_mins=15,
                )
            )

        else:
            # Nominal homeostasis
            mitigations.append(
                MitigationProtocol(
                    protocol_id="PROTO-NOM-01",
                    priority=MitigationPriority.LOW,
                    category=MitigationCategory.SCHEDULE,
                    title="Nominal Homeostasis Maintained",
                    description="Crew member displaying physiological and cognitive resilience. Continue scheduled mission routine and baseline vitals logging.",
                    automated_system_trigger=None,
                    target_action_deadline_mins=120,
                )
            )

        return mitigations

    def evaluate(self, payload: MultimodalTelemetryPayload) -> PsychologicalAssessmentResponse:
        """
        Executes local multimodal evaluation with microsecond execution times.
        No external API or network calls are performed.
        """
        start_time = time.perf_counter()

        physio_score, dysregulation = self._extract_physiological_strain(payload)
        cognitive_score = self._extract_cognitive_sentiment_load(payload)

        # Sensor fusion weights
        weight_physio = 0.55
        weight_cognitive = 0.45

        # Environmental penalty if cabin air quality is stressed (e.g., CO2 elevated)
        env_penalty = 0.0
        if payload.environment and payload.environment.ambient_co2_ppm:
            if payload.environment.ambient_co2_ppm > 1000.0:
                env_penalty += (payload.environment.ambient_co2_ppm - 1000.0) * 0.015

        raw_composite = (physio_score * weight_physio) + (cognitive_score * weight_cognitive) + env_penalty
        composite_score = round(max(0.0, min(100.0, raw_composite)), 1)

        # Risk classification
        if composite_score < 35.0:
            risk = RiskLevel.NOMINAL
        elif composite_score < 60.0:
            risk = RiskLevel.ELEVATED
        elif composite_score < 80.0:
            risk = RiskLevel.ACUTE_STRAIN
        else:
            risk = RiskLevel.MISSION_CRITICAL

        mitigations = self._determine_mitigations(composite_score, physio_score, cognitive_score, payload)

        latency_ms = round((time.perf_counter() - start_time) * 1000.0, 2)

        return PsychologicalAssessmentResponse(
            assessment_id=f"ASSESS-{uuid.uuid4().hex[:8].upper()}",
            crew_member_id=payload.crew_member_id,
            timestamp=datetime.utcnow(),
            stress_score=composite_score,
            risk_level=risk,
            breakdown=StressBreakdown(
                physiological_strain_index=round(physio_score, 1),
                cognitive_sentiment_load=round(cognitive_score, 1),
                autonomic_dysregulation_factor=round(dysregulation, 3),
                sensor_weight_applied={"vitals_hrv": weight_physio, "text_audio_nlp": weight_cognitive},
            ),
            automated_mitigations=mitigations,
            edge_device_id="EDGE-NODE-HAB-ALPHA-01",
            inference_latency_ms=latency_ms,
            offline_store_and_forward_queued=True,
        )


# Global singleton for fast in-process edge inference
inference_engine = EdgeInferenceEngine()
