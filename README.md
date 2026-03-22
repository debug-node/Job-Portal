# Job Portal

A microservices-based job portal application built with Node.js, Express, TypeScript, Redis, and Bull Queue for real-time async processing.

## 📋 Project Overview

Job Portal is a modern job marketplace platform with a microservices architecture consisting of:

- **Auth Service**: User authentication, registration, password management, and JWT-based security
- **User Service**: User profile management and protected profile endpoint
- **Utils Service**: Shared utilities including email notifications, file uploads, and AI-based career/resume analysis
- **Job Service**: Company and job management for recruiters and public job listings
- **Payment Service**: Subscription checkout and Razorpay payment verification with JWT-protected endpoints
- **Frontend**: Next.js 16 + React 19 client-side application with shadcn/ui, Tailwind CSS v4, and dark mode support
   - Auth flows, jobs browsing, company profile, account dashboard, subscribe/payment success journey
   - Shared React context and centralized app-level type definitions

## 🏗️ Architecture

### Technology Stack

**Backend Services:**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.2.1
- **Authentication**: JWT (jsonwebtoken)
- **Database**: PostgreSQL (Neon Serverless)
- **Caching & Job Queue**: Redis + Bull Queue (async email processing)
- **File Upload**: Cloudinary + DataURI
- **Email**: Nodemailer
- **Password Hashing**: bcrypt
- **File Handling**: Multer
- **AI**: Google Gemini API (`@google/genai`)
- **Payments**: Razorpay

**Frontend:**
- **Framework**: Next.js 16.1.6 + React 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Theming**: next-themes (dark/light/system)
- **Icons**: Lucide React

**Development Tools:**
- TypeScript 5.9.3
- Nodemon (hot reload)
- Concurrently (run multiple processes)

## 📁 Project Structure

```
Job-Portal/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx   # Root layout with ThemeProvider + NavBar
│   │   │   ├── page.tsx     # Home page
│   │   │   └── globals.css  # Tailwind + shadcn CSS variables
│   │   ├── components/
│   │   │   ├── navbar.tsx   # Responsive nav (desktop + mobile)
│   │   │   ├── mode-toggle.tsx # Dark/light/system switcher
│   │   │   ├── theme-provider.tsx # next-themes wrapper
│   │   │   └── ui/          # shadcn/ui components
│   │   │       ├── button.tsx
│   │   │       ├── avatar.tsx
│   │   │       ├── popover.tsx
│   │   │       └── dropdown-menu.tsx
│   │   └── lib/
│   │       └── utils.ts     # cn() utility (clsx + tailwind-merge)
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── services/
│   ├── auth/                # Authentication microservice
│   │   ├── src/
│   │   │   ├── app.ts       # Express app setup
│   │   │   ├── index.ts     # Server entry point
│   │   │   ├── producer.ts  # Bull Queue publisher
│   │   │   ├── templete.ts  # Email templates
│   │   │   ├── controllers/
│   │   │   │   └── auth.ts  # Auth logic
│   │   │   ├── middleware/
│   │   │   │   └── multer.ts # File upload middleware
│   │   │   ├── routes/
│   │   │   │   └── auth.ts  # Auth endpoints
│   │   │   └── utils/
│   │   │       ├── buffer.ts
│   │   │       ├── db.ts    # Database connector
│   │   │       ├── errorHandler.ts
│   │   │       └── TryCatch.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── user/                # User service
│   │   ├── src/
│   │   │   ├── index.ts     # Server entry point
│   │   │   ├── controllers/
│   │   │   │   └── user.ts  # User profile logic
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts  # JWT auth middleware
│   │   │   │   └── multer.ts
│   │   │   ├── routes/
│   │   │   │   └── user.ts  # User endpoints
│   │   │   └── utils/
│   │   │       ├── buffer.ts
│   │   │       ├── db.ts
│   │   │       ├── errorHandler.ts
│   │   │       └── TryCatch.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── utils/               # Utility microservice
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── consumer.ts  # Bull Queue consumer
│   │   │   └── routes.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── job/                 # Job service
│   │   ├── src/
│   │   │   ├── app.ts       # Express app setup
│   │   │   ├── index.ts     # Server entry point + DB init
│   │   │   ├── producer.ts  # Bull Queue publisher
│   │   │   ├── template.ts  # Email templates
│   │   │   ├── controllers/
│   │   │   │   └── job.ts   # Company + job logic
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts  # JWT auth middleware
│   │   │   │   └── multer.ts
│   │   │   ├── routes/
│   │   │   │   └── job.ts   # Job endpoints
│   │   │   └── utils/
│   │   │       ├── buffer.ts
│   │   │       ├── db.ts
│   │   │       ├── errorHandler.ts
│   │   │       └── TryCatch.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── payment/             # Payment service
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── controllers/
│   │   │   │   └── payment.ts
│   │   │   ├── middlewares/
│   │   │   │   └── auth.ts
│   │   │   ├── routes/
│   │   │   │   └── payment.ts
│   │   │   └── utils/
│   │   │       ├── db.ts
│   │   │       ├── errorHandler.ts
│   │   │       └── TryCatch.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── package.json (if applicable)
│
├── daily-documentation.md   # Development progress tracking
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- PostgreSQL (Neon)
- Redis
- Redis URL (local Redis or Upstash)
- Cloudinary account
- Email service credentials
- Razorpay account (Key ID + Secret)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Job-Portal
   ```

2. **Install Frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Auth Service**
   ```bash
   cd services/auth
   npm install
   ```

4. **Install Utils Service**
   ```bash
   cd services/utils
   npm install
   ```

5. **Install User Service**
   ```bash
   cd services/user
   npm install
   ```

6. **Install Job Service**
   ```bash
   cd services/job
   npm install
   ```

7. **Install Payment Service**
   ```bash
   cd services/payment
   npm install
   ```

8. **Setup Environment Variables**
   
   Create `.env` files in each service directory:
   
   **services/auth/.env**
   ```
   DB_URL=postgresql://...
   REDIS_URL=redis://...
   JWT_SEC=your_jwt_secret
   UPLOAD_SERVICE=http://localhost:5001
   ```
   
   **services/utils/.env**
   ```
   PORT=5001
   REDIS_URL=redis://...
   CLOUD_NAME=...
   API_KEY=...
   API_SECRET=...
   SMTP_USER=...
   SMTP_PASS=...
   API_KEY_GEMINI=...
   ```

   **services/user/.env**
   ```
   PORT=5002
   DB_URL=postgresql://...
   JWT_SEC=your_jwt_secret
   UPLOAD_SERVICE=http://localhost:5001
   ```

   **services/job/.env**
   ```
   PORT=5003
   DB_URL=postgresql://...
   JWT_SEC=your_jwt_secret
   UPLOAD_SERVICE=http://localhost:5001
   REDIS_URL=redis://...
   ```

   **services/payment/.env**
   ```
   PORT=5004
   Razorpay_Key=your_razorpay_key
   Razorpay_Secret=your_razorpay_secret
   DB_URL=postgresql://...
   JWT_SEC=your_jwt_secret
   ```

### Running Services

**Development Mode:**

Frontend:
```bash
cd frontend
npm run dev
```

Auth Service:
```bash
cd services/auth
npm run dev
```

Utils Service:
```bash
cd services/utils
npm run dev
```

User Service:
```bash
cd services/user
npm run dev
```

Job Service:
```bash
cd services/job
npm run dev
```

Payment Service:
```bash
cd services/payment
npm run dev
```

**Production Build:**

Run these inside the specific project you want to build, for example:

```bash
cd frontend
npm run build
npm start
```

## 🔑 Key Features

### Recent Service Updates
- CORS enabled in Auth, User, and Job services for frontend/browser integration.
- Auth service now uses the normalized upload endpoint path: `/api/utils/upload`.
- Job service endpoint `GET /api/job/company/:id` is public (no auth required).
- Auth and Job services now use Bull Queue (Redis) for async email job processing with retry logic.
- Queue lifecycle naming cleaned up for clarity: `connectKafka` renamed to `initEmailQueue` in Auth/Job services.
- Queue shutdown helper naming normalized from `disconnectKafka` to `closeQueue`.
- Utils service Bull Queue consumer handles email dispatch with 3 attempts, exponential backoff, and graceful error handling.
- Email queuing is non-blocking: immediate return after job add to queue.
- Auth middleware error logs improved in Job and Payment services with scoped `console.error` messages.
- User auth middleware updated with empty-token guard and improved JWT error logging.
- New payment service added with Razorpay checkout and verification endpoints.
- Kafka infrastructure removed in favor of simpler Redis + Bull Queue async pattern.

### Recent Frontend Updates
- Core route coverage completed:
   - Home, About, Auth (login/register/forgot/reset)
   - Jobs listing + single job details
   - Company details
   - Account dashboard + profile sub-sections
   - Subscribe and payment success flow
- Reusable feature components integrated:
   - hero, job-card, loading, career-guide, resume-analyser, scriptLoader
- Shared app architecture stabilized:
   - global context state management via `AppContext`
   - centralized frontend contracts in `type.ts`
- UI system expanded and normalized:
   - button, avatar, popover, dropdown-menu
   - card, dialog, input, label, select
- Branding/static assets integrated for polished UI surfaces:
   - hero, about, and user profile images
- Subscription page now uses env-driven Razorpay key (`NEXT_PUBLIC_RAZORPAY_KEY`).
- Razorpay script loader improved with explicit error handling/retry-safe behavior.
- Account subscription status memoization now includes explicit lint-safe handling for time-based `Date.now()` checks.

### Frontend Performance Optimizations
- Image rendering optimized with Next.js `Image` and lazy loading in list-heavy UI.
- Pagination added for large lists (applied jobs and recruiter-side job applications).
- Debounced interactions used for search/filter behavior to reduce API thrashing.
- Lazy loading and code-splitting utilities added for heavy/secondary components.
- Overall frontend interaction flow improved for faster render, lower DOM load, and smoother UX.

### Auth Service
- User registration with email verification
- Login with JWT token generation
- Forgot password with email reset link (via Bull Queue async job)
- Password reset functionality
- Profile file upload (avatar/resume)
- CORS enabled for cross-origin frontend requests
- bcrypt password hashing
- Multer file upload handling
- Bull Queue for non-blocking email job queueing

### Utils Service
- Bull Queue consumer for async email job processing
- Nodemailer email dispatch with SMTP (Gmail)
- Cloudinary file storage
- Email template system
- AI career guidance from skill input
- AI resume ATS analysis from PDF base64 input

### User Service
- JWT-protected profile endpoints
- Auth middleware for user context
- CORS enabled for cross-origin frontend requests
- Get user profile by ID
- Update user profile (name, phone, bio)
- Update profile picture with file upload
- Update resume with file upload
- Add/remove user skills with transaction handling
- Apply to jobs (jobseeker only)
- View all applied jobs with job details
- Axios integration for inter-service communication (utils service)

### Job Service
- Recruiter-only company management
- Public company details endpoint (`GET /api/job/company/:id`)
- Recruiter-only job posting and updates
- Public job listing with title/location filters
- Company logo upload via utils service
- Recruiter-side application listing per job
- Recruiter-side application status updates with email notification trigger

### Payment Service
- JWT-protected payment endpoints
- Razorpay order creation for subscription checkout
- Signature verification for payment authenticity
- Subscription expiry update (30-day extension) on successful verification

### Database
- PostgreSQL with Neon serverless
- Tables: `users`, `skills`, `user_skills`, `companies`, `jobs`, `applications`
- Enums: `user_role`, `job_type`, `work_location`, `application_status`

### Message Queue
- Bull Queue + Redis for async communication
- Queue: `send-mail` (event-driven email notifications)

## 📝 API Endpoints

### Utils Routes (`/api/utils`)
- `POST /upload` - Upload/replace file
- `POST /career` - Generate AI career path from skills
- `POST /resume-analyser` - Analyze ATS score and improvement suggestions

### Auth Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /forgot` - Request password reset
- `POST /reset/:token` - Reset password
- File upload endpoints for profile management

### User Routes (`/api/user`)
- `GET /me` - Get current user profile (requires `Authorization: Bearer <token>`)
- `GET /:userId` - Get any user's profile by ID (requires auth)
- `PUT /update/profile` - Update user profile info (name, phone, bio)
- `PUT /update/pic` - Update profile picture (requires file upload)
- `PUT /update/resume` - Update resume (requires file upload)
- `POST /skill/add` - Add skill to user profile
- `DELETE /skill/delete` - Remove skill from user profile
- `POST /apply/job` - Apply for a job (jobseeker-only)
- `GET /application/all` - Get logged-in user's applications

### Job Routes (`/api/job`)
- `POST /company/new` - Create company (recruiter-only, logo upload)
- `DELETE /company/:companyId` - Delete company (recruiter-only)
- `GET /company/all` - List recruiter companies (recruiter-only)
- `GET /company/:id` - Get company details + jobs
- `POST /new` - Create job (recruiter-only)
- `PUT /:jobId` - Update job (recruiter-only)
- `GET /all` - List active jobs (public, filters: `title`, `location`)
- `GET /application/:jobId` - Get all applications for a job (recruiter-only)
- `PUT /application/update/:id` - Update application status (recruiter-only)
- `GET /:jobId` - Get single job (public)

### Payment Routes (`/api/payment`)
- `POST /checkout` - Create Razorpay order for authenticated user
- `POST /verify` - Verify Razorpay signature and activate/extend subscription

## 🔄 Service Communication

The microservices communicate via:
- **Bull Queue + Redis**: Async job-based messaging for email events (non-blocking pub-sub pattern)
- **HTTP/REST**: Synchronous service-to-service calls via Axios
- **External AI API**: Utils service calls Gemini for career and ATS analysis
- **Payment Gateway API**: Payment service integrates with Razorpay for checkout and verification
- **Redis**: Job queue storage with TLS support for Upstash serverless

## 📚 Documentation

See [daily-documentation.md](daily-documentation.md) for detailed day-by-day development progress and implementation details.

## 🛠️ Scripts

**Frontend:**
- `npm run dev` - Start Next.js dev server (http://localhost:3000)
- `npm run build` - Create production build
- `npm start` - Run production server
- `npm run lint` - Run ESLint

**Auth Service:**
- `npm run dev` - Start in development mode with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm test` - Run tests

**Utils Service:**
- `npm run dev` - Start in development mode
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm test` - Run tests

**User Service:**
- `npm run dev` - Start in development mode
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm test` - Run tests

**Job Service:**
- `npm run dev` - Start in development mode
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm test` - Run tests

**Payment Service:**
- `npm run dev` - Start in development mode
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm test` - Run tests

## 📦 Dependencies Overview

### Frontend
- Next.js 16.1.6 - React framework with App Router
- React 19.2.3 - UI library
- shadcn 4.0.5 - UI component CLI + base styles
- radix-ui 1.4.3 - Accessible headless UI primitives
- Tailwind CSS 4 - Utility-first CSS framework
- next-themes 0.4.6 - Dark/light/system theme management
- lucide-react 0.577.0 - Icon library
- class-variance-authority 0.7.1 - Component variant system
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.5.0 - Tailwind class conflict resolver
- tw-animate-css 1.4.0 - Animation utilities

### Auth Service
- Express 5.2.1 - Web framework
- Bull 4.11.5 - Job queue library
- Redis 5.10.0 - Caching and queue connectivity
- jsonwebtoken 9.0.3 - JWT token handling
- bcrypt 6.0.0 - Password hashing
- Multer 2.0.2 - File upload handling
- Axios 1.13.2 - HTTP client

### Utils Service
- Express 5.2.1 - Web framework
- Bull 4.11.5 - Job queue library
- Redis 5.10.0 - Redis client for Bull Queue
- Cloudinary 2.8.0 - File storage
- @google/genai 1.44.0 - Gemini AI integration
- Nodemailer 8.0.2 - Email service
- CORS 2.8.5 - Cross-Origin Resource Sharing

### User Service
- Express 5.2.1 - Web framework
- jsonwebtoken 9.0.3 - JWT token handling
- Multer 2.0.2 - File upload handling
- Axios 1.13.5 - HTTP client for inter-service calls
- Neon Serverless - Database connector
- CORS 2.8.6 - Cross-Origin Resource Sharing

### Job Service
- Express 5.2.1 - Web framework
- jsonwebtoken 9.0.3 - JWT token handling
- Multer 2.0.2 - File upload handling
- Axios 1.13.5 - HTTP client for inter-service calls
- Bull 4.11.5 - Job queue library
- Redis 5.10.0 - Redis client for Bull Queue
- Neon Serverless - Database connector
- CORS 2.8.6 - Cross-Origin Resource Sharing

### Payment Service
- Express 5.2.1 - Web framework
- Razorpay 2.9.6 - Payment gateway SDK
- jsonwebtoken 9.0.3 - JWT token validation
- Neon Serverless - Database connector
- CORS 2.8.6 - Cross-Origin Resource Sharing

## 🚧 Development Status

- ✅ Auth Service - In Development
- ✅ User Service - In Development
- ✅ Utils Service - In Development
- ✅ Job Service - In Development
- ✅ Payment Service - In Development
- ✅ Frontend - In Development

## 🧭 Frontend Route Coverage

- `/` - Home (hero + landing blocks)
- `/about` - About page
- `/jobs` - Job listing
- `/jobs/:id` - Single job details
- `/company/:id` - Company details
- `/account` - Account landing
- `/account/:id` - Account profile view
- `/subscribe` - Subscription flow
- `/payment/success/:id` - Payment success callback
- `/login` - Login page
- `/register` - Register page
- `/forgot` - Forgot password page
- `/reset/:token` - Reset password page

## 📄 License

ISC

## 👨‍💻 Author

**Aditya Kumar**  
GitHub: [debug-node](https://github.com/debug-node)

---

For detailed development progress, refer to [daily-documentation.md](daily-documentation.md)
