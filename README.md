# VidyaSaathi — AI-Powered Personalized Learning Platform

> **SDG 4: Quality Education** — Built for rural students using IBM watsonx.ai (Granite LLM)

VidyaSaathi is a full-stack, AI-powered adaptive learning platform for rural Indian students. It personalises every student's study journey using IBM watsonx.ai Granite models, supports multilingual vernacular content (Hindi, Marathi, Bengali, Tamil, English), works in low-bandwidth/offline environments, and is designed for four distinct user roles.

---

## Project Overview

| Attribute | Details |
|---|---|
| **SDG Target** | SDG 4 — Quality Education |
| **AI Engine** | IBM watsonx.ai (Granite-13B) — with offline MockProvider fallback |
| **Supported Languages** | Hindi, English, Marathi, Bengali, Tamil |
| **Active Roles** | Student, Teacher, Parent/Guardian, Super Admin |
| **Backend** | FastAPI (Python 3.12) + SQLite |
| **Frontend** | React 18 + Vite 5 + TailwindCSS 3 |

---

## The Four Dashboards

| Role | Route | Description |
|---|---|---|
| **Student** | /student | Personalised study plan, AI doubt chat, adaptive quiz, progress tracker, revision, achievements |
| **Teacher** | /teacher-dashboard | Class management, analytics, AI question generator, lesson planner, assignments, at-risk student alerts |
| **Parent/Guardian** | /parent-dashboard | Child progress tracking, weekly activity charts, screen time control, study reminders |
| **Super Admin** | /super-admin-dashboard | Platform health KPIs, user & role management, AI token cost analytics, feature flags, audit logs |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create .env from example, then:

```bash
python seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend: http://localhost:8000
API Docs: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Student | aarav@vidyasaathi.in | password123 |
| Teacher | teacher@vidyasaathi.in | password123 |
| Parent | parent@vidyasaathi.in | password123 |
| Super Admin | admin@vidyasaathi.in | password123 |

---

## Tests

```bash
cd backend && python -m pytest -v
```

19 tests passing. 0 failures.

---

## Key Environment Variables (.env)

| Variable | Required | Description |
|---|---|---|
| SECRET_KEY | Yes | JWT signing secret |
| WATSONX_API_KEY | No | IBM watsonx.ai API key |
| WATSONX_PROJECT_ID | No | IBM watsonx project ID |
| WATSONX_URL | No | watsonx endpoint URL |

> Without watsonx credentials the system uses MockProvider (offline demo mode).

---

*Developed for IBM Internship — aligned with UN SDG 4: Quality Education*
