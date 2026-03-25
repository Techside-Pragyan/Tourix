---
description: How to set up and run the Tourix MERN stack project locally
---

# Running Tourix Locally

## Prerequisites
- Node.js v18+
- MongoDB running locally or MongoDB Atlas URI

## Steps

1. Make sure MongoDB is running locally (or update `backend/.env` with your MongoDB Atlas URI)

// turbo
2. Install backend dependencies: `cd backend && npm install`

// turbo
3. Seed the database with South Indian destinations: `npm run seed` (from backend folder)

4. Start the backend server: `npm run dev` (from backend folder) — runs on port 5000

5. Open a new terminal, install frontend dependencies: `cd frontend && npm install`

6. Start the frontend dev server: `npm run dev` (from frontend folder) — runs on port 5173

7. Open http://localhost:5173 in your browser
