# 🎙️ Conference-cum-AI-Interview-Platform

A full-stack, AI-powered **video conferencing and smart interview platform** that brings together real-time video calls, Google Gemini-driven interviews, facial-attention monitoring, speech recognition, and resume analysis — all in one cohesive experience.

---

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Installation & Setup](#-installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [🔐 Environment Variables](#-environment-variables)
- [▶️ Running the Project](#️-running-the-project)
- [📡 API Endpoints](#-api-endpoints)
- [🔌 WebSocket Events](#-websocket-events)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## Overview

The **Conference-cum-AI-Interview-Platform** is designed for modern hiring workflows. Interviewers can create AI-driven interview sessions; candidates upload their resumes, join via a unique code, and experience multi-phase interviews (resume review → technical → behavioural) powered by **Google Gemini 2.5 Flash**. On top of that, the platform includes a conventional video-conferencing module for team meetings, with full WebSocket-based signalling.

---

## ✨ Features

### 🔐 Authentication
- Email / password sign-up and login
- OTP-based login with email verification
- JWT-based session management (access tokens stored in `localStorage`)
- Role-based access control — **candidate**, **interviewer**, **admin**

### 📹 Video Conferencing
- Peer-to-peer video meetings with WebRTC signalling over Socket.io
- Unique meeting codes with configurable expiry (5 days by default)
- Meeting attendance tracking
- Host controls and presence detection

### 🤖 AI-Powered Interviews
- Interviewers create interview sessions and share a unique AI code
- Candidates upload their resume before joining
- **Multi-phase interview flow**: resume questions → technical questions → behavioural questions
- Real-time question + follow-up generation via **Google Gemini**
- Automatic interview scoring (technical, communication, overall) with written feedback
- Auto-complete trigger after a configurable timeout

### 👁️ Attention Monitoring
- Live face detection using **face-api.js** + **TensorFlow.js**
- Flags when the candidate's face is not visible

### 🎤 Speech & Audio
- Web Speech API integration for real-time transcription
- Live microphone waveform visualisation
- AI response waveform animation

### 📄 Resume Management
- PDF resume upload and text extraction
- AI-powered resume summarisation via Gemini
- Stored per-user for interview context

### 📊 Activity History
- Full history of video meetings and AI interview sessions
- Per-session scores and feedback review

### 🎨 Rich UI / UX
- 3D hero scene built with **Three.js** (React Three Fiber + Drei)
- Interactive robot animation via **Spline**
- Particle effects (**tsParticles**), GSAP scroll animations, Framer Motion transitions
- Glassmorphism design language with responsive layouts

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│              Client (React + Vite)           │
│  Pages · Components · Context · Socket Client│
└─────────────────┬────────────────────────────┘
                  │ HTTP REST + WebSocket
┌─────────────────▼────────────────────────────┐
│           API Server (Express.js)            │
│  Routes · Controllers · Services · Middleware│
└──────┬──────────────────────────┬────────────┘
       │ Mongoose                 │ External APIs
┌──────▼──────┐          ┌────────▼────────────┐
│   MongoDB   │          │  Google Gemini API  │
│  (Database) │          │  Nodemailer (SMTP)  │
└─────────────┘          └─────────────────────┘
```

| Layer | Responsibility | Location |
|---|---|---|
| **React UI** | Pages, components, routing, auth state | `frontend/src/` |
| **API Client** | Axios (JWT interceptor), Socket.io clients | `frontend/src/api/`, `frontend/src/socket*.js` |
| **Express API** | REST endpoints, WebSocket gateway | `backend/app.js`, `backend/src/routes/` |
| **Controllers** | Request handling, business logic | `backend/src/controllers/` |
| **Services** | Gemini AI calls, interview logic | `backend/src/services/` |
| **Models** | Mongoose schemas & validation | `backend/src/models/` |
| **Real-time** | Socket.io event management | `backend/src/controllers/socketManager.js` |
| **Utilities** | Email (Nodemailer), score parsing | `backend/src/utils/` |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js (ESM) | ≥ 18 | Runtime |
| Express.js | 5.x | HTTP server & routing |
| MongoDB + Mongoose | 9.x | Database & ODM |
| Socket.io | 4.x | Real-time WebSocket communication |
| Google Generative AI | latest | Interview Q&A generation & scoring |
| JWT (jsonwebtoken) | 9.x | Authentication tokens |
| bcrypt | 6.x | Password hashing |
| Multer | 2.x | File (resume) upload |
| Nodemailer | 8.x | Email notifications & OTP |
| Nodemon | 3.x | Development auto-reload |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 7.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Material-UI (MUI) | 7.x | UI component library |
| Socket.io-client | 4.x | Real-time client |
| Three.js + R3F | 0.183 / latest | 3D graphics |
| GSAP + ScrollTrigger | 3.x | Scroll-based animations |
| Framer Motion | 12.x | Component animations |
| TensorFlow.js | 4.x | ML runtime for face detection |
| face-api.js | 0.22 | Face detection models |
| Axios | 1.x | HTTP client |
| React Router DOM | 7.x | Client-side routing |
| tsParticles | 3.x | Particle effects |
| React Hot Toast | 2.x | Toast notifications |

---

## 📁 Project Structure

```
Conference-cum-Ai-Interview-Platform/
├── backend/
│   ├── app.js                    # Express server entry point
│   ├── package.json
│   └── src/
│       ├── config/
│       │   ├── db.js             # MongoDB connection
│       │   └── env.js            # Environment variable loader
│       ├── controllers/
│       │   ├── authController.js        # Sign-up / login / OTP
│       │   ├── aiInterview.controller.js # AI interview CRUD
│       │   ├── meetingController.js     # Meeting create / verify
│       │   ├── resume.controller.js     # Resume upload & processing
│       │   └── socketManager.js        # WebSocket event handling
│       ├── models/
│       │   ├── user.model.js
│       │   ├── aiInterview.model.js
│       │   ├── meeting.model.js
│       │   ├── resume.model.js
│       │   ├── meetingAttendance.model.js
│       │   └── otp.model.js
│       ├── routes/
│       │   ├── users.routes.js
│       │   ├── meeting.routes.js
│       │   ├── aiInterview.routes.js
│       │   ├── resume.routes.js
│       │   └── activity.routes.js
│       ├── services/
│       │   ├── aiService.js      # Gemini resume summarisation
│       │   └── interviewService.js # Interview Q&A + scoring
│       ├── middlewares/
│       │   └── auth.js           # JWT verification middleware
│       └── utils/
│           ├── mailer.js         # Nodemailer email utility
│           └── parseScore.js     # Score parsing helper
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── src/
│       ├── main.jsx              # React entry + AuthProvider
│       ├── App.jsx               # Route definitions
│       ├── api/
│       │   ├── axios.js          # Axios instance with JWT interceptor
│       │   └── auth.js           # Auth API calls
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state
│       ├── components/           # Reusable UI components
│       ├── pages/
│       │   ├── Home.jsx          # Landing page
│       │   ├── Login.jsx         # Login (password & OTP)
│       │   ├── Signup.jsx        # Registration
│       │   ├── Dashboard.jsx     # User dashboard
│       │   ├── AIDashboard.jsx   # Interviewer AI dashboard
│       │   ├── AiMeetingRoom.jsx # AI interview room
│       │   ├── MeetingRoom.jsx   # Video conference room
│       │   ├── ResumeUpload.jsx  # Resume upload page
│       │   ├── Activity.jsx      # Meeting history
│       │   ├── AIActivity.jsx    # AI interview history
│       │   └── Pricing.jsx       # Pricing page
│       ├── socket.js             # Socket.io for meetings
│       ├── socketAI.js           # Socket.io for AI interviews
│       └── utils/
│           └── meetingHelpers.js
│
└── package.json                  # Root Prettier config
```

---

## ⚙️ Prerequisites

Before you begin, make sure you have the following installed and available:

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | ≥ 18 (LTS) | [Download](https://nodejs.org/) |
| **npm** | ≥ 9 | Bundled with Node.js |
| **MongoDB** | ≥ 6 | Local instance **or** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| **Google Generative AI API Key** | — | [Get a key](https://aistudio.google.com/app/apikey) (free tier available) |
| **SMTP credentials** | — | Gmail App Password or another SMTP provider |

---

## 🚀 Installation & Setup

### Clone the repository

```bash
git clone https://github.com/rishabhXpanwar/Conference-cum-Ai-Interview-Platform.git
cd Conference-cum-Ai-Interview-Platform
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory (see [Environment Variables](#-environment-variables) below), then start the server:

```bash
# Development (auto-reload with Nodemon)
npm run dev

# Production
npm start
```

The backend will be available at **http://localhost:5000**.

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file (or `.env.local`) inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Then start the dev server:

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

The frontend will be available at **http://localhost:5173**.

---

## 🔐 Environment Variables

### `backend/.env`

```env
# ── Server ─────────────────────────────────────────
PORT=5000
CLIENT_URL=http://localhost:5173

# ── Database ───────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/conference-ai

# ── Authentication ─────────────────────────────────
JWT_SECRET=your_jwt_secret_here

# ── Email (SMTP) ───────────────────────────────────
EMAIL=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# ── Google Gemini AI ───────────────────────────────
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_MAX_RESUME_CHARS=12000
```

> **Tip:** For Gmail, generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your account password.

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## ▶️ Running the Project

Open two terminal windows from the project root:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Then navigate to **http://localhost:5173** in your browser.

### Quick start (from root)

```bash
# Install root-level dev tooling (Prettier)
npm install
```

---

## 📡 API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/signup` | — | Register a new user |
| `POST` | `/login/password` | — | Login with email + password |
| `POST` | `/login/otp/send` | — | Send OTP to email |
| `POST` | `/login/otp/verify` | — | Verify OTP and receive JWT |

### Meetings — `/api/meetings`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create` | ✅ JWT | Create a new video meeting |
| `GET` | `/verify/:meetingcode` | ✅ JWT | Verify and retrieve a meeting |

### AI Interviews — `/api/ai`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/create` | ✅ JWT (interviewer) | Create an AI interview session |
| `POST` | `/verify/:aiCode` | ✅ JWT (candidate) | Join an AI interview using the code |
| `GET` | `/created` | ✅ JWT (interviewer) | List all interviews created by the interviewer |
| `GET` | `/my-interviews` | ✅ JWT (candidate) | List the candidate's interview history |

### Resumes — `/api/resume`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/upload` | ✅ JWT | Upload and process a PDF resume |

### Activity — `/api/activity`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ JWT | Retrieve the logged-in user's activity log |

---

## 🔌 WebSocket Events

Socket.io is used for both **regular video meetings** and **AI interview sessions**.

### Meeting Events (namespace: `/`)

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Join a meeting room |
| `user-joined` | Server → Client | Notify when a new user joins |
| `user-left` | Server → Client | Notify when a user leaves |
| `offer` | Client ↔ Server | WebRTC SDP offer |
| `answer` | Client ↔ Server | WebRTC SDP answer |
| `ice-candidate` | Client ↔ Server | ICE candidate exchange |
| `send-message` | Client → Server | Send a chat message |
| `receive-message` | Server → Client | Receive a chat message |

### AI Interview Events (namespace: `/ai`)

| Event | Direction | Description |
|---|---|---|
| `join-ai-room` | Client → Server | Join an AI interview room |
| `ai-question` | Server → Client | Deliver the next AI-generated question |
| `candidate-answer` | Client → Server | Submit candidate's spoken answer |
| `interview-complete` | Server → Client | Signal that the interview is finished |
| `score-update` | Server → Client | Deliver live scoring data |
| `face-alert` | Client → Server | Report face-detection loss |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against the `main` branch

Please follow the existing code style (Prettier is configured at the root level) and make sure your changes don't break existing functionality.

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">Built with ❤️ by <a href="https://github.com/rishabhXpanwar">Rishabh Panwar</a></p>
