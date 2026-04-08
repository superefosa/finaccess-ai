# 🚀 FinAccess AI

FinAccess AI is a **full-stack, AI-powered credit assessment and loan application platform** developed as a Capstone project for the Master of Science in Software Engineering (MSSE).

It demonstrates a complete **end-to-end lending workflow**, including user onboarding, financial profiling, AI-based credit risk scoring, admin decision-making, and cloud deployment.

---

## 🌐 Live Deployment

- **Frontend (Vercel):** https://finaccess-ai.vercel.app  
- **Backend API:** https://finaccess-backend.onrender.com  
- **API Documentation (Swagger):** https://finaccess-backend.onrender.com/docs  

---

## 🎥 Capstone Deliverables

- 📦 **GitHub Repository:** https://github.com/superefosa/finaccess-ai  
- 🧠 **Design Document:** https://github.com/superefosa/finaccess-ai/blob/main/docs/design.md  
- 🧪 **Testing Document:** https://github.com/superefosa/finaccess-ai/blob/main/docs/testing.md  
- 📋 **Agile Task Board (Trello):** https://trello.com/b/y48tTuWO/finaccess-ai-capstone-scrum-board
- 🎬 **Final Presentation (15–20 min):** *(googleDriveLink add your video link)*  

⚠️ Ensure This repository has been shared with the GitHub account: quantic-grader

---

## 🔐 Demo Access (Quick Test)

### 👤 User
- Email: `user@example.com`  
- Password: `UserPass123!`

### 🛠️ Admin
- Email: `admin@example.com`  
- Password: `AdminPass123!`

👉 **Login:** https://finaccess-ai.vercel.app/login  
👉 **Admin Dashboard:** https://finaccess-ai.vercel.app/admin  

---

## 🧠 Core Features

### 👥 User Features
- User registration and login (JWT authentication)
- Financial profile creation and update
- Loan application submission
- AI-powered credit risk scoring
- Application status tracking

### 🛠️ Admin Features
- View all loan applications
- Approve or reject applications
- View AI risk scores and reasoning
- Audit logs for transparency

### 🤖 AI Capabilities
- Credit risk prediction using a trained ML model
- Feature-based scoring (income, debt, etc.)
- Model training pipeline included

---

## 🧰 Tech Stack

### Frontend
- React (Vite)
- JavaScript
- Axios

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- JWT Authentication (`python-jose`)

### AI / Machine Learning
- scikit-learn
- pandas
- joblib

### Database
- **PostgreSQL (production – Render)**
- SQLite (optional local fallback)

### DevOps / Tooling
- Docker Compose (local development)
- GitHub Actions (CI pipeline)
- Render (backend hosting)
- Vercel (frontend hosting)

---

## 🏗️ System Architecture

Frontend (React)
        ↓
FastAPI Backend (REST API)
        ↓
Database (PostgreSQL)
        ↓
AI Model (scikit-learn)

---

## ⚙️ Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (recommended)

---

### 1️⃣ Clone Repository

git clone https://github.com/superefosa/finaccess-ai.git
cd finaccess-ai

---

### 2️⃣ Setup Environment

copy .env.example .env

---

### 3️⃣ Run Backend

cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

---

### 4️⃣ Run Frontend

cd frontend
npm install
npm run dev

---

### 5️⃣ Train AI Model (Optional)

cd ai
python train_model.py

---

## 🧪 Testing

- Manual functional testing
- API testing via Swagger UI
- CI pipeline with GitHub Actions

---

## 🔄 CI/CD Pipeline

- GitHub Actions for CI  
- Backend auto-deployed on Render  
- Frontend auto-deployed on Vercel  

---

## 📋 Agile Development

- Scrum-based development  
- Multiple sprint cycles  
- Task tracking via Trello  

---

## 🔒 Security

- JWT authentication  
- Password hashing  
- Role-based access control  

---

## 🚧 Limitations

- Limited automated testing  
- Basic AI model  
- No real banking integration  

---

## 🔮 Future Improvements

- Advanced ML models  
- Real-time integrations  
- Microservices architecture  
- Kubernetes deployment  

---

## 👨‍💻 Author

Efosa Kelvin Obasuyi  
Jimly Okeke
Eze Odira Obianuju

---

## 📌 How to Evaluate

1. Open frontend  
2. Login  
3. Submit application  
4. Check AI score  
5. Login as admin  
6. Approve/reject  

---

## ⭐ Summary

- Full-stack engineering  
- AI integration  
- Cloud deployment  
- Agile practices  
