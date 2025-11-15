from sqlmodel import select
from sqlalchemy.orm import Session
from .models import SessionModel
from .schemas import SessionCreate, SessionUpdate
from datetime import datetime, timedelta
from collections import defaultdict

# Basic CRUD
def create_session(db: Session, session_in: SessionCreate):
    session = SessionModel(**session_in.dict())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def get_session(db: Session, session_id: int):
    return db.get(SessionModel, session_id)

def list_sessions(db: Session, skip: int = 0, limit: int = 1000):
    return db.exec(select(SessionModel).order_by(SessionModel.date.desc()).offset(skip).limit(limit)).all()

def update_session(db: Session, session_id: int, session_in: SessionUpdate):
    session = db.get(SessionModel, session_id)
    if not session:
        return None
    for k, v in session_in.dict(exclude_unset=True).items():
        setattr(session, k, v)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def delete_session(db: Session, session_id: int):
    session = db.get(SessionModel, session_id)
    if not session:
        return False
    db.delete(session)
    db.commit()
    return True

# Stats endpoint helper
def _group_by_period(sessions, period):
    # sessions: list of SessionModel
    # period: 'week'|'month'|'year'|'all'
    out = defaultdict(float)
    if period == 'all':
        out['all'] = sum(s.duration_min for s in sessions)
        return out
    from datetime import date
    for s in sessions:
        d = s.date
        if period == 'week':
            # ISO year-week key
            key = f"{d.isocalendar()[0]}-W{d.isocalendar()[1]}"
        elif period == 'month':
            key = f"{d.year}-{d.month:02d}"
        elif period == 'year':
            key = f"{d.year}"
        else:
            key = 'other'
        out[key] += s.duration_min
    return dict(sorted(out.items()))

def stats_group_by_sport(db: Session, period: str = 'all'):
    sessions = db.exec(select(SessionModel)).all()
    by_sport = defaultdict(float)
    for s in sessions:
        by_sport[s.sport] += s.duration_min
    return dict(by_sport)

def stats_group_by_zone(db: Session, period: str = 'all'):
    sessions = db.exec(select(SessionModel)).all()
    by_zone = defaultdict(float)
    for s in sessions:
        by_zone[s.zone] += s.duration_min
    return dict(by_zone)

def stats_time_series(db: Session, period: str = 'all'):
    sessions = db.exec(select(SessionModel)).all()
    return _group_by_period(sessions, period)

def stats_distance_by_sport(db: Session):
    sessions = db.exec(select(SessionModel)).all()
    by_sport = defaultdict(float)
    for s in sessions:
        if s.distance_km:
            by_sport[s.sport] += s.distance_km
    return dict(by_sport)

def stats_by_metric_period(db: Session, metric, period):
    if metric is None or period is None:
        raise ValueError("Metric must be specified")
    if metric not in ['distance', 'time', 'zones']:
        raise ValueError("Invalid metric. Must be 'distance' or 'time'.")
    if period not in ['days', 'weeks', 'months']:
        raise ValueError("Invalid period. Must be 'days', 'weeks', or 'months'.")

    sessions = db.exec(select(SessionModel)).all()
    # Fix the periods 
    now = datetime.now()
    dates = []
    if period == 'days':
        for day_offset in range(7):
            day = (now - timedelta(days=day_offset)).date()
            dates.append(day)
    elif period == 'weeks':
        for week_offset in range(8):
            week_num = (now - timedelta(weeks=week_offset)).date().isocalendar().week
            dates.append(week_num)
    elif period == 'months':
        for month_offset in range(6):
            month = (now - timedelta(weeks=month_offset * 4)).date().month
            dates.append(month)

    # Build the aggregation
    by_period = defaultdict(lambda: defaultdict(float))
    for s in sessions:
        if period == 'days':
            # SessionModel.date is a date() already
            m = s.date
        elif period == 'weeks':
            m = s.date.isocalendar().week
        elif period == 'months':
            m = s.date.month
        if metric == 'distance' and s.distance_km is not None and m in dates:
            by_period[m][s.sport] += s.distance_km
        elif metric == 'time' and m in dates:
            by_period[m][s.sport] += s.duration_min
        elif metric == 'zones' and m in dates:
            by_period[m][s.zone] += s.duration_min

    return by_period