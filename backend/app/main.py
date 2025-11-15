from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session
from . import database, models, crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from fastapi import Query

app = FastAPI(title='Training Stats API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event('startup')
def on_startup():
    database.create_db_and_tables()

@app.post('/sessions', response_model=schemas.SessionRead)
def create_session(session_in: schemas.SessionCreate, db: Session =
Depends(database.get_session)):
    return crud.create_session(db, session_in)

@app.get('/sessions', response_model=list[schemas.SessionRead])
def list_sessions(db: Session = Depends(database.get_session)):
    return crud.list_sessions(db)

@app.get('/sessions/{session_id}', response_model=schemas.SessionRead)
def get_session(session_id: int, db: Session =
Depends(database.get_session)):
    s = crud.get_session(db, session_id)
    if not s:
        raise HTTPException(status_code=404, detail='Not found')
    return s

@app.put('/sessions/{session_id}', response_model=schemas.SessionRead)
def update_session(session_id: int, session_in: schemas.SessionUpdate, db:
Session = Depends(database.get_session)):
    s = crud.update_session(db, session_id, session_in)
    if not s:
        raise HTTPException(status_code=404, detail='Not found')
    return s

@app.delete('/sessions/{session_id}')
def delete_session(session_id: int, db: Session =
Depends(database.get_session)):
    ok = crud.delete_session(db, session_id)
    if not ok:
        raise HTTPException(status_code=404, detail='Not found')
    return {'ok': True}

# Stats endpoints
@app.get('/stats/by_sport')
def stats_by_sport(db: Session = Depends(database.get_session)):
    return crud.stats_group_by_sport(db)

@app.get('/stats/by_zone')
def stats_by_zone(db: Session = Depends(database.get_session)):
    return crud.stats_group_by_zone(db)

@app.get('/stats/distance_by_sport')
def distance_by_sport(db: Session = Depends(database.get_session)):
    return crud.stats_distance_by_sport(db)

@app.get('/stats/time_series')
def time_series(period: str = 'all', db: Session = Depends(database.get_session)):
    # period: week | month | year | all
    return crud.stats_time_series(db, period)

@app.get("/stats/metric-by-period")
def metric_by_period(metric: str, period: str, db: Session = Depends(database.get_session)):
    return crud.stats_by_metric_period(db, metric, period)