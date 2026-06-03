from datetime import datetime
from sqlalchemy import String, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Link(Base):
    """Datenbank-Modell für verkürzte URLs."""
    __tablename__ = "links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(10), unique=True, index=True, nullable=False)
    original_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    clicks: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
