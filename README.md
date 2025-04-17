# User Management API

This is a **NestJS** application providing a user management system with:

**Authentication** (signup, login)
**Role-based authorization** (user/admin)
**OTP** generation & verification
**Soft-delete** users
**Admin** endpoints to manage users & OTPs
**SendGrid** email integration
**TypeORM** with PostgreSQL
**Swagger** API documentation
**Cron job** to clean expired OTPs

---

## Table of Contents

[Features](#features)
[Prerequisites](#prerequisites)
[Installation](#installation)
[Configuration](#configuration)
[Database Setup](#database-setup)
[Running the App](#running-the-app)
[Seeding Admin User](#seeding-admin-user)
[API Documentation](#api-documentation)
[Endpoints](#endpoints)
[Cron Job](#cron-job)
[Testing](#testing)

---

## Features

**User module**: pagination, filtering by status, activate, soft-delete
**Auth module**: signup (with OTP email), login (JWT)
**OTP module**: generate & verify OTP for two-factor-like flow
**Admin module**: manage users and view OTP logs
**Mailer**: welcome email, OTP email, admin notification via SendGrid
**Swagger** UI at /api
**Environment-based** configuration via @nestjs/config

---

## Prerequisites

Node.js v16+ and npm
PostgreSQL database
SendGrid account with verified sender email
Git

---

## Installation
bash
# Clone the repo
git clone <repo-url>
cd user-management-api

# Install dependencies
npm install

---

## Configuration

1. Create a .env file in the project root:

  
ini
   DATABASE_URL=postgres://<DB_USER>:<DB_PASS>@<HOST>:<PORT>/<DB_NAME>
   JWT_SECRET=<your_jwt_secret>
   SENDGRID_API_KEY=<your_sendgrid_api_key>
   FROM_EMAIL=<your_verified_from_email>
   ADMIN_EMAIL=<admin_notification_email>
  

2. Ensure the .env values are accessible (the app uses ConfigModule.forRoot({ isGlobal: true })).

---

## Database Setup

This project uses **TypeORM** with synchronize: true for development. In production, you should switch to migrations.
bash
# Ensure your database exists:
createdb authdb

---

## Running the App
bash
npm run start:dev

The server will start at http://localhost:3000.

---

## Seeding Admin User

To create a default admin, run the seeder script:
bash
# Using ts-node
npx ts-node seed-admin.ts

Outputs:
Admin user created or
Admin user already exists

---

## API Documentation

Swagger UI is available at:
http://localhost:3000/api

Browse, test endpoints, view models, and example responses.

---

## Endpoints

### Authentication

POST /auth/signup - Register a new user (sends OTP & welcome emails)
POST /auth/login  - Authenticate and obtain JWT

### Users (Admin only)

GET /users?status={active|inactive}&page=1&limit=10 - Paginated user list
GET /users/deleted - List soft-deleted users
PATCH /users/{id}/activate - Activate a user
DELETE /users/{id} - Soft-delete a user

### OTP (Authenticated)

POST /otp/generate - Generate OTP for current user
POST /otp/verify   - Verify OTP (requires { "actualOtp": "123456" })

### Admin Module (Admin only)

PATCH /admin/users/{id}/activate
GET /admin/users?page=1&limit=10
GET /admin/users/deleted
GET /admin/otps

---

## Cron Job

A scheduled task runs every hour to delete expired OTPs (older than 10 minutes). It uses @nestjs/schedule and a @Cron('0 * * * *') decorator.

---

## Testing

Use **Postman** or Swagger UI to test endpoints:
Signup → Check user & OTP in DB, receive emails
Login → Obtain JWT
Protected routes → Include Authorization: Bearer <token>

For unit/integration tests, add Jest tests and mock repositories with getRepositoryToken().

---

## License

This project is MIT licensed.

---