"""
# En Local:
from sqlmodel import SQLModel, create_engine, Session
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./db.sqlite')
engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
def get_session():
    with Session(engine) as session:
        yield session
"""
from sqlmodel import SQLModel, create_engine, Session
import os

# --- BASE PATH PERSISTENTE EN RENDER ---
# Render ofrece /var/data como directorio persistente
PERSISTENT_DIR = "/var/data"

# Si existe /var/data (Render), guardamos la DB ahí
if os.path.exists(PERSISTENT_DIR):
    DATABASE_PATH = os.path.join(PERSISTENT_DIR, "db.sqlite")
else:
    # Local: guardamos en el directorio actual
    DATABASE_PATH = "./db.sqlite"

# Construimos la URL para SQLAlchemy
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
