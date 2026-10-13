# Prime Fitness Gym – Complete Gym Management System

A production-ready MERN Stack (MongoDB, Express.js, React.js, Node.js) web application designed for commercial gym management, member profile tracking, role-based administration, automated BMI goal formulation, personalized 7-day workouts & diet plans, multi-theme UI customization, and daily check-in attendance tracking.

---

## 🚀 Key Features & Modules

### 1. Dual Role Authentication & Access Control

- **JWT & HTTP-Only Cookie Authentication**: Secure login sessions with 1-day token expiry and password hashing using `bcryptjs`.
- **Role-Based Access Control (RBAC)**: Enforced both on the React frontend (`ProtectedRoute`) and Node server (`protect` and `admin` middleware).
- **Protected Roles**:
  - `admin`: Full access to Admin Dashboard, Member CRUD, Attendance Records, Analytics, and Settings.
  - `member`: Access to Member Portal, BMI Calculator, Workouts, Diets, Profile, Membership status, and Attendance Check-in.
- **Password Security**: Authenticated password change with current password verification.

### 2. Complete Administrator Module

- **Live Statistics Overview (8 Dynamic Metrics from MongoDB)**:
  1. Total Members
  2. Active Members
  3. Inactive Members
  4. Cancelled Members
  5. Expired Memberships
  6. Standard Members Count
  7. Premium Members Count
  8. VIP Members Count
  - Plus **Today's Attendance Check-ins** & **Unique Members Present Today**.
- **Data Visualizations**:
  - **Membership Status Breakdown**: Active vs Inactive vs Cancelled vs Expired.
  - **Membership Plan Distribution**: Standard vs Premium vs VIP.
- **Members Management (CRUD)**:
  - Search by Name, Email, or Phone.
  - Filter by Membership Plan (Standard, Premium, VIP) and Status (Active, Inactive, Cancelled, Expired).
  - Multi-column Sorting (Name, Start Date, Expiry Date, Plan, Registration).
  - Add New Member modal with input validation.
  - Edit Member modal with automatic end-date calculation.
  - Member Detail view displaying personal info, fitness metrics, remaining membership days, and check-in history.
  - Safe deletion with confirmation modal.
- **Attendance Management**: View real-time gym check-ins, filter by date, mark manual attendance, and correct records.

### 3. Multiple Selectable UI Themes System

- **Global Theme Engine**:
  1. 🟢 **Green Theme**: Fresh fitness appearance (Lime/Green)
  2. 🟣 **Purple Theme**: Modern premium gym appearance (Violet/Indigo)
  3. ⚪ **White / Light Theme**: Clean, high-contrast light appearance (Slate/White)
  4. 🔵 **Blue Theme**: Professional athletic appearance (Navy/Electric Blue)
- **Settings Page**: Dedicated Theme Settings page accessible by both Admins and Members.
- **Instant Application & Persistence**: CSS variable-driven; applies immediately without page reload and persists in `localStorage` (`prime_fitness_theme`).

### 4. Member Portal & Health Modules

- **Interactive BMI Calculator**: Computes BMI to 2 decimal places, classifies score (Underweight, Normal, Overweight, Obese), recommends goal, and saves confirmed goals to MongoDB.
- **Personalized 7-Day Workout Schedule**: Goal-aligned 7-day schedule (Monday to Sunday) with exercises, sets, reps, and rest intervals.
- **Personalized Nutrition & Diet Chart**: Goal-aligned daily calorie, protein, and water targets with 4 meal cards (Breakfast, Lunch, Snacks, Dinner) featuring Indian food choices and vegetarian alternatives.
- **Profile Management**: Update age, height, weight, phone, blood group, and profile photos.
- **Membership Status**: View active tenure, remaining membership days, start/end dates, and plan benefits.
- **Member Self Check-In**: One-click check-in with duplicate prevention and IST timezone normalization.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), React Router DOM v6, Axios, Bootstrap 5, Lucide React Icons, Custom CSS variables engine.
- **Backend**: Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`, `cors`, `cookie-parser`, `multer`.
- **Database**: MongoDB (Local or MongoDB Atlas).

---

## 📁 Project Structure

```
prime-fitness-gym/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Sidenav.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Loading.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ChangePassword.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── MemberDetail.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── user/
│   │   │       ├── DashboardHome.jsx
│   │   │       ├── Profile.jsx
│   │   │       ├── Membership.jsx
│   │   │       ├── BMI.jsx
│   │   │       ├── Workouts.jsx
│   │   │       ├── Diet.jsx
│   │   │       └── Attendance.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── memberController.js
│   │   ├── profileController.js
│   │   ├── fitnessController.js
│   │   └── attendanceController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Member.js
│   │   ├── Profile.js
│   │   ├── Workout.js
│   │   ├── Diet.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── fitnessRoutes.js
│   │   └── attendanceRoutes.js
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

---

## 💻 Installation & Setup Guide

### Prerequisites

1. **Node.js** (v18 or higher installed).
2. **MongoDB** (Local MongoDB Community Server running or MongoDB Atlas connection string).

---

### Step 1: Environment Configuration

In `prime-fitness-gym/server/.env`, verify or configure:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/prime_fitness_gym
JWT_SECRET=prime_fitness_gym_secret_key_2026_super_secure
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@primefitness.com
ADMIN_PASSWORD=Admin09876
NODE_ENV=development
```

---

### Step 2: Install Backend Dependencies & Seed Database

Open terminal:

```bash
# Navigate to server directory
cd prime-fitness-gym/server

# Install dependencies
npm install

# Run database seed script (Creates admin user, workouts, diets & sample members)
npm run seed
```

---

### Step 3: Install Frontend Dependencies

Open a second terminal:

```bash
# Navigate to client directory
cd prime-fitness-gym/client

# Install dependencies
npm install
```

---

### Step 4: Run the Application

#### Terminal 1 (Backend Server):

```bash
cd prime-fitness-gym/server
npm run dev
# Server running at http://localhost:5000
```

#### Terminal 2 (Frontend Client):

```bash
cd prime-fitness-gym/client
npm run dev
# Client running at http://localhost:5173
```

---

## 🔑 Demo Credentials & How to Create Admin Accounts

### Default Seed Credentials:

| Account Role      | Email Address            | Password         | Default Route |
| :---------------- | :----------------------- | :--------------- | :------------ |
| **Administrator** | `admin@primefitness.com` | `Admin09876`     | `/admin`      |
| **Sample Member** | `rahul@example.com`      | `MemberPass123!` | `/dashboard`  |

### How Admin Accounts Work & Creating New Admins:

1. Running `npm run seed` in `server/` automatically creates the primary Administrator account specified by `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`.
2. To grant administrator privileges to another account in MongoDB:
   - Open MongoDB Compass or `mongosh`.
   - Update the target user's role field:
     ```js
     db.users.updateOne(
       { email: "user@example.com" },
       { $set: { role: "admin" } },
     );
     ```

---

## 🎨 Theme System & How to Switch Themes

- Navigating to **Theme & Settings** (`/admin/settings` or `/dashboard/settings`) allows users to select between:
  1. Green Theme
  2. Purple Theme
  3. White / Light Theme
  4. Blue Theme
- Themes update CSS Custom Properties on `document.documentElement` dynamically without page reloads.
- Selection persists across browser restarts via `localStorage.getItem('prime_fitness_theme')`.

---

## 📡 API Endpoint Summary

### Authentication (`/api/auth`)

- `POST /api/auth/register`: Public member registration.
- `POST /api/auth/login`: Authenticates user & sets HTTP-only cookie.
- `POST /api/auth/logout`: Clears session cookie.
- `GET /api/auth/me`: Fetches authenticated user & profile info.
- `POST /api/auth/change-password`: Updates password.

### Admin Dashboard & Members Management (`/api/admin`, `/api/members`)

- `GET /api/admin/dashboard`: Calculates dynamic MongoDB stats & returns recent members.
- `GET /api/members`: Retrieves members list with search, status/plan filtering, and sorting (`sortBy`, `sortOrder`).
- `GET /api/members/:id`: Gets single member details, profile, remaining days, and attendance log.
- `POST /api/members`: Creates new member account and fitness profile.
- `PUT /api/members/:id`: Updates member profile, plan, start/end dates.
- `DELETE /api/members/:id`: Deletes member and associated records safely.

### Fitness & Health (`/api`)

- `POST /api/bmi`: Calculates BMI score & saves confirmed fitness goal.
- `GET /api/workouts`: Returns 7-day workout schedule matching confirmed goal.
- `GET /api/diet`: Returns diet plan matching confirmed goal.

### Attendance Management (`/api/attendance`)

- `POST /api/attendance/check-in`: Member self check-in.
- `GET /api/attendance/my`: Member's attendance history.
- `GET /api/attendance/admin`: Admin attendance records list with date filtering.
- `GET /api/attendance/admin/stats`: Admin attendance statistics.
- `POST /api/attendance/admin/mark`: Admin manual attendance entry.
- `PUT /api/attendance/admin/:id`: Admin attendance record correction.

---

## 🧪 Testing Instructions

1. **Member Workflow**:
   - Register a new account or log in as `rahul@example.com` / `MemberPass123!`.
   - Access Member Dashboard, BMI Calculator, Workout Plans, Diet Plans, and Profile.
   - Click "Check-in Today" on Member Attendance page.
2. **Admin Workflow**:
   - Log in as `admin@primefitness.com` / `Admin09876`.
   - Inspect 8 dynamic statistic cards and status/plan distribution charts on `/admin`.
   - Search, filter, and sort member accounts on `/admin/members`.
   - Test adding, editing, viewing details, and deleting member records.
3. **Security Testing**:
   - Attempt to navigate directly to `/admin` while logged in as a Member -> verifying automatic redirection to `/dashboard`.
   - Call `/api/members` without admin token -> verifying `403 Forbidden` response.
4. **Theme Testing**:
   - Switch themes on `/admin/settings` or `/dashboard/settings`. Verify immediate visual change and high text contrast in Light theme.
