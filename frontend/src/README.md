# 🧑‍💼 Employee Onboarding System

A full-stack AI-powered employee onboarding management system built with Flask and React.

## 🚀 Live Demo
- Frontend: (add your Vercel link here after deployment)
- Backend: (add your Render link here after deployment)

---

## 📌 Features

### Phase 1 — Core System
- Add, update, delete employees
- Add, update, delete tasks
- Assign tasks to employees
- Track progress per employee
- Dashboard with live stats

### Phase 2 — AI Integration
- ML model (Random Forest) predicts onboarding status
- Visual badges: ✅ On Track / ⚠️ At Risk / 🔴 Delayed
- Auto-reminders logged for At Risk and Delayed employees
- Notifications page showing all reminder logs

---

## 🛠️ Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | React, Vite |
| Backend | Python, Flask |
| Database | SQLite |
| AI Model | Scikit-learn (Random Forest) |
| Scheduler | APScheduler |

---

## ⚙️ How to Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Routes

### Employees
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/employees | Get all employees |
| POST | /api/employees | Add new employee |
| PUT | /api/employees/<id> | Update employee |
| DELETE | /api/employees/<id> | Delete employee |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Add new task |
| PUT | /api/tasks/<id> | Update task |
| DELETE | /api/tasks/<id> | Delete task |

### Progress
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/progress | Get all progress |
| POST | /api/progress | Assign task to employee |
| PUT | /api/progress/<id> | Update progress status |

### AI (Phase 2)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/predict/<id> | Predict status for one employee |
| GET | /api/predict-all | Predict status for all employees |
| GET | /api/notifications | Get all reminder logs |
| GET | /api/dashboard | Get dashboard stats |

---

## 👩‍💻 Developer
Built by Reeda — Phase 2 Project Submission