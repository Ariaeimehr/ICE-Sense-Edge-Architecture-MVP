"""
ICE-Sense: Isolated, Confined, and Extreme Environment Sensor System
Pydantic Data Models for Multimodal Telemetry and Psychological Stress Assessment.
"""

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, conlist


class RiskLevel(str, Enum):
    NOMINAL = "NOMINAL"
    ELEVATED = "ELEVATED"
    ACUTE_STRAIN = "ACUTE_STRAIN"
    MISSION_CRITICAL = "MISSION_CRITICAL"


class MitigationCategory(str, Enum):
    ENVIRONMENTAL = "ENVIRONMENTAL"
    SCHEDULE = "SCHEDULE"
    INTERPERSONAL = "INTERPERSONAL"
    MEDICAL = "MEDICAL"


class MitigationPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    IMMEDIATE = "IMMEDIATE"


class HRVMetrics(BaseModel):
    rmssd: float = Field(
        ...,
        ge=0.0,
        le=300.0,
        description="Root Mean Square of Successive Differences between normal heartbeats (ms). Primary parasympathetic metric."
    )
    sdnn: float = Field(
        ...,
        ge=0.0,
        le=500.0,
        description="Standard deviation of NN intervals (ms)."
    )
    lf_hf_ratio: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=20.0,
        description="Low Frequency / High Frequency ratio indicating sympathetic/parasympathetic balance."
    )


class VitalsReading(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    heart_rate_bpm: float = Field(..., ge=30.0, le=240.0, description="Instantaneous heart rate in beats per minute.")
    hrv: HRVMetrics = Field(..., description="Calculated Heart Rate Variability time-domain metrics.")
    respiratory_rate_bpm: Optional[float] = Field(default=14.0, ge=4.0, le=60.0, description="Breaths per minute.")
    galvanic_skin_response_us: Optional[float] = Field(
        default=2.5,
        ge=0.0,
        le=50.0,
        description="Electrodermal activity / GSR in micro-Siemens."
    )
    skin_temp_celsius: Optional[float] = Field(default=34.5, ge=25.0, le=42.0)
    signal_quality_index: float = Field(
        default=0.98,
        ge=0.0,
        le=1.0,
        description="Confidence score of biosensor contact and motion artifact suppression."
    )


class TextLogInput(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    content: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Text log entry or transcribed audio message from habitat workstation or personal communicator."
    )
    source_channel: str = Field(
        default="voice_transcript",
        description="Channel source: 'voice_transcript', 'journal_entry', or 'comms_uplink'."
    )
    speech_rate_wpm: Optional[float] = Field(
        default=None,
        ge=40.0,
        le=350.0,
        description="Words per minute detected from voice audio streaming."
    )
    acoustic_jitter_percent: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=20.0,
        description="Micro-fluctuations in vocal pitch associated with acute psychological strain."
    )


class EnvironmentalContext(BaseModel):
    cabin_id: str = Field(default="HAB-MODULE-ALPHA", description="Identifier of habitat module or submarine compartment.")
    ambient_co2_ppm: Optional[float] = Field(default=850.0, description="Ambient CO2 level in parts per million.")
    ambient_lux: Optional[float] = Field(default=350.0, description="Ambient cabin lighting intensity in Lux.")
    noise_decibels: Optional[float] = Field(default=52.0, description="Background acoustic pressure in dBA.")
    mission_day: int = Field(default=142, ge=1, description="Sol or Mission Day elapsed in isolation.")


class MultimodalTelemetryPayload(BaseModel):
    crew_member_id: str = Field(..., example="CREW-04-ELENA")
    session_id: str = Field(..., example="SESS-2026-0908-4491")
    vitals: VitalsReading
    text_log: TextLogInput
    environment: Optional[EnvironmentalContext] = Field(default_factory=EnvironmentalContext)


class MitigationProtocol(BaseModel):
    protocol_id: str
    priority: MitigationPriority
    category: MitigationCategory
    title: str
    description: str
    automated_system_trigger: Optional[str] = Field(
        None,
        description="Local edge system hook triggered automatically (e.g., 'CABIN_LIGHTING_WARM_DIM', 'AUDIO_WHITE_NOISE')."
    )
    target_action_deadline_mins: int = Field(
        default=30,
        description="Recommended execution timeframe for crew commander or individual."
    )


class StressBreakdown(BaseModel):
    physiological_strain_index: float = Field(..., ge=0.0, le=100.0)
    cognitive_sentiment_load: float = Field(..., ge=0.0, le=100.0)
    autonomic_dysregulation_factor: float = Field(..., ge=0.0, le=1.0)
    sensor_weight_applied: Dict[str, float]


class PsychologicalAssessmentResponse(BaseModel):
    assessment_id: str
    crew_member_id: str
    timestamp: datetime
    stress_score: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Composite psychological stress score: 0 (Deep Rest/Homeostasis) to 100 (Extreme Mission Distress)."
    )
    risk_level: RiskLevel
    breakdown: StressBreakdown
    automated_mitigations: List[MitigationProtocol]
    edge_device_id: str
    inference_latency_ms: float
    offline_store_and_forward_queued: bool = Field(
        default=False,
        description="Whether an encrypted digest is spooled to edge disk for transmission on next orbital/comms pass."
    )


class EdgeHealthStatus(BaseModel):
    status: str
    edge_node_id: str
    uptime_seconds: float
    model_version: str
    local_storage_buffer_mb: float
    pending_sync_telemetry_records: int
    system_load: Dict[str, float]
