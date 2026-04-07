\## ▶️ Local Setup \& Execution Guide



\### Prerequisites

\- Python 3.12

\- Node.js

\- Docker (optional)



\---



\## Option 1: Docker



cd ai

python train\_model.py



docker compose up --build



docker compose exec backend python seed\_demo.py



\---



\## Option 2: Manual Setup



\### Backend

cd backend

pip install -r requirements.txt

alembic upgrade head

python seed\_demo.py

uvicorn app.main:app --reload



\### Frontend

cd frontend

npm install

npm run dev



\---



\## URLs

Frontend: http://localhost:5173  

Backend: http://localhost:8000  

Docs: http://localhost:8000/docs  



\---



\## Demo Credentials

Admin: admin@example.com / AdminPass123!  

User: user@example.com / UserPass123!

