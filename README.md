# AthleteIQ

A full-stack athlete performance tracking application built with Vue 3, TypeScript, Node.js, and Express.

## Tech Stack

**Client**
- Vue 3 + TypeScript + Vite
- Pinia (state management)
- Vue Router 4
- Tailwind CSS
- Axios

**Server**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- Joi validation
- Winston logging

## Project Structure

```
AthleteIQ/
├── client/   # Vue 3 frontend (port 5173)
└── server/   # Express API (port 3000)
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### Install

```bash
npm run install:all
```

### Development

```bash
npm run dev
```

Starts both client (`http://localhost:5173`) and server (`http://localhost:3000`) concurrently.

### Environment

Copy `server/.env.example` to `server/.env` and fill in the required values:

```
MONGODB_URI=mongodb://localhost:27017/athleteiq
JWT_SECRET=your_long_random_secret
```

## API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register a new account |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/users/me` | ✓ | Get own profile |
| PUT | `/api/users/me` | ✓ | Update own profile |
| GET | `/health` | — | Health check |
