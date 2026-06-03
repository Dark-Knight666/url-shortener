# ── Stage 1: Base ─────────────────────────────────────────────────────────────
FROM python:3.12-slim AS base

WORKDIR /app

# System-Abhängigkeiten
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Requirements zuerst kopieren (Docker Cache nutzen)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ── Stage 2: Production ────────────────────────────────────────────────────────
FROM base AS production

WORKDIR /app

COPY app/ ./app/

# Kein Root-User in Production!
RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
