# 💼 Job Portal

A microservices-based job portal platform built with Node.js, Express, TypeScript, PostgreSQL, and Redis.

## 📋 Project Overview

This project provides a complete hiring workflow for jobseekers and recruiters:

- Authentication and authorization
- User profile and resume management
- Job and company management
- Job application workflow
- Subscription checkout and payment verification
- AI-powered career and resume analysis
- Admin dashboard for platform-level monitoring and moderation

## 🧩 Services

- **Auth Service**: registration, login, password reset, token-based auth
- **User Service**: profile updates, skills, applications, user-focused endpoints
- **Job Service**: recruiter company/job operations, public job listings, application status flow
- **Utils Service**: file upload, mail delivery pipeline, AI endpoints
- **Payment Service**: Razorpay checkout and payment verification
- **Frontend**: Next.js app for all user and recruiter flows

## 🏗️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL (Neon)
- **Cache**: Redis (Upstash)
- **Email Delivery**: Nodemailer with Gmail SMTP (Centralized via Utils service)
- **File Storage**: Cloudinary
- **Payments**: Razorpay
- **AI**: Google Gemini API

## 📁 Project Structure

```
Job-Portal/
├── frontend/
├── services/
│   ├── auth/
│   ├── user/
│   ├── job/
│   ├── utils/
│   └── payment/
├── daily-documentation.md
└── README.md
```

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js 16+
- npm or yarn
- PostgreSQL database (Neon)
- Redis instance (Upstash)
- Cloudinary credentials
- Razorpay keys
- Gmail account with app password (for Nodemailer email sending)
- Google Gemini API key

### 📦 Install Dependencies

```
cd frontend && npm install
cd ../services/auth && npm install
cd ../user && npm install
cd ../job && npm install
cd ../utils && npm install
cd ../payment && npm install
```

### ⚙️ Environment Setup

1. Create .env files for each service using the respective .env.example files.

2. **Email Configuration (Nodemailer)**: For each service, set:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   ```
   
   **Getting Gmail App Password:**
   - Enable 2-Step Verification in your Google Account
   - Go to myaccount.google.com/apppasswords
   - Generate app password for "Mail" and "Windows Computer"
   - Use the 16-character password in EMAIL_PASSWORD

### 🧪 Run in Development

```
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

- Auth: /api/auth
- User: /api/user
- Job: /api/job
- Utils: /api/utils
- Payment: /api/payment
- Admin (User/Job/Payment Services): /api/admin

## 🔐 Admin Panel

Complete admin dashboard with Super Admin Key authentication for managing users, jobs, applications, and payments.

**Features**: User management, job management, application status tracking, payment analytics, company management, real-time dashboard, report export (JSON/TXT/PDF).

**Setup**: 
- Set `ADMIN_SECRET_KEY` in each service .env 
- Go to `/admin/login` → Enter admin key → Access dashboard

## 📚 Documentation

For detailed development progress, refer to [daily-documentation.md](daily-documentation.md).

## 📄 License

ISC

## 👨‍💻 Author

Aditya Kumar  
GitHub: [debug-node](https://github.com/debug-node)
