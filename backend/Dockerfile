# ==============================================================================
# ICE-Sense: Edge-Optimized Multi-Stage Dockerfile
# Architected for low-power edge appliances (NVIDIA Jetson, Intel NUC, K3s nodes)
# Supports both linux/amd64 and linux/arm64 architectures.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build & Dependency Resolution
# ------------------------------------------------------------------------------
FROM python:3.11-slim-bookworm AS builder

# Prevent python from writing pyc files to disk and disable output buffering
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# Install minimal build tooling needed for C-extensions/wheels if required
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency specifications first to leverage Docker layer caching
COPY requirements.txt .

# Install dependencies into a portable target directory
RUN pip install --prefix=/install --no-warn-script-location -r requirements.txt


# ------------------------------------------------------------------------------
# Stage 2: Minimal Distroless/Hardened Runtime
# ------------------------------------------------------------------------------
FROM python:3.11-slim-bookworm AS runtime

# Edge hardware operational parameters
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    EDGE_NODE_ID="ICE-EDGE-NODE-01" \
    PYTHONPATH=/app

# Create non-root system user & group with explicit UID/GID for edge compliance
RUN groupadd -g 10001 edgegroup && \
    useradd -u 10001 -g edgegroup -s /sbin/nologin -M edgeuser

WORKDIR /app

# Install only essential runtime tools (curl for K8s edge liveness check)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy pre-compiled Python libraries from builder stage
COPY --from=builder /install /usr/local

# Copy application source code
COPY app/ /app/app/

# Ensure secure ownership
RUN chown -R edgeuser:edgegroup /app

# Switch to non-root user
USER 10001:10001

# Expose internal edge API port
EXPOSE 8000

# Edge healthcheck with short timeouts to minimize battery/CPU drain on idle edge nodes
HEALTHCHECK --interval=20s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/healthz || exit 1

# Production edge execution: 2 workers optimized for 2-4 core edge processors
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--no-access-log"]
