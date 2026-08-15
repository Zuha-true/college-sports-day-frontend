# 🏆 College Sports Day Management System

A full-stack web application for organizing and managing college sports day events — student registration, dynamic team building, and live tournament bracket tracking, all in one platform.

![Status](https://img.shields.io/badge/status-active-success)
![Node](https://img.shields.io/badge/node-%3E%3D14-green)
![React](https://img.shields.io/badge/react-18.2.0-61DAFB)

---

## ✨ Features

- 🔐 **Role-based access** — Students browse freely (no login), admins manage via secure password login
- 📝 **Student registration** — Register with interests across 6 sports via checkboxes
- 👥 **Dynamic team builder** — Auto-filters already-assigned students so no one ends up double-booked
- 🏅 **Live tournament brackets** — Single-elimination bracket auto-generates and advances winners each round
- ⚡ **Concurrency-safe** — Database-level row locking prevents conflicts when multiple admins work simultaneously
- 📱 **Fully responsive** — Works seamlessly on mobile, tablet, and desktop
- 🔄 **Real-time sync** — Auto-refreshing views keep admins and students up to date

---

## 🏟️ Supported Sports

Cricket 🏏 · Throwball ⚡ · Kho-Kho 🏃 · Badminton Doubles 🏸 · Relay 🏃‍♂️ · Tug of War 💪

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel (frontend) · Render (backend) · Railway (database) |

---

## 🏗️ Architecture

```
Frontend (React) → REST API (Express) → MySQL Database
      ↓                    ↓
  Vercel               Render + Railway
```

**Key design decisions:**
- Transactional writes (`BEGIN`/`COMMIT`/`ROLLBACK`) with row-level locking (`FOR UPDATE`) to safely handle concurrent admin actions
- Bracket generation and advancement handled server-side to keep a single source of truth
- Stateless JWT auth for admin sessions — no server-side session storage needed

---

## 📁 Project Structure

```
college-sports-day/
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── teams.js
│   │   └── brackets.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/college-sports-day.git
cd college-sports-day

# Set up the database
mysql -u root -p < database/schema.sql

# Backend
cd backend
npm install
cp .env.example .env   # fill in your DB credentials
npm start

# Frontend (new terminal)
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000` (backend on `:5000`).

### Environment Variables

**backend/.env**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=college_sports_day
JWT_SECRET=your_random_secret_key
ADMIN_PASSWORD=your_admin_password
```

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login |
| `GET/POST` | `/api/students` | List / register students |
| `GET/POST/PUT` | `/api/teams/:sport` | Manage teams per sport |
| `GET/POST/PUT` | `/api/brackets/:sport` | Generate & update bracket |

---

## 🗺️ Roadmap

- [ ] Live score entry per match (not just win/loss)
- [ ] Email/SMS notifications for match schedules
- [ ] Export results as PDF
- [ ] Multi-event support (beyond single sports day)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](../../issues).

---

⭐ If you found this useful, consider giving it a star!
