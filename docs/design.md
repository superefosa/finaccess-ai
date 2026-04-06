\# 📐 System Design – FinAccess AI



\## Overview



FinAccess AI is a full-stack web application designed to support intelligent lending decisions using machine learning. The system enables users to submit loan applications, which are evaluated by an AI model and reviewed by an admin.



\---



\## Architecture



The system follows a layered architecture:



Frontend (React - Vercel)  

↓  

Backend API (FastAPI - Render)  

↓  

Database (SQLite)  

↓  

AI Model (scikit-learn)



\---



\## Components



\### 1. Frontend (React + Vite)



Responsibilities:

\- User interface

\- Authentication handling

\- Form submission (profile \& loan)

\- Dashboard rendering



Key Pages:

\- Home

\- Login / Register

\- Profile

\- Apply

\- Dashboard

\- Admin Panel



\---



\### 2. Backend (FastAPI)



Responsibilities:

\- API endpoints

\- Business logic

\- Authentication (JWT)

\- AI model integration

\- Admin decision handling



Key Modules:

\- `auth` → login, register

\- `profiles` → user financial data

\- `applications` → loan processing

\- `admin` → approval/rejection

\- `core` → config and security



\---



\### 3. Database (SQLite)



Stores:

\- Users

\- Profiles

\- Loan applications

\- Decisions



Why SQLite:

\- Lightweight

\- Easy deployment

\- Suitable for prototype



\---



\### 4. AI Model (scikit-learn)



Input features:

\- income

\- expenses

\- debt

\- employment duration

\- dependents



Output:

\- risk score (0–1)

\- recommendation

\- explanation



Model file:

backend/app/model/credit\_model.joblib



\---



\## Data Flow



1\. User registers/logs in

2\. User creates profile

3\. User submits loan application

4\. Backend sends data to AI model

5\. AI returns risk score + recommendation

6\. Admin reviews application

7\. Final decision stored

8\. User sees updated status



\---



\## API Design



\### Auth

\- POST /auth/register

\- POST /auth/login

\- GET /auth/me



\### Profiles

\- POST /profiles

\- GET /profiles/me



\### Applications

\- POST /applications

\- GET /applications/me



\### Admin

\- GET /admin/applications

\- PATCH /admin/applications/{id}/decision



\---



\## Security Design



\- JWT-based authentication

\- Password hashing (bcrypt)

\- Role-based access (user vs admin)

\- Protected routes (frontend + backend)



\---



\## Deployment Design



Frontend:

\- Hosted on Vercel



Backend:

\- Hosted on Render



CI/CD:

\- GitHub → automatic deployment



\---



\## Design Decisions



| Decision | Reason |

|--------|--------|

| FastAPI | Fast, modern Python API |

| React (Vite) | Lightweight and fast frontend |

| SQLite | Simple deployment |

| scikit-learn | Easy ML integration |

| Render + Vercel | Free tier cloud deployment |



\---



\## Limitations



\- No real-time updates

\- SQLite not scalable

\- Basic ML model

\- No external financial APIs



\---



\## Future Improvements



\- PostgreSQL database

\- WebSocket notifications

\- Advanced ML models

\- Credit bureau integration

\- Payment tracking system

