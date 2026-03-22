# 💼 Job Portal

A microservices-based job portal platform built with Node.js, Express, TypeScript, PostgreSQL, Redis, and Bull Queue.

## 📋 Project Overview

This project provides a complete hiring workflow for jobseekers and recruiters:

- Authentication and authorization
- User profile and resume management
- Job and company management
- Job application workflow
- Subscription checkout and payment verification
- AI-powered career and resume analysis

## 🧩 Services

- Auth Service: registration, login, password reset, token-based auth
- User Service: profile updates, skills, applications, user-focused endpoints
- Job Service: recruiter company/job operations, public job listings, application status flow
- Utils Service: file upload, mail delivery pipeline, AI endpoints
- Payment Service: Razorpay checkout and payment verification
- Frontend: Next.js app for all user and recruiter flows

## 🏗️ Tech Stack

- Backend: Node.js, Express, TypeScript
- Frontend: Next.js, React, Tailwind CSS, shadcn/ui
- Database: PostgreSQL (Neon)
- Cache: Redis (Upstash)
- Email Delivery: Resend API (Bull Queue + Async Processing)
- File Storage: Cloudinary
- Payments: Razorpay
- AI: Google Gemini API

## 🆕 Latest Update - Resend Email Integration

- Email delivery **switched from SendGrid to Resend API** for better reliability
- Implemented **Bull Queue with Redis** for async email processing (non-blocking)
  - Producer (Job Service) queues email jobs
  - Consumer (Utils Service) processes from queue asynchronously
  - Automatic retry logic with exponential backoff
- Auth transactional templates: welcome email, login security alert, password reset
- Payment: subscription invoice email with detailed billing  
- Job applications: status update notifications via email
- All emails sent from: `onboarding@resend.dev` (verified sender)
- Email integration:
  - Auth Service: Welcome, Login Alert, Password Reset
  - Payment Service: Subscription Invoice
  - Job Service: Job Application Status Updates (via Bull Queue)
- Environment variable: `RESEND_API_KEY=re_JMaXBpcm_EA9y4aFAEnNabRTxEvhQxxb5`

## 📁 Project Structure

```text
Job-Portal/
|-- frontend/
|-- services/
|   |-- auth/
|   |-- user/
|   |-- job/
|   |-- utils/
|   `-- payment/
|-- daily-documentation.md
`-- README.md
```

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js 16+
- npm or yarn
- PostgreSQL database
- Redis instance
- Cloudinary credentials
- Razorpay keys

### 📦 Install Dependencies

```bash
cd frontend && npm install
cd ../services/auth && npm install
cd ../user && npm install
cd ../job && npm install
cd ../utils && npm install
cd ../payment && npm install
```

### ⚙️ Environment Setup

Create `.env` files for each service using the respective `.env.example` files.

### 🧪 Run in Development

```bash
# frontend
cd frontend && npm run dev

# services
cd services/auth && npm run dev
cd services/utils && npm run dev
cd services/user && npm run dev
cd services/job && npm run dev
cd services/payment && npm run dev
```

## 🔌 Service Ports (Default)

- Frontend: 3000
- Auth Service: 5000
- Utils Service: 5001
- User Service: 5002
- Job Service: 5003
- Payment Service: 5004

## 🔗 API Base Paths

- Auth: `/api/auth`
- User: `/api/user`
- Job: `/api/job`
- Utils: `/api/utils`
- Payment: `/api/payment`

## 📚 Documentation

For detailed development progress, refer to [daily-documentation.md](daily-documentation.md).

## 📄 License

ISC

## 👨‍💻 Author

Aditya Kumar  
GitHub: [debug-node](https://github.com/debug-node)
