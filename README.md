<div align="center">

# PrepForward

**An adaptive SAT prep platform that learns where each student is weak and serves the questions that will move their score.**

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy_2-D71F00?style=flat&logo=sqlalchemy&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

[Live Demo](https://prepforwardlearning.vercel.app/) · [API Docs](https://https://prepforwardlearning.vercel.app/)

</div>

<img width="1266" height="815" alt="dashboardpage" src="https://github.com/user-attachments/assets/2d4bf453-3579-46f5-bae4-09c96a97e10d" />

---

## Overview

Most SAT prep tools hand every student the same question bank in the same order. PrepForward tracks mastery at the **subtopic** level (e.g. *Algebra → linear equations in two variables*) and uses that data to decide what each student sees next — harder questions where they're strong, more reps where they're struggling, and enough variety that they never stop seeing the full test.

It's a full-stack application I designed and built end to end: the adaptive question engine, the scoring model, the analytics pipeline, the student dashboard, and an admin tool that turns PDF question sets into structured, searchable data with OCR.

## Key Features

### For students
- **Adaptive practice sessions** — 10-question sets drawn from a pool weighted toward the student's current difficulty level for that subtopic.
- **Adaptive section quizzes** — full Math and Reading & Writing quizzes that mirror the official SAT topic distribution while biasing questions toward the student's weakest subtopics.
- **Placement assessments** — difficulty mix (beginner / intermediate / advanced) set from the student's starting score.
- **Progress dashboard** — topic mastery charts, score history histograms, strengths & weaknesses breakdown, and a login-streak calendar.
- **Achievements** — tiered (bronze / silver / gold) badges for streaks and milestones to keep students coming back.
- **Math rendering** — LaTeX via KaTeX for equations in questions and answer choices.

### For admins
- **PDF-to-question pipeline** — upload a PDF of SAT questions; the backend rasterizes pages, splits two-column layouts, crops individual question blocks, runs Tesseract OCR, and cleans the text.
- **Review & edit workflow** — extracted questions land in a staging layer where an admin corrects text, adds LaTeX, attaches images (hosted on Cloudinary), and tags topic/subtopic/difficulty before publishing.
- **Role-based access** — admin routes protected through Clerk user roles.

## How the Adaptive Engine Works

This is the core of the project. All logic lives in [`backend/app/domains/questions/services`](backend/app/domains/questions/services) and [`backend/app/domains/analytics/services`](backend/app/domains/analytics/services).

**1. Mastery → target difficulty.** Each subtopic has a 0–100 mastery score that maps to a target tier: `< 60 → easy`, `60–89 → medium`, `≥ 90 → hard`.

**2. Weighted sampling without replacement.** Every candidate question gets a weight based on its distance from the target tier (exact match `10`, one tier away `3`, two tiers `1`). Questions are drawn proportionally to weight, so the session leans toward the right level without becoming predictable.

**3. Adaptive / exploratory split.** Practice sessions are 80% adaptive and 20% random; quizzes are 60% adaptive within each topic's quota. Students keep encountering material outside their comfort zone, which also keeps mastery estimates honest.

**4. Weakness-first quizzes.** In quizzes, subtopic weight is `100 − mastery`, so the weakest areas surface most often — while per-topic quotas (e.g. Algebra 8, Advanced Math 7, Geometry & Trig 4, PSDA 3) keep the overall shape of a real SAT section.

**5. Graceful fallback.** If a subtopic doesn't have enough questions at the target difficulty, the engine falls back one tier easier, then backfills from the rest of the topic.

**6. Scoring that measures more than right/wrong.**
- **Difficulty-weighted points:** easy 2, medium 3, hard 5.
- **Attempt penalty:** full credit on the first try, then 50%, then 20%, and zero by the fourth attempt on multiple choice (since elimination guarantees the answer).
- **Time factor:** credit decays gradually once a student exceeds the expected time for that difficulty (45s / 75s / 100s), but never drops below 70% — slow-and-correct still counts.
- **Blended mastery updates:** new session results are blended with the stored score, with session influence growing as more answers accumulate and capped at 70% so one bad day can't erase prior progress.

## Architecture

```mermaid
flowchart LR
    U[Student / Admin] --> FE[Next.js 15 App Router<br/>React 19 · TypeScript · Tailwind]
    FE -- Clerk auth --> CL[(Clerk)]
    FE -- Route handlers proxy --> API[FastAPI backend]
    API --> ENG[Adaptive engine<br/>question selection · scoring]
    API --> OCR[PDF → OCR pipeline<br/>pdf2image · Tesseract]
    API --> DB[(PostgreSQL<br/>bronze · silver · gold)]
    OCR --> CDN[(Cloudinary<br/>question images)]
    API --> MAIL[Resend<br/>contact email]
```

- **Frontend:** Next.js App Router with route groups for `(marketing)`, `(auth)`, `dashboard`, and `admin`. Next.js route handlers in `app/api` act as a thin proxy to FastAPI, so the backend URL and secrets never reach the browser. Custom hooks keep data fetching out of components.
- **Backend:** FastAPI organized by **domain** (`students`, `questions`, `analytics`, `achievements`, `document_processing`, `admin`), each with its own routers, services, schemas, and models. Centralized exception handlers and a DB error context manager give consistent error responses.
- **Data:** PostgreSQL organized in a **medallion architecture** — `bronze` for raw inputs (OCR output, registrations, contact messages), `silver` for cleaned questions and per-question attempts, and `gold` for aggregated quiz and subtopic mastery analytics that power the dashboard.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Chart.js, TipTap (rich-text editor), KaTeX, Lottie |
| Backend | Python, FastAPI, Pydantic v2, SQLAlchemy 2, Uvicorn |
| Data | PostgreSQL (bronze / silver / gold schemas) |
| Document processing | pdf2image, Poppler, Tesseract (pytesseract), Pillow, NumPy |
| Services | Clerk (auth & roles), Cloudinary (images), Resend (email), Sentry (monitoring) |

## Project Structure

```
sat-website/
├── frontend/                 # Next.js app
│   ├── app/
│   │   ├── (marketing)/      # Landing, about, contact
│   │   ├── (auth)/           # Sign-in, sign-up, onboarding
│   │   ├── dashboard/        # Practice, quiz, progress, billing
│   │   ├── admin/            # Question upload, edit, search
│   │   └── api/              # Route handlers → FastAPI
│   ├── components/           # UI, progress charts, forms, navigation
│   ├── hooks/                # Data-fetching and state hooks
│   ├── services/             # Typed API clients
│   └── types/                # Shared TypeScript types
└── backend/
    └── app/
        ├── core/             # Config, database, logging
        └── domains/
            ├── questions/          # Adaptive selection engine
            ├── analytics/          # Grading, mastery, score history
            ├── achievements/       # Streaks and badges
            ├── document_processing/# PDF → OCR → structured questions
            ├── students/           # Registration and profiles
            └── admin/              # Contact / marketing
```

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL
- Tesseract and Poppler (for the admin PDF pipeline): `brew install tesseract poppler`
- Accounts for Clerk, Cloudinary, and Resend

### 1. Clone
```bash
git clone https://github.com/Chelsea3219/sat-website.git
cd sat-website
```

### 2. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/elevate
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
POPPLER_PATH=/opt/homebrew/bin
```

Run the API:
```bash
uvicorn app.main:app --reload
```
Interactive API docs are available at `http://localhost:8000/docs`.

### 3. Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Run the app:
```bash
npm run dev
```
Open `http://localhost:3000`.

## API Highlights

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/practice/fetch-questions/{clerk_id}/{subtopic}` | Build an adaptive practice set |
| `GET` | `/quiz/fetch-questions/{clerk_id}/{section}` | Build an adaptive section quiz |
| `POST` | `/practice/{subtopic}/grade-questions/{clerk_id}/{session_id}` | Score a practice session and update mastery |
| `POST` | `/quiz/{section}/grade-questions/{clerk_id}/{session_id}` | Score a quiz with topic / subtopic breakdown |
| `GET` | `/past-quiz-analytics/{clerk_id}` | Score history for the progress dashboard |
| `GET` | `/achievements/{clerk_id}` | Streaks and tiered badges |
| `POST` | `/extract-questions` | Admin: run OCR on an uploaded PDF |

Full reference at `/docs` when the backend is running.

## Roadmap
- [ ] Subscription billing for premium features
- [ ] Automated test suite (pytest + Playwright) and CI
- [ ] Deployment (Vercel + managed Postgres) with a public demo account
- [ ] Item-response-theory calibration of question difficulty from real attempt data
- [ ] Full-length timed practice tests

## About the Developer

Built by **Chelsea Zebaze**. I built PrepForward to combine full-stack engineering with data-driven personalization — designing the scoring model, the adaptive selection algorithm, and the data pipeline from scratch.

## Links
[LinkedIn](https://linkedin.com/in/chelsea-zebaze) · [Portfolio](https://zebaze-portfolio.vercel.app/) · [Email](chelseadonchi@gmail.com)

## License

Released under the [MIT License](LICENSE).
