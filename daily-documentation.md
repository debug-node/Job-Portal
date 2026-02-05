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
- `services/user` ka `.env` abhi repo me add nahi dikh raha.

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

Source: [services/utils/src/routes.ts](services/utils/src/routes.ts)

### User Service (Base: `/api/user`)
| Method | Endpoint | Description | Body/Params | Notes |
| --- | --- | --- | --- | --- |
| GET | /me | Get current user profile | Header | Requires `Authorization: Bearer <token>` |

Source: [services/user/src/routes/user.ts](services/user/src/routes/user.ts)

---

## Setup/Run Steps

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

---

## Architecture Diagram (Text)

```
Client
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

Client
  |
  | HTTP /api/user/*
  v
User Service (Express)
  |-- PostgreSQL (Neon)  [users, skills, user_skills]
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

### User Service
Source: runtime usage in code

| Variable | Purpose |
| --- | --- |
| `PORT` | Service port |
| `DB_URL` | Neon/Postgres connection string |
| `JWT_SEC` | JWT secret key |

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

---

## Tech Stack Summary
- **Node.js + Express + TypeScript**
- **PostgreSQL (Neon)**
- **Redis**
- **Kafka (kafkajs)**
- **Cloudinary**
- **Nodemailer**
- **Multer + DataURI**
- **JWT + bcrypt**
