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
| GET | /:userId | Get user profile by ID | URL param + Header | Requires auth, returns user with skills |
| PUT | /update/profile | Update user profile | JSON + Header | Updates name, phoneNumber, bio |
| PUT | /update/pic | Update profile picture | FormData + Header | Requires file upload via multer |
| PUT | /update/resume | Update resume | FormData + Header | Requires file upload via multer |
| POST | /skill/add | Add skill to user | JSON + Header | Body: `{ skillName: "..." }` |
| DELETE | /skill/delete | Remove skill from user | JSON + Header | Body: `{ skillName: "..." }` |

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
  |
  | HTTP /api/utils/upload
  v
Utils Service (Express)
  |-- Cloudinary         [profile pic storage]
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
| `UPLOAD_SERVICE` | Utils service base URL (for profile pic upload) |

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
- **Axios** (HTTP client for inter-service communication)
