# Job Portal

A microservices-based job portal application built with Node.js, Express, TypeScript, and Kafka for real-time communication.

## 📋 Project Overview

Job Portal is a modern job marketplace platform with a microservices architecture consisting of:

- **Auth Service**: User authentication, registration, password management, and JWT-based security
- **User Service**: User profile management and protected profile endpoint
- **Utils Service**: Shared utilities including email notifications via Kafka and file uploads to Cloudinary
- **Frontend**: Client-side application (coming soon)

## 🏗️ Architecture

### Technology Stack

**Backend Services:**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.2.1
- **Authentication**: JWT (jsonwebtoken)
- **Database**: PostgreSQL (Neon Serverless)
- **Caching**: Redis
- **Message Queue**: Apache Kafka
- **File Upload**: Cloudinary + DataURI
- **Email**: Nodemailer
- **Password Hashing**: bcrypt
- **File Handling**: Multer

**Development Tools:**
- TypeScript 5.9.3
- Nodemon (hot reload)
- Concurrently (run multiple processes)

## 📁 Project Structure

```
Job-Portal/
├── frontend/                 # React/Vue frontend (empty)
├── services/
│   ├── auth/                # Authentication microservice
│   │   ├── src/
│   │   │   ├── app.ts       # Express app setup
│   │   │   ├── index.ts     # Server entry point
│   │   │   ├── producer.ts  # Kafka producer
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
│   │   │   ├── consumer.ts  # Kafka consumer
│   │   │   └── routes.ts
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
- Apache Kafka
- Cloudinary account
- Email service credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Job-Portal
   ```

2. **Install Auth Service**
   ```bash
   cd services/auth
   npm install
   ```

3. **Install Utils Service**
   ```bash
   cd services/utils
   npm install
   ```

4. **Install User Service**
   ```bash
   cd services/user
   npm install
   ```

5. **Setup Environment Variables**
   
   Create `.env` files in each service directory:
   
   **services/auth/.env**
   ```
   DB_URL=postgresql://...
   REDIS_URL=redis://...
   JWT_SEC=your_jwt_secret
   KAFKA_BROKER=localhost:9092
   ```
   
   **services/utils/.env**
   ```
   KAFKA_BROKER=localhost:9092
   CLOUD_NAME=...
   API_KEY=...
   API_SECRET=...
   SMTP_USER=...
   SMTP_PASS=...
   ```

   **services/user/.env**
   ```
   PORT=5002
   DB_URL=postgresql://...
   JWT_SEC=your_jwt_secret
   UPLOAD_SERVICE=http://localhost:5001
   ```

### Running Services

**Development Mode:**

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

**Production Build:**

```bash
npm run build
npm start
```

## 🔑 Key Features

### Auth Service
- User registration with email verification
- Login with JWT token generation
- Forgot password with email reset link
- Password reset functionality
- Profile file upload (avatar/resume)
- bcrypt password hashing
- Multer file upload handling

### Utils Service
- Kafka consumer for email events
- Nodemailer email dispatch
- Cloudinary file storage
- Email template system

### User Service
- JWT-protected profile endpoints
- Auth middleware for user context
- Get user profile by ID
- Update user profile (name, phone, bio)
- Update profile picture with file upload
- Update resume with file upload
- Add/remove user skills with transaction handling
- Axios integration for inter-service communication (utils service)

### Database
- PostgreSQL with Neon serverless
- Tables: `users`, `skills`, `user_skills`
- Enum: `user_role`

### Message Queue
- Apache Kafka for async communication
- Topics: `send-mail` (event-driven email notifications)

## 📝 API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- File upload endpoints for profile management

### User Routes (`/api/user`)
- `GET /me` - Get current user profile (requires `Authorization: Bearer <token>`)
- `GET /:userId` - Get any user's profile by ID (requires auth)
- `PUT /update/profile` - Update user profile info (name, phone, bio)
- `PUT /update/pic` - Update profile picture (requires file upload)
- `PUT /update/resume` - Update resume (requires file upload)
- `POST /skill/add` - Add skill to user profile
- `DELETE /skill/delete` - Remove skill from user profile

## 🔄 Service Communication

The microservices communicate via:
- **Kafka**: Async event-driven messaging (e.g., send-mail events)
- **HTTP/REST**: Synchronous service-to-service calls via Axios
- **Redis**: Caching and temporary token storage

## 📚 Documentation

See [daily-documentation.md](daily-documentation.md) for detailed day-by-day development progress and implementation details.

## 🛠️ Scripts

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

## 📦 Dependencies Overview

### Auth Service
- Express 5.2.1 - Web framework
- Kafka.js 2.2.4 - Kafka client
- jsonwebtoken 9.0.3 - JWT token handling
- bcrypt 6.0.0 - Password hashing
- Multer 2.0.2 - File upload handling
- Redis 5.10.0 - Caching
- Axios 1.13.2 - HTTP client

### Utils Service
- Express 5.2.1 - Web framework
- Kafka.js 2.2.4 - Kafka consumer
- Cloudinary 2.8.0 - File storage
- Nodemailer 7.0.12 - Email service
- CORS 2.8.5 - Cross-Origin Resource Sharing

### User Service
- Express 5.2.1 - Web framework
- jsonwebtoken 9.0.3 - JWT token handling
- Multer 2.0.2 - File upload handling
- Axios 1.13.5 - HTTP client for inter-service calls
- Neon Serverless - Database connector
- CORS 2.8.6 - Cross-Origin Resource Sharing

## 🚧 Development Status

- ✅ Auth Service - In Development
- ✅ User Service - In Development
- ✅ Utils Service - In Development
- 📱 Frontend - Not Started

## 📄 License

ISC

## 👨‍💻 Author

**Aditya Kumar**  
GitHub: [debug-node](https://github.com/debug-node)

---

For detailed development progress, refer to [daily-documentation.md](daily-documentation.md)
