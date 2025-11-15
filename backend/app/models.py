from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import date

class SessionModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    sport: str # 'row' | 'bike' | 'gym'
    duration_min: int
    zone: str # 'Z1' | 'Z2' | 'Z3' | 'Z4+Z5'
    avg_hr: Optional[int] = None
    distance_km: Optional[float] = None
