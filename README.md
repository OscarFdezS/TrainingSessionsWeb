# Training Stats (local)
## Backend
cd backend
python -m venv .venv
source .venv/bin/activate # o .venv\Scripts\activate en Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
La API quedará en http://localhost:8000
## Frontend
cd frontend
npm install
npm run dev
Abrir en el navegador la URL que muestre vite (por defecto http://localhost:
5173)
NOTA: el frontend asume la API en http://localhost:8000. Cambia `frontend/
src/api.js` si usas otro puerto.
