# Skillbridge

A full-stack career platform that lets developers build a public portfolio, manage job applications, store certificates, and use AI-powered tools for resume review, cover letter generation, skill gap analysis, interview prep, and career roadmaps.

---

## Tech Stack

**Frontend**

- Next.js 16 (App Router) with React 19
- TypeScript, Tailwind CSS v4
- Zustand for auth state, TanStack Query installed for server state
- React Hook Form with Zod validation
- @react-pdf/renderer for resume PDF generation
- Framer Motion for animations

**Backend**

- Express 5 with TypeScript
- Prisma 7 with PostgreSQL (via the `pg` driver adapter)
- JWT access tokens + HTTP-only refresh token cookies, with refresh token rotation
- Helmet, CORS, express-rate-limit for security hardening
- Multer for in-memory file uploads, Cloudinary for image storage
- Brevo (formerly Sendinblue) for transactional email
- Google Gemini (`gemini-flash-lite-latest`) via `@google/genai` for all AI features
- `pdf-parse` and `mammoth` for extracting text from uploaded resumes (PDF/DOCX)

---

## Features

**Auth**

- Email/password registration with deferred account creation. Signing up does not create a `User` row immediately — it creates a `VerificationToken` (type `PENDING_REGISTRATION`) holding the hashed password, email, username, and name. The actual `User` is only created once the verification link is clicked.
- GitHub OAuth for both login/registration and connecting an existing account (to import repos). The OAuth `state` parameter is the logged-in user's ID when connecting, or the string `"login"` for sign-in/sign-up.
- If GitHub doesn't expose a public email, the backend falls back to GitHub's `/user/emails` endpoint, and if no email is available at all, generates a placeholder address.
- Account auto-linking: if a GitHub login matches an existing account's email, the GitHub identity gets attached to that account instead of creating a duplicate.
- Refresh tokens are stored in the database and rotated on every use: each call to `/auth/refresh` deletes the old token and issues a new one, set as an `httpOnly` cookie.
- Forgot password and reset password flows via time-limited tokens (verification links expire in 24 hours, password reset links in 1 hour). Resetting a password logs the user out of all other sessions.
- Rate limiting: auth endpoints (10 req / 15 min), email-sending endpoints — resend verification, forgot password (5 req / hour), general API (300 req / 15 min).
- Note: access tokens issued by email/password login are signed with a 7-day expiry, while the GitHub OAuth flow issues a separate 15-minute access token. This is an inconsistency present in the current codebase rather than an intentional design difference.

**Portfolio**

- Public portfolio at `/:username`, visible only if the owner's email is verified and the portfolio is set to public (owners can still view their own private portfolio while logged in).
- Sections: bio/about, headline, location, website, phone, skills, education, experience, projects, and social links. Skills, projects, education, and social links support add/delete; experience additionally supports full updates.
- Accent color and theme fields exist on the portfolio model for customization.
- GitHub integration imports repositories (non-fork only) directly into the projects section; GitHub access tokens are encrypted at rest with AES-256-GCM before being stored.
- Portfolio view counts increment on each visit to `/:username`, except when the owner is viewing their own portfolio while authenticated.
- The frontend's `/api/revalidate-portfolio` Next.js route lets the dashboard trigger on-demand ISR revalidation of a public portfolio page right after an edit.

**Resume**

- Three downloadable PDF templates: ATS, Developer, and Student, rendered client-side with `@react-pdf/renderer` using the user's portfolio and certificate data.
- In-app previews of each template before downloading.

**AI Assistant**

All `/api/v1/ai/*` routes require authentication and call Google Gemini (`gemini-flash-lite-latest`), requesting structured JSON responses.

- **Resume Review** — upload a PDF or DOCX resume (text is extracted server-side); returns structured feedback for a selected template style (ATS, Student, or Developer).
- **Portfolio Review** — analyzes the logged-in user's existing portfolio data; requires at least some skills, projects, experience, or an "about" section to run.
- **Skill Gap Analysis** — takes a target role (required) and an optional job description, compares against the user's current portfolio skills.
- **Cover Letter Generator** — takes a company name and job description (minimum 50 characters); optionally accepts an uploaded resume file, otherwise falls back to summarizing the user's portfolio data automatically.
- **Career Roadmap** — takes current role, target role, and years of experience, plus the user's current skills, to produce a learning plan.
- **Interview Prep** — takes a target role and optional job description plus current skills to generate likely questions and suggested answers.

**Job Tracker**

- A list-based application tracker (company, role, status, applied date, notes).
- Valid statuses are fixed: `Applied`, `Screening`, `Interview`, `Offer`, `Rejected`.

**Certificates**

- Upload a certificate file (image, via Cloudinary) along with title, issuer, category, and an optional issue date.
- Certificates default to public (`isPublic: true`) and are never set otherwise by the current upload flow, though the field exists in the schema for future use.
- Supports listing and deleting; there is no update endpoint for an existing certificate.

**Settings**

- Update display name.
- Update username (3–20 characters, letters/numbers/underscores only); this changes the public portfolio URL.
- Change password — requires the current password, blocked for GitHub-only accounts with no password set, and invalidates all other active sessions on success.
- Toggle portfolio visibility (public/private).
- Delete account — requires password confirmation for accounts that have one (skipped for GitHub-only accounts); cascading deletes remove all related data (portfolio, certificates, applications, tokens, etc.).

---

## Project Structure

```
Skillbridge/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/       # Route handlers
│       ├── middleware/        # auth, rateLimit, upload
│       ├── prompts/           # Gemini prompt builders, one per AI feature
│       ├── routes/            # Express routers
│       ├── services/          # email, gemini, resume-parser
│       └── lib/               # prisma client, cloudinary, crypto
└── frontend/
    ├── app/
    │   ├── (auth)/            # login, register, verify-email, forgot/reset password
    │   ├── (dashboard)/       # protected app pages (sidebar layout)
    │   ├── [username]/        # public portfolio page
    │   ├── api/revalidate-portfolio/   # Next.js route for on-demand ISR
    │   └── auth/github-callback/       # client page that receives the OAuth token
    ├── components/
    │   ├── landing/           # Marketing page previews
    │   ├── portfolio/         # Portfolio section editors
    │   └── resume/            # PDF templates and previews
    └── lib/
        ├── api.ts             # Axios instance with token-refresh interceptor
        └── auth.ts            # Zustand auth store
```

---

## Environment Variables

**Backend** — create `backend/.env`:

```env
# Used by the runtime Prisma client (pg pool adapter)
DATABASE_URL=
# Used by Prisma CLI commands (migrate, studio, etc.) — typically the
# non-pooled/direct connection string from your Postgres provider
DIRECT_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

FRONTEND_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:5000/api/v1/github/callback

BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=SkillBridge

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

ENCRYPTION_KEY=    # exactly 64 hex characters (32 bytes) for AES-256-GCM GitHub token encryption
```

Note: the GitHub OAuth connect/callback handlers are registered under both `/api/v1/auth/github/*` and `/api/v1/github/*`. Either path works for `GITHUB_CALLBACK_URL`, but it must exactly match what's configured in your GitHub OAuth App settings.

**Frontend** — create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

`NEXT_PUBLIC_APP_URL` is used on the portfolio dashboard page to build and display the link to your public portfolio (e.g. `${NEXT_PUBLIC_APP_URL}/yourusername`).

---

## Getting Started

**Prerequisites:** Node.js 20+, PostgreSQL

**Backend**

```bash
cd backend
npm install
npx prisma db push
npm run dev        # tsx watch — runs on :5000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev        # Next.js dev server — runs on :3000
```

---

## Database Schema

Core models: `User`, `Portfolio`, `Skill`, `Education`, `Experience`, `Project`, `SocialLink`, `Certificate`, `Application`, `AnalyticsEvent`, `RefreshToken`, `VerificationToken`.

`VerificationToken` handles three distinct flows via its `type` field: `EMAIL_VERIFY`, `PASSWORD_RESET`, and `PENDING_REGISTRATION`. Pending registrations store the hashed password, email, username, and name directly on the token — the `User` row is only created once the token is consumed.

`AnalyticsEvent` exists in the schema and is read by the analytics endpoint, but nothing in the current codebase writes to it — portfolio view counts are tracked separately via `Portfolio.views`.

All related records cascade-delete when a `User` is deleted (`onDelete: Cascade` on every relation).

---

## API Overview

All routes are prefixed with `/api/v1`.

| Prefix           | Description                                                |
|------------------|-------------------------------------------------------------|
| `/auth`          | Register, login, logout, refresh, email verification, password reset, GitHub OAuth |
| `/portfolio`     | CRUD for portfolio and its nested sections, public portfolio lookup, view tracking |
| `/applications`  | Job application tracker                                     |
| `/analytics`     | Aggregated portfolio views, event count, and application stats |
| `/certificates`  | Certificate upload, listing, and deletion                   |
| `/github`        | GitHub connect/callback, repo listing, repo import           |
| `/settings`      | Profile, username, password, visibility, account deletion   |
| `/ai`            | Resume review, portfolio review, skill gap, cover letter, roadmap, interview prep |

`GET /health` (outside the `/api/v1` prefix) returns `{ success: true, message: "SkillBridge API is running" }` with no auth required.

---

## Author

Developed by Alen Andrei R. Amarante

Bachelor of Science in Information Technology

Polytechnic University of the Philippines – Santa Rosa Campus

---

## License

See `LICENSE.md`.