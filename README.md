# 🍬 SWEET SHOP MANAGEMENT SYSTEM

A **full-stack MERN application** for managing a sweet shop with **secure authentication**, **role-based access**, **inventory management**, and **online purchase flow**.

Built with **production-ready architecture**, **JWT authentication**, **Google OAuth**, and **OTP-based email verification**.

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Google OAuth (`@react-oauth/google`)
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer (Gmail App Password)
- Google OAuth (`google-auth-library`)

---

## ✨ Features

### 👤 Authentication
- Email + Password registration with **OTP verification**
- JWT-based login
- Google OAuth login
- Secure role storage (Admin / User)

### 🛒 User Features
- View sweets inventory
- Search sweets (name, category, price range)
- Purchase sweets (auto stock update)
- User dashboard

### 🧑‍💼 Admin Features
- Add new sweets
- Edit sweet details
- Restock inventory
- Admin-only panel access

### 🔐 Security
- JWT protected routes
- Admin-only authorization
- Google token verification on backend
- OTP stored securely (in-memory)

---

## 📁 Project Structure

```
SWEET-SHOP-MANAGEMENT-SYSTEM
│
├── backend
│ ├── src
│ │ ├── config
│ │ ├── controllers
│ │ ├── middleware
│ │ ├── models
│ │ ├── routes
│ │ ├── utils
│ │ ├── app.js
│ │ └── server.js
│ └── README.md
│
├── frontend
│ ├── src
│ │ ├── api
│ │ ├── components
│ │ ├── pages
│ │ ├── routes
│ │ ├── utils
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── README.md
│
└── README.md
```

---

## 🌍 Environment Configuration

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
```
▶️ Running the Project
Backend
```
cd backend
npm install
npm run dev

```
Frontend
```
cd frontend
npm install
npm run dev
```
```
Frontend: http://localhost:5173
Backend: http://localhost:5000
```
## 🔐 Authentication & Registration Flow

### 📝 User Registration (OTP + Google)

#### Option 1: Email + Password + OTP
1. User enters **Name, Email, Password**
2. OTP is sent to registered email via Nodemailer
3. User verifies OTP
4. Account is created with role **User**
5. JWT token is issued on successful registration

#### Option 2: Google Sign Up
1. User signs up using Google OAuth
2. Google credential is sent to backend
3. Backend verifies token using Google Auth Library
4. User account is created if not already exists
5. JWT token + role is returned

---

### 🔑 Login
- Email + Password login
- JWT token stored in localStorage
- Role based access enabled

---

### 🔐 Route Protection
- ProtectedRoute → Authenticated users only
- AdminRoute → Admin users only

🧾 Register Page (Frontend) – ADD THIS

## 🧾 Register Page

The Register page supports **two registration methods**:

- Email + Password with OTP verification
- Google OAuth Sign Up

### Features:
- OTP-based email verification
- Secure password handling
- Google OAuth integration
- Automatic role assignment (User)
- Error handling & validation

📌 API ENDPOINTS
## 🔐 Authentication APIs

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/register` | Register user with OTP |
| POST | `/api/auth/login` | Login with JWT |
| POST | `/api/auth/google` | Google Sign Up / Login |



🧠 Best Practices Used
Clean folder structure
Separation of concerns
Reusable Axios instance with interceptors
Role-based UI rendering
Secure authentication flow
Production-ready code style

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Sweet Shop Management System
Built with ❤️ using MERN Stack

---

# 📘 frontend/README.md

```md
# 🎨 Frontend – Sweet Shop Management System

React frontend built using **Vite** with **Tailwind CSS**, **JWT authentication**, and **Google OAuth integration**.

---

## 🚀 Tech Stack
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- @react-oauth/google
- Framer Motion

---
```

## 📁 Folder Structure
```
src
├── api
│ └── axios.js
├── components
│ ├── Navbar.jsx
│ └── Footer.jsx
├── pages
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── Dashboard.jsx
│ └── AdminPanel.jsx
├── routes
│ ├── ProtectedRoute.jsx
│ └── AdminRoute.jsx
├── utils
│ └── auth.js
├── App.jsx
└── main.jsx
```


---

## 🔐 Authentication Handling

- JWT stored in `localStorage`
- Axios interceptor attaches token
- Role-based access using utility helpers
- Google OAuth wrapped at root level

---

## ▶️ Run Frontend

```bash
npm install
npm run dev
```
App runs on:
```
http://localhost:5173
```

---
🧠 Best Practices

Protected routes abstraction
Centralized Axios configuration
Clean UI with Tailwind
Role-based rendering


---

# 📕 backend/README.md

```md
# ⚙️ Backend – Sweet Shop Management System

REST API built using **Node.js**, **Express**, and **MongoDB** with secure authentication and authorization.

---

## 🚀 Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer
- Google OAuth
```

---

## 📁 Folder Structure
```
src
├── config
│ ├── db.js
│ └── mailer.js
├── controllers
│ └── auth.controller.js
├── middleware
│ ├── auth.middleware.js
│ └── admin.middleware.js
├── models
│ └── user.model.js
├── routes
│ └── auth.routes.js
├── utils
│ ├── otp.js
│ ├── otpStore.js
│ └── sendOtpMail.js
├── app.js
└── server.js
```

---

## 🔐 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/auth/send-otp` | Send OTP |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/google` | Google OAuth |

---

## ▶️ Run Backend

```bash
npm install
npm run dev
```
---

Server runs on:
```
http://localhost:5000
```

🧠 Best Practices
JWT middleware
Role-based authorization
Clean controller logic
Secure environment configs


---

## 🔥 NEXT LEVEL TIP (Google-Style)
If tu chahe next:
- 🚀 Deployment README (Render + Vercel)
- 🧪 API docs (Swagger)
- 📦 Docker support
- 🔄 CI/CD badge
- 📊 Screenshots section

Bas bol **bhai next kya karein** 😎






