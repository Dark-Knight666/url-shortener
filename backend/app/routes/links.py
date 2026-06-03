import shortuuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Link
from app.config import settings

router = APIRouter()

# ── Pydantic Schemas (Eingabe/Ausgabe Validierung) ─────────────────────────────

class LinkCreate(BaseModel):
    """Eingabe: URL die verkürzt werden soll."""
    original_url: HttpUrl

class LinkResponse(BaseModel):
    """Ausgabe: Verkürzte URL mit Metadaten."""
    code: str
    original_url: str
    short_url: str
    clicks: int

    class Config:
        from_attributes = True

# ── API Endpunkte ──────────────────────────────────────────────────────────────

@router.post("/api/shorten", response_model=LinkResponse)
def shorten_url(data: LinkCreate, db: Session = Depends(get_db)):
    """
    VERARBEITUNG: Langen URL empfangen, kurzen Code generieren,
    in Datenbank speichern, kurzen URL zurückgeben.
    """
    code = shortuuid.ShortUUID().random(length=7)

    link = Link(
        code=code,
        original_url=str(data.original_url),
    )
    db.add(link)
    db.commit()
    db.refresh(link)

    return LinkResponse(
        code=link.code,
        original_url=link.original_url,
        short_url=f"{settings.BASE_URL}/{link.code}",
        clicks=link.clicks,
    )

@router.get("/api/links", response_model=list[LinkResponse])
def get_all_links(db: Session = Depends(get_db)):
    """AUSGABE: Alle gespeicherten Links auflisten."""
    links = db.query(Link).order_by(Link.created_at.desc()).limit(50).all()
    return [
        LinkResponse(
            code=l.code,
            original_url=l.original_url,
            short_url=f"{settings.BASE_URL}/{l.code}",
            clicks=l.clicks,
        )
        for l in links
    ]

@router.get("/{code}")
def redirect_to_url(code: str, db: Session = Depends(get_db)):
    """VERARBEITUNG: Kurzen Code in langen URL umwandeln und weiterleiten."""
    link = db.query(Link).filter(Link.code == code).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link nicht gefunden")

    # Klick-Zähler erhöhen
    link.clicks += 1
    db.commit()

    return RedirectResponse(url=link.original_url, status_code=302)
