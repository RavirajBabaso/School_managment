# School Staff Task Management

A monorepo for a school staff task management platform with a React frontend and an Express API backend.

---

## 📁 Project Structure

```text
school-task-management/
  frontend/   Vite + React 18 + TypeScript client
  backend/    Node.js + Express + TypeScript API
```

---

## ⚙️ Prerequisites

- Node.js 18+ (Recommended: 20)
- npm 9+
- MySQL 8
- Redis

---

## 🚀 Mac Setup Guide

### Step 1 — Install Homebrew (if not already)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

### Step 2 — Install Node.js 20

```bash
brew install node@20
node -v
```

---

### Step 3 — Install MySQL

```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

#### Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE school_taskdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'school_user'@'localhost' IDENTIFIED BY 'school_password';

GRANT ALL PRIVILEGES ON school_taskdb.* TO 'school_user'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

---

### Step 4 — Install Redis

```bash
brew install redis
brew services start redis

redis-cli ping
```

---

## 🛠️ Project Setup

```bash
unzip school-task-management-clean.zip
cd school-task-management
```

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

#### Update `.env`

```
DB_HOST=localhost
DB_NAME=school_taskdb
DB_USER=school_user
DB_PASSWORD=school_password

JWT_SECRET=any-long-random-string
JWT_REFRESH_SECRET=another-long-random-string
```

#### Run Migrations

```bash
npx sequelize-cli db:migrate
```

#### Start Backend

```bash
npm run dev
```

Backend runs at:  
http://localhost:5000

---

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at:  
http://localhost:5173

---

## 🔑 Seeder Setup (Important)

Run initial data seed:

```bash
cd backend
npx ts-node seeders/initialDataSeed.ts
```

---

## 👤 Default Login Credentials

| Role | Email | Password |
|------|------|---------|
| Chairman | chairman@adhira.edu | Admin@123 |
| Director | director@adhira.edu | Dept@123 |
| Property | property@adhira.edu | Dept@123 |
| Finance | finance@adhira.edu | Dept@123 |
| Admin | admin@adhira.edu | Dept@123 |
| Principal | principal@adhira.edu | Dept@123 |
| Admission | admission@adhira.edu | Dept@123 |
| HR | hr@adhira.edu | Dept@123 |
| Purchase | purchase@adhira.edu | Dept@123 |
| IT | it@adhira.edu | Dept@123 |
| Transport | transport@adhira.edu | Dept@123 |

---

## ➕ Adding New Users

### Recommended (UI)

1. Login as **Chairman**
2. Go to **User Management**
3. Click **+ Add User**

---

### Manual (MySQL)

```bash
mysql -u root -p school_taskdb
```

```sql
INSERT INTO Users 
(name, email, password_hash, role, department_id, is_active, createdAt, updatedAt)
VALUES (
  'New User',
  'newuser@adhira.edu',
  '$2a$12$yourBcryptHashHere',
  'HR',
  (SELECT id FROM Departments WHERE name = 'HR'),
  1,
  NOW(),
  NOW()
);
```

#### Generate Password Hash

```bash
node -e "const b=require('bcryptjs'); b.hash('YourPassword@123',12).then(console.log)"
```

---

## 📜 Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

### Backend

```bash
npm run dev
npm run build
npm start
```

---

## 🌐 Default Ports

- Frontend → http://localhost:5173  
- Backend → http://localhost:5000  

---

## ✅ Verification

```bash
curl http://localhost:5000/api/health
brew services list | grep mysql
brew services list | grep redis
```

---

## 🔄 Service Commands

| Action | Command |
|--------|--------|
| Start MySQL | brew services start mysql |
| Stop MySQL | brew services stop mysql |
| Start Redis | brew services start redis |
| Stop Redis | brew services stop redis |
| Stop All | brew services stop --all |

---

## 🧯 Troubleshooting

### MySQL Not Connecting

```bash
brew services restart mysql
```

---

### Port 5000 Already Used

```bash
lsof -i :5000
kill -9 <PID>
```

---

### npm Issues

```bash
node -v
npm -v
```

---

### Migration Errors

- Check `.env` credentials
- Ensure MySQL is running

---

## 🎯 Final Step

Open http://localhost:5173 and login using provided credentials.

---

## 📌 Notes

- Run seeder before login
- Chairman has full access
- Use UI for user management

---

# School_management
