from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import Base
from app.routes.links import router

app = FastAPI(
    title="URL Shortener API",
    description="HomeLab DevOps Projekt — FastAPI Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Kubernetes Liveness/Readiness Probe."""
    return {"status": "healthy"}

@app.on_event("startup")
def startup():
    """Datenbanktabellen beim Start erstellen."""
    Base.metadata.create_all(bind=engine)

# Router NACH den expliziten Routen einbinden,
# damit die Catch-all-Route /health nicht überschattet
app.include_router(router)