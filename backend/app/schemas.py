from typing import Optional
from datetime import date
from pydantic import BaseModel, Field

class SessionCreate(BaseModel):
    date: date
    sport: str
    duration_min: int = Field(..., ge=0)
    zone: str
    avg_hr: Optional[int] = None
    distance_km: Optional[float] = None

class SessionRead(SessionCreate):
    id: int
    
class SessionUpdate(BaseModel):
    date: Optional[date] = None
    sport: Optional[str] = None
    duration_min: Optional[int] = None
    zone: Optional[str] = None
    avg_hr: Optional[int] = None
    distance_km: Optional[float] = None