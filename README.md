# ⚡ TaskFlow Pro — Futuristic Full-Stack Task Manager

> A production-ready, visually stunning collaborative task management platform built with Next.js 15, Express.js, PostgreSQL, and cutting-edge animations.

![TaskFlow Pro](https://img.shields.io/badge/TaskFlow-Pro-7c3aed?style=for-the-badge&logo=lightning&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)

---

## 🌟 Features

### Frontend
- 🎨 **Futuristic UI** — Glassmorphism, neon glows, cosmic dark theme
- 🌌 **Three.js 3D Background** — Interactive star field + floating orbs
- ✨ **Framer Motion** — Page transitions, stagger animations, hover effects
- 📊 **Dashboard Analytics** — Recharts with area, pie, and bar charts
- 🗂️ **Kanban Board** — Drag-and-drop task management
- 👥 **Team Page** — 3D tilt cards with member stats
- 🏆 **Portfolio Page** — Cinematic personal CV with scroll animations
- 🔐 **Evaluator Quick Access** — Flip cards revealing demo credentials
- 📱 **Fully Responsive** — Mobile, tablet, desktop

### Backend
- 🔒 **JWT Authentication** — Secure token-based auth
- 🛡️ **RBAC** — Admin / Member role-based access control
- 🗄️ **Prisma ORM** — Type-safe PostgreSQL queries
- 🔌 **Socket.io** — Real-time task updates
- 🚦 **Rate Limiting** — Express rate limiter
- 🪖 **Helmet** — Security headers
- ✅ **Zod Validation** — Request validation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Animations | Framer Motion, Three.js, React Three Fiber |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io |
| Deployment | Vercel (Frontend) + Railway (Backend + DB) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Setup

```bash
git clone <repo-url>
cd taskflow-pro
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

npm install
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed   # Seeds demo users
npm run dev           # Starts on port 5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL

npm install
npm run dev           # Starts on port 3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@taskflow.pro | admin123 |
| **Member** | member@taskflow.pro | member123 |

> These are also accessible via the **Evaluator Quick Access** section on the login page (flip cards to reveal).

---

## 📁 Project Structure

```
taskflow-pro/
├── frontend/
│   ├── app/
│   │   ├── (auth)/login/          # Login page with 3D background
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/         # Analytics dashboard
│   │   │   ├── projects/          # Project management
│   │   │   ├── tasks/             # Kanban board
│   │   │   ├── team/              # Team members
│   │   │   ├── profile/           # User profile
│   │   │   └── portfolio/         # Personal portfolio/CV
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/                # Sidebar, Navbar
│   │   ├── dashboard/             # Stat cards
│   │   ├── three/                 # 3D scene components
│   │   └── animations/
│   ├── store/                     # Zustand stores
│   ├── services/                  # Axios API calls
│   ├── types/                     # TypeScript types
│   └── lib/                       # Utilities
│
└── backend/
    ├── src/
    │   ├── controllers/           # Route handlers
    │   ├── routes/                # Express routes
    │   ├── middleware/            # Auth, error handling
    │   ├── config/                # Database config
    │   └── types/                 # TypeScript types
    └── prisma/
        ├── schema.prisma          # Database schema
        └── seed.ts                # Demo data seeder
```

---

## 🌐 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | ✅ | Get all users |
| GET | `/api/users/:id` | ✅ | Get user by ID |
| PUT | `/api/users/:id` | ✅ | Update user |

### Projects
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/projects` | ✅ | Any | Get projects |
| POST | `/api/projects` | ✅ | Admin | Create project |
| PUT | `/api/projects/:id` | ✅ | Owner/Admin | Update project |
| DELETE | `/api/projects/:id` | ✅ | Admin | Delete project |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | ✅ | Get tasks (filterable) |
| POST | `/api/tasks` | ✅ | Create task |
| PUT | `/api/tasks/:id` | ✅ | Update task |
| DELETE | `/api/tasks/:id` | ✅ | Delete task |

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/dashboard` | ✅ | Dashboard stats |

---

## 🗄️ Database Schema

```prisma
User       → id, name, email, password, role, avatar, bio, skills
Project    → id, title, description, status, deadline, ownerId
Task       → id, title, description, priority, status, dueDate, assigneeId, projectId
TeamMember → id, userId, projectId
Activity   → id, action, userId
```

---

## 🚢 Deployment

### Backend → Railway

1. Create Railway account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add PostgreSQL plugin
4. Set environment variables:
   ```
   DATABASE_URL=<from Railway PostgreSQL>
   JWT_SECRET=<your-secret>
   NODE_ENV=production
   FRONTEND_URL=<your-vercel-url>
   PORT=5000
   ```
5. Railway auto-deploys on push

### Frontend → Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=<your-railway-backend-url>
   ```
4. Deploy!

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#050816` |
| Primary | `#7c3aed` |
| Secondary | `#06b6d4` |
| Accent | `#22d3ee` |
| Neon | `#8b5cf6` |
| Text | `#f8fafc` |
| Muted | `#94a3b8` |

Fonts: **Space Grotesk** (headings) + **Inter** (body)

---

## 👨‍💻 Author

**Dhruv**  
BTech CS (AI/ML) — Shri Vishwakarma Skill University, Palwal  
📧 22BTC35111@svsu.ac.in | 📱 9599700715  
📍 Faridabad, Haryana, India

---

## 📄 License

MIT © 2026 Dhruv
