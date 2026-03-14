# Job‑Portal (Daily‑wise Documentation)

## Day 1 — Auth Service Base + Infrastructure
**Goal:** Auth service का बेस सेटअप, DB schema, Redis, Kafka producer.

**Highlights**
- Express app setup और JSON middleware.  
  [services/auth/src/app.ts](services/auth/src/app.ts)
- DB initialization (PostgreSQL via Neon) + `users`, `skills`, `user_skills` tables + `user_role` enum.  
  [services/auth/src/index.ts](services/auth/src/index.ts)
- Redis connection setup (`REDIS_URL`) for password‑reset token store.  
  [services/auth/src/index.ts](services/auth/src/index.ts)
- Kafka producer setup + `send-mail` topic creation.  
  [services/auth/src/producer.ts](services/auth/src/producer.ts)
- DB connector (`DB_URL`) wrapper.  
  [services/auth/src/utils/db.ts](services/auth/src/utils/db.ts)

**Key Components**
- `app` initialization: `express.json()` + routes mounting.
- `initDb()` bootstraps schema on startup.
- `connectKafka()` ensures topic exists before producing.

---

## Day 2 — Auth Features + File Upload + Error Handling
**Goal:** Register/Login/Forgot/Reset password flows और file upload handling.

**Highlights**
- Auth routes (register, login, forgot, reset).  
  [services/auth/src/routes/auth.ts](services/auth/src/routes/auth.ts)
- Controller logic for:
  - `registerUser` with role‑wise flow (jobseeker resume upload).  
    [services/auth/src/controllers/auth.ts](services/auth/src/controllers/auth.ts)
  - `loginUser` with password verification + JWT.  
    [services/auth/src/controllers/auth.ts](services/auth/src/controllers/auth.ts)
  - `forgotPassword` + Kafka email publish + Redis token store.  
    [services/auth/src/controllers/auth.ts](services/auth/src/controllers/auth.ts)
  - `resetPassword` with JWT validation + Redis token check.  
    [services/auth/src/controllers/auth.ts](services/auth/src/controllers/auth.ts)
- Multer in‑memory upload for resume file.  
  [services/auth/src/middleware/multer.ts](services/auth/src/middleware/multer.ts)
- File buffer conversion to Data URI for upload service.  
  [services/auth/src/utils/buffer.ts](services/auth/src/utils/buffer.ts)
- Centralized error handling wrapper `TryCatch`.  
  [services/auth/src/utils/TryCatch.ts](services/auth/src/utils/TryCatch.ts)
- Custom error class `ErrorHandler`.  
  [services/auth/src/utils/errorHandler.ts](services/auth/src/utils/errorHandler.ts)
- Password reset HTML template.  
  [services/auth/src/templete.ts](services/auth/src/templete.ts)

**Key Flows**
- **Register (jobseeker):** Multer file → Data URI → Upload service → DB insert → JWT.
- **Forgot Password:** JWT (15m) → Redis store (`forgot:<email>`) → Kafka `send-mail`.
- **Reset Password:** JWT verify + Redis token match → password update → Redis delete.

---

## Day 3 — Utils Service (Mail Consumer + File Upload API)
**Goal:** Kafka mail consumer + Cloudinary upload API.

**Highlights**
- Kafka consumer for `send-mail` topic.  
  [services/utils/src/consumer.ts](services/utils/src/consumer.ts)
- Nodemailer SMTP integration for sending emails.  
  [services/utils/src/consumer.ts](services/utils/src/consumer.ts)
- Cloudinary config + upload API.  
  [services/utils/src/index.ts](services/utils/src/index.ts)
- Upload route with `buffer` + optional `public_id` replace.  
  [services/utils/src/routes.ts](services/utils/src/routes.ts)

**Key Flow**
- **Send Mail:** Kafka message → Nodemailer SMTP → email sent.
- **Upload:** Client sends `buffer` → Cloudinary upload → URL returned.

---

## Day 4 — User Service Setup
**Goal:** User service ka base setup aur initial contents add karna.

**Highlights**
- User service scaffold kiya: Express app + routes + controllers + middleware + utils.  
  [services/user/src/index.ts](services/user/src/index.ts)
- Auth middleware `isAuth` add kiya jo JWT verify karke user profile fetch karta hai.  
  [services/user/src/middleware/auth.ts](services/user/src/middleware/auth.ts)
- `GET /api/user/me` endpoint add kiya.  
  [services/user/src/routes/user.ts](services/user/src/routes/user.ts)
- User service configs and scripts add kiye.  
  [services/user/package.json](services/user/package.json)
  [services/user/tsconfig.json](services/user/tsconfig.json)

**Notes**
- `services/user` ke liye `.env.example` add ho gaya hai, actual `.env` repo me nahi hai.  
  [services/user/.env.example](services/user/.env.example)

---

## Day 5 — User Profile CRUD Features
**Goal:** User service me complete profile management features add karna.

**Highlights**
- **Dependencies Update**: Axios aur its type definitions add kiye for HTTP communication.  
  [services/user/package.json](services/user/package.json)
  - Added: `axios@1.13.5` and `@types/axios@0.9.36`
- **Get User Profile by ID**: Kisi bhi user ka profile fetch karne ka endpoint.  
  [services/user/src/controllers/user.ts](services/user/src/controllers/user.ts)
  - `getUserProfile()` function with SQL query including user_skills and skills join
  - Aggregates skills array using `ARRAY_AGG`
  - 404 error handling if user not found
- **Update User Profile**: User apna basic info update kar sake.  
  [services/user/src/controllers/user.ts](services/user/src/controllers/user.ts)
  - `updateUserProfile()` updates name, phone_number, bio
  - Authenticated users only (via `isAuth` middleware)
- **Update Profile Picture**: User apni profile pic upload/replace kar sake.  
  [services/user/src/controllers/user.ts](services/user/src/controllers/user.ts)
  - `updateProfilePic()` uses multer for file upload
  - Converts file to buffer using `getBuffer()`
  - Sends buffer to utils service via axios POST to `/api/utils/upload`
  - Old profile pic replace ho jati hai (via `public_id`)
  - Updates DB with new URL and public_id
- **New Routes**: 3 new routes added.  
  [services/user/src/routes/user.ts](services/user/src/routes/user.ts)
  - `GET /:userId` - Get any user's profile (authenticated)
  - `PUT /update/profile` - Update own profile info (authenticated)
  - `PUT /update/pic` - Update profile picture (authenticated + multer)

**Key Flows**
- **Get User Profile**: Client sends userId → SQL query with joins → Returns user + skills array
- **Update Profile**: Client sends JSON → Validate auth → Update DB → Return updated fields
- **Update Profile Pic**: Client uploads file → Multer processes → Buffer conversion → Axios POST to utils service → Update DB with Cloudinary URL

**Technical Details**
- Axios configuration includes type safety with TypeScript generics
- Error handling via `ErrorHandler` for 400/401/404 scenarios
- All profile operations require JWT authentication
- Profile pic update integrates with existing utils/upload service

---

## Day 6 — Resume Upload + Skills Management (User Service)
**Goal:** User resume update aur complete skill management features.

**Highlights**
- **Update Resume**: User resume upload aur replace functionality complete.  
  [services/user/src/controllers/user.ts](services/user/src/controllers/user.ts)
  - `updateResume()` handles file upload via multer
  - Converts file to buffer aur sends to utils service
  - Old resume replace via `resume_public_id`
  - Returns updated user with new resume URL
- **Add Skill to User**: Complete transaction-based skill add flow.  
  [services/user/src/controllers/user.ts](services/user/src/controllers/user.ts)
  - `addSkillToUser()` validates skill name
  - SQL transaction: INSERT skill (ON CONFLICT update) + INSERT user_skills (ON CONFLICT do nothing)
  - Returns 200 if skill already exists, 201-like response if added
  - Proper COMMIT/ROLLBACK transaction handling
- **Delete Skill from User**: User skill removal capability.  
  [services/user/src/controllers/user.ts](services/user/src/controllers/user.ts)
  - `deleteSkillFromUser()` deletes from user_skills where skill name matches
  - Throws 404 if skill not found for user
- **Auth Middleware Fix**: Minor import cleanup (removed unused `e` variable).  
  [services/user/src/middleware/auth.ts](services/user/src/middleware/auth.ts)
- **New Routes**: 3 new endpoints wired.  
  [services/user/src/routes/user.ts](services/user/src/routes/user.ts)
  - `PUT /update/resume` - Upload/replace resume (authenticated + multer)
  - `POST /skill/add` - Add skill to user (authenticated, JSON body)
  - `DELETE /skill/delete` - Remove skill from user (authenticated, JSON body)

**Key Flows**
- **Update Resume**: Client uploads → Multer processes → Axios POST to utils service → DB update
- **Add Skill**: Skill name → Check user exists → Insert skill (or reuse) → Link to user_skills → Transaction commit
- **Delete Skill**: Skill name → DELETE from user_skills → Validate deletion → Return success message

**Technical Details**
- Transaction handling with `BEGIN`/`COMMIT`/`ROLLBACK` for data consistency
- `ON CONFLICT` clauses prevent duplicate skills + user_skill links
- `deleteSkillFromUser()` uses subquery to find skill_id by name
- All operations require JWT authentication

---

## Day 7 — Job Service Setup + DB Schema
**Goal:** Job service ka base setup aur database schema initialize karna.

**Highlights**
- New `services/job` scaffold: config files, scripts, and env example.  
  [services/job/package.json](services/job/package.json)  
  [services/job/tsconfig.json](services/job/tsconfig.json)  
  [services/job/.env.example](services/job/.env.example)
- Job service ignore rules (node_modules, dist, .env) add kiye.  
  [services/job/.gitignore](services/job/.gitignore)
- Express app setup + base routing for `/api/job`.  
  [services/job/src/app.ts](services/job/src/app.ts)
- Job service DB init with enums and tables.  
  [services/job/src/index.ts](services/job/src/index.ts)
  - Enums: `job_type`, `work_location`, `application_status`
  - Tables: `companies`, `jobs`, `applications`
- Shared utilities added (db, TryCatch, error handler, file buffer helper).  
  [services/job/src/utils/db.ts](services/job/src/utils/db.ts)  
  [services/job/src/utils/TryCatch.ts](services/job/src/utils/TryCatch.ts)  
  [services/job/src/utils/errorHandler.ts](services/job/src/utils/errorHandler.ts)  
  [services/job/src/utils/buffer.ts](services/job/src/utils/buffer.ts)
- Auth middleware and multer in-memory upload added.  
  [services/job/src/middleware/auth.ts](services/job/src/middleware/auth.ts)  
  [services/job/src/middleware/multer.ts](services/job/src/middleware/multer.ts)

**Key Flows**
- Service boot initializes DB schema before starting server.
- Auth middleware validates JWT and attaches user context.

---

## Day 8 — Job + Company APIs (Job Service)
**Goal:** Company and job management endpoints implement karna.

**Highlights**
- Company management endpoints (create, delete, list, details).  
  [services/job/src/controllers/job.ts](services/job/src/controllers/job.ts)
  - `createCompany()` recruiter-only with logo upload via utils service
  - `deleteCompany()` recruiter-only delete (company ownership check)
  - `getAllCompany()` lists recruiter companies
  - `getCompanyDetails()` returns company with jobs via JSON aggregate
- Job management endpoints (create, update, list, single).  
  [services/job/src/controllers/job.ts](services/job/src/controllers/job.ts)
  - `createJob()` recruiter-only, validates company ownership
  - `updateJob()` recruiter-only, ownership validation
  - `getAllActiveJobs()` public listing with title/location filters
  - `getSingleJob()` fetch by job id
- Job routes wired under `/api/job`.  
  [services/job/src/routes/job.ts](services/job/src/routes/job.ts)

**Key Flows**
- **Create Company**: Logo upload → utils upload API → company insert
- **Create Job**: Recruiter auth → company ownership check → job insert
- **List Jobs**: Public search via query filters + active jobs only

---

## Day 9 — Job Application Flow (User Service)
**Goal:** Jobseeker side se job apply karna aur apni applications dekhna.

**Highlights**
- User controller me job application features add kiye.  
  [services/user/src/controllers/user.ts](services/user/src/controllers/user.ts)
  - `applyForJob()` added with jobseeker-only guard
  - Resume-required validation before applying
  - Duplicate application handling (`23505` unique violation -> 409)
  - Subscription-based priority flag (`subscribed`) set at apply time
  - `getAllaplications()` added to list current user's applications with job details
- New user routes add kiye.  
  [services/user/src/routes/user.ts](services/user/src/routes/user.ts)
  - `POST /apply/job`
  - `GET /application/all`

**Key Flows**
- **Apply Job**: JWT auth -> role check (`jobseeker`) -> resume presence check -> job active check -> application insert.
- **List My Applications**: Authenticated user -> join `applications` + `jobs` -> all own applications return.

---

## Day 10 — Recruiter Application Management + Kafka Mail (Job Service)
**Goal:** Recruiter ko job applications manage karne aur status update par email trigger karne ka flow.

**Highlights**
- Job service me Kafka producer setup add kiya.  
  [services/job/src/producer.ts](services/job/src/producer.ts)
  - `connectKafka()` with `send-mail` topic ensure
  - `publishToTopic()` helper for async mail events
- Job service startup me Kafka connection initialize kiya.  
  [services/job/src/index.ts](services/job/src/index.ts)
- Application status mail template add kiya.  
  [services/job/src/template.ts](services/job/src/template.ts)
- Recruiter-side application APIs add kiye in job controller.  
  [services/job/src/controllers/job.ts](services/job/src/controllers/job.ts)
  - `getAllApplicationForJob()` recruiter-only + ownership check
  - `updateApplication()` recruiter-only status update + Kafka `send-mail` publish
- New job routes add kiye for application management.  
  [services/job/src/routes/job.ts](services/job/src/routes/job.ts)
  - `GET /application/:jobId`
  - `PUT /application/update/:id`
- Job service env example me Kafka broker variable add hua.  
  [services/job/.env.example](services/job/.env.example)

**Key Flows**
- **Recruiter View Applications**: Recruiter auth -> job ownership verify -> applications sorted by `subscribed DESC, applied_at ASC`.
- **Update Application Status**: Recruiter auth -> ownership verify -> status update -> Kafka event publish -> utils service sends email.

---

## Day 11 — AI Career Guidance + Resume ATS Analysis (Utils Service)
**Goal:** Utils service me Gemini AI based career and resume analysis endpoints add karna.

**Highlights**
- Utils service dependencies me Gemini SDK add kiya.  
  [services/utils/package.json](services/utils/package.json)
  - Added: `@google/genai`
- Utils env example me Gemini API key variable add hua.  
  [services/utils/.env.example](services/utils/.env.example)
  - Added: `API_KEY_GEMINI`
- Utils routes me AI endpoints implement kiye.  
  [services/utils/src/routes.ts](services/utils/src/routes.ts)
  - `POST /career` for skill-based career roadmap response in JSON
  - `POST /resume-analyser` for ATS score + suggestions from resume PDF
  - Response sanitization/parsing logic to convert AI output into strict JSON

**Key Flows**
- **Career Guidance**: Skills input -> Gemini prompt -> structured JSON parse -> career path response.
- **Resume Analysis**: PDF base64 input -> Gemini multimodal request -> ATS JSON response (score + improvements).

---

## Day 12 — Frontend Project Initialization (Next.js + shadcn/ui)
**Goal:** Job portal ka frontend project scaffold karna Next.js ke saath, theming aur UI component library setup karna.

**Highlights**
- Next.js 16.1.6 app created with TypeScript (`React 19.2.3`).  
  [frontend/package.json](frontend/package.json)
- Tailwind CSS v4 configured with `@tailwindcss/postcss`.  
  [frontend/postcss.config.mjs](frontend/postcss.config.mjs)
- shadcn/ui initialized — base component library using `radix-ui`, `clsx`, `class-variance-authority`, `tailwind-merge`.
- `next-themes` added for light/dark/system theme support.
- Global CSS setup with CSS variables (oklch color tokens) for light and dark modes.  
  [frontend/src/app/globals.css](frontend/src/app/globals.css)
- Utility function `cn()` created in `src/lib/utils.ts` (clsx + twMerge).  
  [frontend/src/lib/utils.ts](frontend/src/lib/utils.ts)
- `ThemeProvider` wrapper component created using `next-themes`.  
  [frontend/src/components/theme-provider.tsx](frontend/src/components/theme-provider.tsx)
- `ModeToggle` component created — dropdown with Light / Dark / System options.  
  [frontend/src/components/mode-toggle.tsx](frontend/src/components/mode-toggle.tsx)
- shadcn UI components added via CLI:
  - `Button` — variants: default, outline, secondary, ghost, destructive, link | sizes: default, sm, lg, icon, icon-sm, icon-lg, xs  
    [frontend/src/components/ui/button.tsx](frontend/src/components/ui/button.tsx)
  - `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarBadge`  
    [frontend/src/components/ui/avatar.tsx](frontend/src/components/ui/avatar.tsx)
  - `Popover`, `PopoverContent`, `PopoverTrigger`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`  
    [frontend/src/components/ui/popover.tsx](frontend/src/components/ui/popover.tsx)
- Root layout wraps entire app with `ThemeProvider` and `NavBar`.  
  [frontend/src/app/layout.tsx](frontend/src/app/layout.tsx)

**Key Flows**
- **Theme**: `ThemeProvider` (next-themes) → `ModeToggle` dropdown → class-based dark mode via `"use client"` + `useTheme()`.
- **Styling pipeline**: Tailwind CSS v4 → `@tailwindcss/postcss` → CSS variables (oklch) → shadcn token system → component classes via `cn()`.

---

## Day 13 — Responsive NavBar Component + DropdownMenu
**Goal:** Full site navigation bar banana jo desktop + mobile dono pe responsive ho, auth-aware ho, aur dark mode support kare.

**Highlights**
- `DropdownMenu` shadcn component added via CLI (`npx shadcn@latest add dropdown-menu`).  
  [frontend/src/components/ui/dropdown-menu.tsx](frontend/src/components/ui/dropdown-menu.tsx)
  - Components exported: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`, `DropdownMenuSub`, and more.
- `NavBar` component built — sticky, blurred, bordered top navigation.  
  [frontend/src/components/navbar.tsx](frontend/src/components/navbar.tsx)
  - **Logo**: "HireHeaven" with gradient blue/red styling.
  - **Desktop nav links**: Home (`/`), Jobs (`/jobs`), About (`/about`) using `Button` ghost variant.
  - **Auth-aware right side**:
    - Authenticated: `Avatar` with `Popover` showing user name, email, "My Profile" link, and "Logout" button.
    - Unauthenticated: "Sign In" button linking to `/login`.
  - **Mobile menu**: animated slide-in panel (`max-h` transition), hamburger icon (`Menu`) toggles to close (`X`). All nav links, profile, and logout replicated.
  - `ModeToggle` present in both desktop and mobile views.
  - `isAuth` and `logoutHandler` placeholders set for future Redux/context integration.
- Home page (`page.tsx`) scaffolded with a test `Button`.  
  [frontend/src/app/page.tsx](frontend/src/app/page.tsx)

**Key Flows**
- **Mobile toggle**: `toggleMenu()` → `isOpen` state → `max-h-96 / max-h-0` transition for smooth open/close.
- **Auth UI**: `isAuth` boolean → conditional render of Avatar+Popover (logged in) or Sign In button (logged out).
- **Theme toggle**: `ModeToggle` (DropdownMenu) → `setTheme("light"|"dark"|"system")` → `ThemeProvider` updates class on `<html>`.

---

## Day 14 — Services CORS + Route Access + Auth Flow Fixes
**Goal:** Services layer me cross-origin access aur route behavior ko frontend integration ke liye stabilize karna.

**Highlights**
- Auth service me `cors` middleware add kiya for browser requests.  
  [services/auth/src/app.ts](services/auth/src/app.ts)
- Job service me `cors` middleware add kiya for frontend API calls.  
  [services/job/src/app.ts](services/job/src/app.ts)
- User service me `cors` middleware add kiya and startup log cleanup.  
  [services/user/src/index.ts](services/user/src/index.ts)
- Auth dependencies update kiye (`cors`, `@types/cors`).  
  [services/auth/package.json](services/auth/package.json)
  [services/auth/package-lock.json](services/auth/package-lock.json)
- Auth register flow me upload endpoint path normalize kiya: `API` -> `api`.  
  [services/auth/src/controllers/auth.ts](services/auth/src/controllers/auth.ts)
- Login validation message update: generic required-fields response.  
  [services/auth/src/controllers/auth.ts](services/auth/src/controllers/auth.ts)
- Job routes me company details endpoint ko public access diya (`GET /company/:id` no auth middleware).  
  [services/job/src/routes/job.ts](services/job/src/routes/job.ts)
- Job routes ordering adjust kiya to keep static/public routes predictable (`/:jobId` placed after specific routes).  
  [services/job/src/routes/job.ts](services/job/src/routes/job.ts)
- Utils routes me unused `raw` import remove kiya.  
  [services/utils/src/routes.ts](services/utils/src/routes.ts)
- Auth Kafka producer me send/error logging formatting cleanup kiya (no behavior change).  
  [services/auth/src/producer.ts](services/auth/src/producer.ts)

**Key Outcomes**
- Frontend se Auth/Job/User services par direct requests ke liye CORS blockers remove hue.
- Company details endpoint unauthenticated users ke liye accessible hua (public job discovery flow).
- Auth-to-utils upload call path consistency improve hui (`/api/utils/upload`).

---

## API Endpoints Table

### Auth Service (Base: `/api/auth`)
| Method | Endpoint | Description | Body/Params | Notes |
| --- | --- | --- | --- | --- |
| POST | /register | User register | JSON + file (jobseeker) | `role` = `jobseeker` requires resume file field `file` |
| POST | /login | User login | JSON | Returns JWT + user data |
| POST | /forgot | Send reset link | JSON | Publishes Kafka message |
| POST | /reset/:token | Reset password | JSON + URL param | Token valid 15 min |

Source: [services/auth/src/routes/auth.ts](services/auth/src/routes/auth.ts)

### Utils Service (Base: `/api/utils`)
| Method | Endpoint | Description | Body | Notes |
| --- | --- | --- | --- | --- |
| POST | /upload | Upload/replace file | JSON | If `public_id` present, old file is deleted |
| POST | /career | AI career suggestion | JSON | Body: `{ skills: "..." }`, returns structured career roadmap |
| POST | /resume-analyser | AI ATS resume analysis | JSON | Body: `{ pdfBase64: "..." }`, returns score + suggestions |

Source: [services/utils/src/routes.ts](services/utils/src/routes.ts)

### User Service (Base: `/api/user`)
| Method | Endpoint | Description | Body/Params | Notes |
| --- | --- | --- | --- | --- |
| GET | /me | Get current user profile | Header | Requires `Authorization: Bearer <token>` |
| GET | /:userId | Get user profile by ID | URL param + Header | Requires auth, returns user with skills |
| PUT | /update/profile | Update user profile | JSON + Header | Updates name, phoneNumber, bio |
| PUT | /update/pic | Update profile picture | FormData + Header | Requires file upload via multer |
| PUT | /update/resume | Update resume | FormData + Header | Requires file upload via multer |
| POST | /skill/add | Add skill to user | JSON + Header | Body: `{ skillName: "..." }` |
| DELETE | /skill/delete | Remove skill from user | JSON + Header | Body: `{ skillName: "..." }` |
| POST | /apply/job | Apply for a job | JSON + Header | Jobseeker-only, requires uploaded resume |
| GET | /application/all | Get my applications | Header | Returns applicant's applied jobs list |

Source: [services/user/src/routes/user.ts](services/user/src/routes/user.ts)

### Job Service (Base: `/api/job`)
| Method | Endpoint | Description | Body/Params | Notes |
| --- | --- | --- | --- | --- |
| POST | /company/new | Create company | FormData + Header | Recruiter-only, logo file required |
| DELETE | /company/:companyId | Delete company | URL param + Header | Recruiter-only, ownership required |
| GET | /company/all | List recruiter companies | Header | Recruiter-only |
| GET | /company/:id | Company details + jobs | URL param | Includes jobs array |
| POST | /new | Create job | JSON + Header | Recruiter-only, company ownership required |
| PUT | /:jobId | Update job | JSON + Header | Recruiter-only, ownership required |
| GET | /all | List active jobs | Query params | Optional `title`, `location` filters |
| GET | /:jobId | Get single job | URL param | Public |
| GET | /application/:jobId | Get applications for a job | URL param + Header | Recruiter-only, job ownership required |
| PUT | /application/update/:id | Update application status | URL param + JSON + Header | Recruiter-only, triggers status email |

Source: [services/job/src/routes/job.ts](services/job/src/routes/job.ts)

---

## Setup/Run Steps

### Frontend
1. Navigate to `frontend/` directory.
2. Install dependencies: `npm install`.
3. Start dev server: `npm run dev` (runs on `http://localhost:3000`).

**Scripts**: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`  
Source: [frontend/package.json](frontend/package.json)

**Required**: Backend services running and accessible for API calls.

### Auth Service
1. Create .env using [services/auth/.env.example](services/auth/.env.example).
2. Install dependencies.
3. Build and start.

**Scripts**: `npm run build`, `npm run start`, `npm run dev`  
Source: [services/auth/package.json](services/auth/package.json)

### Utils Service
1. Create .env using [services/utils/.env.example](services/utils/.env.example).
2. Install dependencies.
3. Build and start.

**Scripts**: `npm run build`, `npm run start`, `npm run dev`  
Source: [services/utils/package.json](services/utils/package.json)

**Required Services**
- Kafka broker, Redis, Postgres/Neon, Cloudinary, SMTP

### User Service
1. Create .env (see Environment Variables Details).
2. Install dependencies.
3. Build and start.

**Scripts**: `npm run build`, `npm run start`, `npm run dev`  
Source: [services/user/package.json](services/user/package.json)

### Job Service
1. Create .env using [services/job/.env.example](services/job/.env.example).
2. Install dependencies.
3. Build and start.

**Scripts**: `npm run build`, `npm run start`, `npm run dev`  
Source: [services/job/package.json](services/job/package.json)

---

## Architecture Diagram (Text)

```
Browser (Next.js Frontend)
  |-- React 19 + TypeScript
  |-- Next.js 16 App Router
  |-- shadcn/ui (Tailwind CSS v4 + Radix UI)
  |-- next-themes (dark/light/system)
  |
  | HTTP /api/auth/*
  v
Auth Service (Express)
  |-- PostgreSQL (Neon)  [users, skills, user_skills]
  |-- Redis             [forgot:<email> token]
  |-- Kafka Producer    [send-mail]
  |
  | HTTP /api/utils/upload
  v
Utils Service (Express)
  |-- Cloudinary         [file storage]
  |-- Kafka Consumer     [send-mail]
  |-- SMTP (Nodemailer)  [email dispatch]
  |-- Gemini API         [career guidance + ATS analysis]

Browser (Next.js Frontend)
  |
  | HTTP /api/user/*
  v
User Service (Express)
  |-- PostgreSQL (Neon)  [users, skills, user_skills]
  |
  | HTTP /api/utils/upload
  v
Utils Service (Express)
  |-- Cloudinary         [profile pic storage]
  |-- Gemini API         [career guidance + ATS analysis]

Browser (Next.js Frontend)
  |
  | HTTP /api/job/*
  v
Job Service (Express)
  |-- PostgreSQL (Neon)  [companies, jobs, applications]
  |-- Kafka Producer     [send-mail on application status update]
  |
  | HTTP /api/utils/upload
  v
Utils Service (Express)
  |-- Cloudinary         [company logos]
  |-- Kafka Consumer     [send-mail]
  |-- SMTP (Nodemailer)  [status update email]
  |-- Gemini API         [career guidance + ATS analysis]
```

---

## Environment Variables Details

### Auth Service
Source: [services/auth/.env.example](services/auth/.env.example)

| Variable | Purpose |
| --- | --- |
| `PORT` | Service port |
| `DB_URL` | Neon/Postgres connection string |
| `UPLOAD_SERVICE` | Utils service base URL (for resume upload) |
| `JWT_SEC` | JWT secret key |
| `KAFKA_BROKER` | Kafka broker address |
| `FRONTEND_URL` | Frontend base URL (reset link) |
| `REDIS_URL` | Redis connection URL |

### Utils Service
Source: [services/utils/.env.example](services/utils/.env.example)

| Variable | Purpose |
| --- | --- |
| `PORT` | Service port |
| `CLOUD_NAME` | Cloudinary cloud name |
| `API_KEY` | Cloudinary API key |
| `API_SECRET` | Cloudinary API secret |
| `KAFKA_BROKER` | Kafka broker address (code uses `KAFKA_BROKER`) |
| `SMTP_USER` | SMTP user email |
| `SMTP_PASS` | SMTP password |
| `API_KEY_GEMINI` | Gemini API key for AI endpoints |

### User Service
Source: [services/user/.env.example](services/user/.env.example)

| Variable | Purpose |
| --- | --- |
| `PORT` | Service port |
| `DB_URL` | Neon/Postgres connection string |
| `JWT_SEC` | JWT secret key |
| `UPLOAD_SERVICE` | Utils service base URL (for profile pic upload) |

### Job Service
Source: [services/job/.env.example](services/job/.env.example)

| Variable | Purpose |
| --- | --- |
| `PORT` | Service port |
| `DB_URL` | Neon/Postgres connection string |
| `UPLOAD_SERVICE` | Utils service base URL (for company logo upload) |
| `JWT_SEC` | JWT secret key |
| `KAFKA_BROKER` | Kafka broker address |

---

## Sample Requests/Responses

### Register (Recruiter)
**Request**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Aman",
  "email": "aman@example.com",
  "password": "Pass@123",
  "phoneNumber": "9999999999",
  "role": "recruiter"
}
```

**Response**
```
{
  "message": "User registered successfully",
  "registeredUser": {
    "user_id": 1,
    "name": "Aman",
    "email": "aman@example.com",
    "phone_number": "9999999999",
    "role": "recruiter",
    "created_at": "2026-02-03T10:00:00.000Z"
  },
  "token": "<jwt>"
}
```

### Register (Jobseeker)
**Request**
```
POST /api/auth/register
Content-Type: multipart/form-data

Fields:
  name=Aman
  email=aman@example.com
  password=Pass@123
  phoneNumber=9999999999
  role=jobseeker
  bio=Frontend developer
  file=<resume.pdf>
```

### Login
**Request**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "aman@example.com",
  "password": "Pass@123"
}
```

**Response**
```
{
  "message": "User logged in successfully",
  "userObject": {
    "user_id": 1,
    "name": "Aman",
    "email": "aman@example.com",
    "phone_number": "9999999999",
    "role": "recruiter",
    "skills": []
  },
  "token": "<jwt>"
}
```

### Forgot Password
**Request**
```
POST /api/auth/forgot
Content-Type: application/json

{
  "email": "aman@example.com"
}
```

**Response**
```
{
  "message": "If a user with that email exists, a password reset link has been sent"
}
```

### Reset Password
**Request**
```
POST /api/auth/reset/:token
Content-Type: application/json

{
  "password": "NewPass@123"
}
```

**Response**
```
{
  "message": "Password has been reset successfully"
}
```

### Upload (Utils Service)
**Request**
```
POST /api/utils/upload
Content-Type: application/json

{
  "buffer": "data:application/pdf;base64,JVBERi0xLjQK...",
  "public_id": "optional-existing-id"
}
```

**Response**
```
{
  "url": "https://res.cloudinary.com/.../file.pdf",
  "public_id": "abc123"
}
```

### Career Guidance (Utils Service)
**Request**
```
POST /api/utils/career
Content-Type: application/json

{
  "skills": "React, Node.js, TypeScript, PostgreSQL"
}
```

**Response**
```
{
  "summary": "You are well-suited for modern full-stack product development roles.",
  "jobOptions": [
    {
      "title": "Full Stack Developer",
      "responsibilities": "Build and maintain frontend and backend features.",
      "why": "Your current stack aligns with production full-stack requirements."
    }
  ],
  "skillsToLearn": [
    {
      "category": "DevOps & Cloud",
      "skills": [
        {
          "title": "Docker",
          "why": "Helps with consistent deployment across environments.",
          "how": "Containerize a Node + Postgres project and deploy it."
        }
      ]
    }
  ],
  "learningApproach": {
    "title": "How to Approach Learning",
    "points": ["Build projects", "Follow roadmap", "Practice interviews"]
  }
}
```

### Resume Analyser (Utils Service)
**Request**
```
POST /api/utils/resume-analyser
Content-Type: application/json

{
  "pdfBase64": "data:application/pdf;base64,JVBERi0xLjQK..."
}
```

**Response**
```
{
  "atsScore": 82,
  "scoreBreakdown": {
    "formatting": { "score": 85, "feedback": "Formatting is mostly ATS-friendly." },
    "keywords": { "score": 78, "feedback": "Add more role-specific keywords." },
    "structure": { "score": 84, "feedback": "Sections are well organized." },
    "readability": { "score": 81, "feedback": "Use more measurable outcomes." }
  },
  "suggestions": [
    {
      "category": "Keywords",
      "issue": "Missing exact job keywords",
      "recommendation": "Mirror target JD keywords in skills and experience",
      "priority": "high"
    }
  ],
  "strengths": ["Clear section structure", "Relevant project experience"],
  "summary": "Resume is solid and can improve further with stronger keyword matching."
}
```

### My Profile (User Service)
**Request**
```
GET /api/user/me
Authorization: Bearer <jwt>
```

**Response**
```
{
  "user_id": 1,
  "name": "Aman",
  "email": "aman@example.com",
  "phone_number": "9999999999",
  "role": "recruiter",
  "bio": null,
  "resume": null,
  "profile_pic": null,
  "skills": []
}
```

### Get User Profile by ID (User Service)
**Request**
```
GET /api/user/:userId
Authorization: Bearer <jwt>
```

**Response**
```
{
  "user_id": 2,
  "name": "Rahul",
  "email": "rahul@example.com",
  "phone_number": "8888888888",
  "role": "jobseeker",
  "bio": "Full stack developer",
  "resume": "https://res.cloudinary.com/.../resume.pdf",
  "resume_public_id": "resume_abc123",
  "profile_pic": "https://res.cloudinary.com/.../pic.jpg",
  "profile_pic_public_id": "pic_xyz789",
  "subscription": null,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### Update User Profile (User Service)
**Request**
```
PUT /api/user/update/profile
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "Aman Kumar",
  "phoneNumber": "9999999990",
  "bio": "Senior recruiter with 5 years experience"
}
```

**Response**
```
{
  "message": "Profile updated successfully",
  "updatedUser": {
    "user_id": 1,
    "name": "Aman Kumar",
    "phone_number": "9999999990",
    "bio": "Senior recruiter with 5 years experience"
  }
}
```

### Update Profile Picture (User Service)
**Request**
```
PUT /api/user/update/pic
Authorization: Bearer <jwt>
Content-Type: multipart/form-data

Fields:
  file=<profile-pic.jpg>
```

**Response**
```
{
  "message": "Profile picture updated successfully",
  "updatedUser": {
    "user_id": 1,
    "name": "Aman Kumar",
    "profile_pic": "https://res.cloudinary.com/.../new-pic.jpg"
  }
}
```

### Update Resume (User Service)
**Request**
```
PUT /api/user/update/resume
Authorization: Bearer <jwt>
Content-Type: multipart/form-data

Fields:
  file=<resume.pdf>
```

**Response**
```
{
  "message": "Resume updated successfully",
  "updatedUser": {
    "user_id": 2,
    "name": "Rahul",
    "resume": "https://res.cloudinary.com/.../new-resume.pdf"
  }
}
```

### Add Skill (User Service)
**Request**
```
POST /api/user/skill/add
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "skillName": "Python"
}
```

**Response** (New Skill)
```
{
  "message": "Skill Python added to user successfully"
}
```

**Response** (Skill Already Exists)
```
{
  "message": "User already has this skill"
}
```

### Delete Skill (User Service)
**Request**
```
DELETE /api/user/skill/delete
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "skillName": "Python"
}
```

**Response**
```
{
  "message": "Skill Python deleted successfully"
}
```

### Create Company (Job Service)
**Request**
```
POST /api/job/company/new
Authorization: Bearer <jwt>
Content-Type: multipart/form-data

Fields:
  name=Acme Corp
  description=Hiring platform for engineers
  website=https://acme.example
  file=<logo.png>
```

**Response**
```
{
  "message": "Company created successfully",
  "company": {
    "company_id": 1,
    "name": "Acme Corp",
    "logo": "https://res.cloudinary.com/.../logo.png",
    "logo_public_id": "company_logo_123"
  }
}
```

### Create Job (Job Service)
**Request**
```
POST /api/job/new
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "title": "Frontend Engineer",
  "description": "Build user-facing features",
  "salary": 120000,
  "location": "Bengaluru",
  "job_type": "Full-time",
  "openings": 2,
  "role": "Frontend",
  "work_location": "Hybrid",
  "company_id": 1
}
```

**Response**
```
{
  "message": "Job created successfully",
  "job": {
    "job_id": 10,
    "title": "Frontend Engineer",
    "company_id": 1
  }
}
```

### Get Company Details (Job Service)
**Request**
```
GET /api/job/company/1
```

**Response**
```
{
  "company_id": 1,
  "name": "Acme Corp",
  "website": "https://acme.example",
  "jobs": [
    {
      "job_id": 10,
      "title": "Frontend Engineer"
    }
  ]
}
```

### List Recruiter Companies (Job Service)
**Request**
```
GET /api/job/company/all
Authorization: Bearer <jwt>
```

**Response**
```
[
  {
    "company_id": 1,
    "name": "Acme Corp",
    "website": "https://acme.example"
  }
]
```

### List Active Jobs (Job Service)
**Request**
```
GET /api/job/all?title=frontend&location=bengaluru
```

**Response**
```
[
  {
    "job_id": 10,
    "title": "Frontend Engineer",
    "company_name": "Acme Corp",
    "location": "Bengaluru"
  }
]
```

### Get Single Job (Job Service)
**Request**
```
GET /api/job/10
```

**Response**
```
{
  "job_id": 10,
  "title": "Frontend Engineer",
  "company_id": 1
}
```

### Update Job (Job Service)
**Request**
```
PUT /api/job/10
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "title": "Frontend Engineer II",
  "description": "Build user-facing features",
  "salary": 140000,
  "location": "Bengaluru",
  "job_type": "Full-time",
  "openings": 1,
  "role": "Frontend",
  "work_location": "Hybrid",
  "company_id": 1,
  "is_active": true
}
```

**Response**
```
{
  "message": "Job updated successfully",
  "job": {
    "job_id": 10,
    "title": "Frontend Engineer II"
  }
}
```

### Delete Company (Job Service)
**Request**
```
DELETE /api/job/company/1
Authorization: Bearer <jwt>
```

**Response**
```
{
  "message": "Company and all associated data deleted successfully"
}
```

### Apply for Job (User Service)
**Request**
```
POST /api/user/apply/job
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "job_id": 10
}
```

**Response**
```
{
  "message": "Application submitted successfully",
  "application": {
    "application_id": 21,
    "job_id": 10,
    "applicant_id": 2,
    "status": "Submitted"
  }
}
```

### Get My Applications (User Service)
**Request**
```
GET /api/user/application/all
Authorization: Bearer <jwt>
```

**Response**
```
[
  {
    "application_id": 21,
    "job_id": 10,
    "status": "Submitted",
    "job_title": "Frontend Engineer",
    "job_salary": 120000,
    "job_location": "Bengaluru"
  }
]
```

### Get Applications For Job (Job Service)
**Request**
```
GET /api/job/application/10
Authorization: Bearer <jwt>
```

**Response**
```
[
  {
    "application_id": 21,
    "job_id": 10,
    "applicant_id": 2,
    "applicant_email": "rahul@example.com",
    "status": "Submitted",
    "subscribed": true
  }
]
```

### Update Application Status (Job Service)
**Request**
```
PUT /api/job/application/update/21
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "status": "Hired"
}
```

**Response**
```
{
  "message": "Application status updated successfully",
  "job": {
    "title": "Frontend Engineer"
  },
  "updatedApplication": {
    "application_id": 21,
    "status": "Hired"
  }
}
```

---

## Tech Stack Summary
- **Node.js + Express + TypeScript** (`express`, `typescript`)
- **PostgreSQL (Neon)** (`@neondatabase/serverless`)
- **Redis** (`redis`)
- **Kafka** (`kafkajs`)
- **Cloudinary** (`cloudinary`)
- **Google Gemini API** (`@google/genai`)
- **Nodemailer** (`nodemailer`)
- **Multer + DataURI** (`multer`, `datauri`)
- **JWT + bcrypt** (`jsonwebtoken`, `bcrypt`)
- **Axios** (`axios`) - HTTP client for inter-service communication
- **Next.js + React** (`next`, `react`, `react-dom`) - Frontend framework
- **shadcn/ui + Radix UI** (`shadcn`, `radix-ui`) - Accessible UI component library
- **Tailwind CSS v4** (`tailwindcss`, `@tailwindcss/postcss`) - Utility-first styling
- **next-themes** (`next-themes`) - Dark/light/system theme management
- **Lucide React** (`lucide-react`) - Icon library
- **clsx + tailwind-merge** (`clsx`, `tailwind-merge`) - Conditional class utilities
- **class-variance-authority** (`class-variance-authority`) - Component variant system
