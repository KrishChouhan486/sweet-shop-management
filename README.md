text
# Sweet Shop Management System (MERN)

A full-stack Sweet Shop Management System built with the MERN stack, following Test-Driven Development (TDD) principles.  
Users can register, log in (with optional OTP and Google login), browse sweets, purchase them, and admins can fully manage the inventory from a modern dashboard.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Frontend (React) Details](#frontend-react-details)
- [Backend (Node.js) Details](#backend-nodejs-details)
- [API Overview](#api-overview)
- [Running Tests](#running-tests)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

---

## Tech Stack

**Frontend**

- React + Vite
- React Router
- Axios
- Tailwind CSS

**Backend**

- Node.js, Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt (password hashing)
- Nodemailer / OTP provider (for verification emails or codes)

**Testing**

- Jest + Supertest (backend)

---

## Features

### Authentication & Security

- JWT-based token authentication for protected APIs.
- Role-based access control (User vs Admin).
- Email + password login.
- OTP-aware registration flow (backend can send OTP via email/SMS and verify it).
- Optional Google login support using OAuth 2.0 (Google client ID on frontend, verification on backend).
- Passwords are never stored in plain text (securely hashed before saving).

### User Features

- Register and log in securely.
- View all available sweets on a responsive dashboard.
- Search and filter sweets by name, category, and price range.
- Purchase sweets; the button is automatically disabled when stock is zero.
- See clean, mobile-friendly UI.

### Admin Features

- Add new sweets with name, category, price and quantity.
- Update existing sweets (edit details).
- Delete sweets from the catalog.
- Restock sweets and manage inventory levels.
- View quick stats: total sweets, out-of-stock count, and total inventory value.
- All admin actions are protected and require an admin role.

---

## Architecture

root
├── backend
│ ├── src
│ │ ├── config # DB config, mailer/OTP config
│ │ ├── controllers # auth.controller.js, sweet.controller.js
│ │ ├── middleware # auth middleware, admin middleware
│ │ ├── models # user.model.js, sweet.model.js
│ │ ├── routes # auth.routes.js, sweet.routes.js
│ │ ├── utils # helpers, email/OTP utilities
│ │ └── server.js # Express app bootstrap
│ ├── package.json
│ └── ...
└── frontend
├── src
│ ├── admin # AddSweet.jsx, EditSweet.jsx
│ ├── api # axios.js (shared API client)
│ ├── auth # Login.jsx, Register.jsx
│ ├── components # Navbar.jsx, Footer.jsx, etc.
│ ├── pages # Dashboard.jsx
│ ├── assets # (optional) images/logo
│ ├── App.jsx # App routes
│ └── main.jsx # React root
├── package.json
└── ...

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas)
- Git

### 1. Clone the repository

git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>


---

### 2. Backend Setup

cd backend
npm install


Create a `.env` file inside `backend`:

PORT=5000
MONGO_URI=mongodb://localhost:27017/sweet-shop

JWT config
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

Email / OTP (example keys, match your implementation)
EMAIL_FROM=no-reply@sweetshop.com
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

OTP provider (if using external service)
OTP_PROVIDER_API_KEY=your_otp_provider_key

Google OAuth (if enabled)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback


> Set only the variables you actually use in your code. Unused ones can be removed.

Start the backend:

npm run dev # or npm start, depending on your package.json


- Backend URL: `http://localhost:5000`
- Base API path: `http://localhost:5000/api`

---

### 3. Frontend Setup

From the project root:

cd frontend
npm install

Create a `.env` file inside `frontend`:

VITE_API_BASE_URL=http://localhost:5000/api

Optional: Google OAuth client ID for "Continue with Google"
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

Optional: feature flag to enable OTP-specific UI
VITE_ENABLE_OTP_AUTH=true



Start the frontend:

npm run dev



- Frontend URL (Vite default): `http://localhost:5173`

The frontend connects to the backend using `VITE_API_BASE_URL`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable              | Description                                |
|-----------------------|--------------------------------------------|
| `PORT`                | Backend server port                        |
| `MONGO_URI`           | MongoDB connection string                  |
| `JWT_SECRET`          | JWT signing secret                         |
| `JWT_EXPIRES_IN`      | JWT expiration duration (e.g. `7d`)        |
| `EMAIL_FROM`          | From-address for OTP / verification emails |
| `SMTP_HOST`           | SMTP host for Nodemailer                   |
| `SMTP_PORT`           | SMTP port                                  |
| `SMTP_USER`           | SMTP username                              |
| `SMTP_PASS`           | SMTP password                              |
| `OTP_PROVIDER_API_KEY`| API key if using external OTP service      |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID                     |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret                 |
| `GOOGLE_REDIRECT_URI` | Google OAuth redirect URL                  |

### Frontend (`frontend/.env`)

| Variable              | Description                                  |
|-----------------------|----------------------------------------------|
| `VITE_API_BASE_URL`   | Base URL of the backend API (`/api` prefix) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for frontend       |
| `VITE_ENABLE_OTP_AUTH`  | Toggle OTP-aware UI (true/false)          |

---

## Frontend (React) Details

### Frontend Overview

The frontend is a single-page application (SPA) built with React and Tailwind CSS.  
It provides a modern, responsive dashboard for both regular users and admin users.

**Key responsibilities:**

- Handle authentication flows (login, registration, OTP verification, optional Google login).
- Consume the backend REST API and display sweets and inventory data.
- Provide admin-only UI for managing sweets (add, edit, delete, restock).
- Ensure a consistent, responsive, and accessible user experience across devices.

### Frontend Structure

frontend
├── src
│ ├── admin
│ │ ├── AddSweet.jsx # Admin: add new sweet
│ │ └── EditSweet.jsx # Admin: edit existing sweet
│ ├── api
│ │ └── axios.js # Axios instance with base URL and interceptors
│ ├── auth
│ │ ├── Login.jsx # Login + Google login + OTP-aware flow
│ │ └── Register.jsx # Registration + OTP initiation UI
│ ├── components
│ │ ├── Navbar.jsx # Top navigation bar with role + logout
│ │ └── Footer.jsx # Global footer with quick actions
│ ├── pages
│ │ └── Dashboard.jsx # Main dashboard showing sweets and stats
│ ├── assets # (optional) images, logos, icons
│ ├── App.jsx # Routes and layout composition
│ └── main.jsx # React root bootstrap
├── index.html
└── package.json


### Authentication, OTP & Google Login (Frontend)

#### 1. Email + Password Login

- Implemented in `src/auth/Login.jsx`.
- User enters email and password.
- On submit:
  - Sends `POST /api/auth/login` via the shared Axios instance.
  - On success, stores JWT token and user role in `localStorage`.
  - Redirects the user to the dashboard (`/` route).
- UI elements like "Purchase", "Add", "Edit", "Delete" and "Restock" render conditionally based on the stored `role`.

#### 2. Registration with OTP Awareness

- Implemented in `src/auth/Register.jsx`.
- The registration flow is conceptually two steps:
  1. **User details form**  
     Sends `POST /api/auth/register` with name, email and password. Backend may send an OTP via email/SMS.
  2. **OTP confirmation (if enabled)**  
     When `VITE_ENABLE_OTP_AUTH` is `true`, the UI can show an OTP input step and send OTP to a dedicated verification endpoint.  
     After successful OTP verification, the account becomes active.

> Exact OTP endpoints depend on the backend design; the UI is built to work with those APIs.

#### 3. Google Login (Optional)

- When `VITE_GOOGLE_CLIENT_ID` is set:
  - A "Continue with Google" button can be displayed on the login form.
  - The frontend uses the Google client SDK to obtain a Google token.
  - That token is sent to the backend, which verifies it and returns a local JWT.
- Frontend handles loading and error states to keep the flow smooth.

#### 4. Secure State Handling

- JWT and `role` are stored in `localStorage`.
- `Navbar.jsx` uses them to show current role and logout.
- `Dashboard.jsx` uses them to render admin-only controls.
- Logout clears stored auth data and redirects to the login page.

### Dashboard & Inventory UI

The main dashboard (`src/pages/Dashboard.jsx`) offers a Google-like card-based UI:

- **Header Stats**
  - Total sweets
  - Out-of-stock count
  - Total inventory value

- **Search & Filters**
  - Search by name.
  - Filter by category.
  - Filter by min and max price.
  - "Reset" button to clear filters and reload data.

- **Sweet Cards**
  - Show name, category, description, price, and stock badge (color-coded).
  - "Purchase now" button:
    - Calls `POST /api/sweets/:id/purchase`.
    - Automatically disabled when quantity is zero.

- **Admin Controls**
  - Visible only when `role === "Admin"`:
    - **Add Sweet** – opens the `AddSweet` modal.
    - **Edit** – opens the `EditSweet` modal for that item.
    - **Restock** – asks for quantity and calls `POST /api/sweets/:id/restock`.
    - **Delete** – shows confirmation and calls `DELETE /api/sweets/:id`.

### API Client & Error Handling

- `src/api/axios.js` contains a shared Axios instance:
  - Sets `baseURL` using `VITE_API_BASE_URL`.
  - Attaches `Authorization: Bearer <token>` header for protected endpoints.
  - Handles common error cases (401/403) and displays user-friendly messages.

### Styling & UX

- Tailwind CSS used for utility-first, responsive design.
- Design highlights:
  - Glassmorphism cards with gradients and blur.
  - Clear hierarchy for titles, stats, and content.
  - Dark theme with good contrast.
  - Smooth hover and focus states on interactive elements.
- Layout is fully responsive:
  - Stats collapse into scrollable chips on mobile.
  - Cards automatically reflow from multi-column to single-column layouts.

---

## Backend (Node.js) Details

### Backend Responsibilities

- Expose RESTful API endpoints for auth, sweets and inventory.
- Connect to MongoDB for persistent storage.
- Handle authentication, authorization and validation.
- Implement TDD-friendly, modular business logic.

### Backend Structure

backend
├── src
│ ├── config
│ │ └── db.js # MongoDB connection
│ ├── controllers
│ │ ├── auth.controller.js # register, login, OTP/Google handling
│ │ └── sweet.controller.js# CRUD + purchase/restock
│ ├── middleware
│ │ ├── auth.middleware.js # JWT verification
│ │ └── admin.middleware.js# Admin role check
│ ├── models
│ │ ├── user.model.js # User schema (role, password hash, etc.)
│ │ └── sweet.model.js # Sweet schema (name, category, price, quantity)
│ ├── routes
│ │ ├── auth.routes.js # /api/auth/*
│ │ └── sweet.routes.js # /api/sweets/*
│ ├── utils
│ │ ├── email.js # Nodemailer / OTP utilities
│ │ └── tokens.js # JWT helper functions
│ └── server.js # Express app and route mounting
└── package.json


### Authentication & Security (Backend)

- Users can register (`POST /api/auth/register`) and log in (`POST /api/auth/login`).
- Passwords are hashed using a secure algorithm before storage.
- On successful login, backend returns a signed JWT.
- Auth middleware:
  - Reads `Authorization: Bearer <token>` header.
  - Verifies JWT and attaches user information to the request object.
- Admin middleware:
  - Checks the decoded user object for `role === "Admin"`.
  - Only allows admins to perform create/update/delete/restock operations.

### OTP & Email Flow (Conceptual)

- On registration:
  - User data is saved (or pre-saved as pending).
  - An OTP is generated and stored (in DB or cache) with an expiry.
  - OTP is sent to the user via email using Nodemailer (or OTP provider).
- On OTP verification:
  - User sends OTP back to verification endpoint.
  - If valid and not expired, the account is marked as verified/active.
- This adds an extra security layer and prevents fake registrations.

### Google Login Flow (Conceptual)

- Frontend obtains Google ID token using Google client SDK.
- Backend exposes a route (e.g. `POST /api/auth/google`) to:
  - Verify the Google token.
  - Either find an existing user or create a new one.
  - Return a JWT and user payload similar to email/password login.

---

## API Overview

All routes are prefixed with `/api`.

### Auth

| Method | Endpoint              | Description                 |
|--------|-----------------------|-----------------------------|
| POST   | `/api/auth/register`  | Register a new user         |
| POST   | `/api/auth/login`     | Login and get a JWT token   |
| POST   | `/api/auth/google`    | (Optional) Google login     |
| POST   | `/api/auth/verify-otp`| (Optional) Verify OTP       |

### Sweets (Protected)

| Method | Endpoint              | Description                         | Role   |
|--------|-----------------------|-------------------------------------|--------|
| POST   | `/api/sweets`         | Add a new sweet                     | Admin  |
| GET    | `/api/sweets`         | Get all sweets                      | Any    |
| GET    | `/api/sweets/search`  | Search by name/category/price range | Any    |
| PUT    | `/api/sweets/:id`     | Update sweet details                | Admin  |
| DELETE | `/api/sweets/:id`     | Delete a sweet                      | Admin  |

### Inventory (Protected)

| Method | Endpoint                         | Description                 | Role   |
|--------|----------------------------------|-----------------------------|--------|
| POST   | `/api/sweets/:id/purchase`       | Purchase (quantity - 1)     | Any    |
| POST   | `/api/sweets/:id/restock`        | Restock (quantity + X)      | Admin  |

---

## Running Tests

### Backend Tests

cd backend
npm test


- Covers:
  - Auth flows (register, login, protected access).
  - Sweets CRUD operations.
  - Inventory actions (purchase, restock).
  - Role-based access control.

### Frontend Tests (if implemented)

cd frontend
npm test



- Example coverage:
  - Rendering of Login, Register, Dashboard.
  - Disabled purchase button when stock is zero.
  - Admin-only buttons visibility.

---

## Screenshots

(Add your actual screenshots in a `screenshots/` folder and update paths.)

Dashboard (Admin view)
![Admin Dashboard](./screenshots/dashboard-admin

![Login Page](

Add / Edit Sweet
![Manage Sweet](./screenshots/manage-sweet AI tools while building this project and treat them as pair-programming assistants.

Tools
ChatGPT

GitHub Copilot

How I Used Them
Brainstormed API endpoint structures and validation rules for the sweets and auth modules.

Generated initial versions of some React components and Tailwind CSS utility classes for the dashboard UI.

Asked for ideas and templates for Jest + Supertest test cases for the backend.

Used suggestions to debug authentication, JWT handling and Mongoose validation issues.

Used help to design this README structure so that it is clear and easy to understand.

Impact on My Workflow
AI sped up repetitive boilerplate tasks so I could focus on core business logic and edge cases.

I always reviewed, edited, and sometimes rewrote AI suggestions to match my style and the assignment requirements.

For commits where AI assistance was significant, I added an AI co-author line in the commit message as requested in the assignment.

Example commit message format:

git commit -m "feat: implement sweets search API

Used an AI assistant to generate the initial handler skeleton and then refactored it for validation and error handling.

Co-authored-by: ChatGPT <AI@users.noreply.github.com>"

undefined

backend
├── src
│ ├── config
│ │ └── db.js # MongoDB connection and config
│ ├── controllers
│ │ ├── auth.controller.js # register, login, OTP, Google auth handlers
│ │ └── sweet.controller.js# sweets CRUD + purchase/restock logic
│ ├── middleware
│ │ ├── auth.middleware.js # JWT verification and user extraction
│ │ └── admin.middleware.js# Admin role check
│ ├── models
│ │ ├── user.model.js # User schema (email, password hash, role, status)
│ │ └── sweet.model.js # Sweet schema (name, category, price, quantity)
│ ├── routes
│ │ ├── auth.routes.js # /api/auth/*
│ │ └── sweet.routes.js # /api/sweets/*
│ ├── utils
│ │ ├── email.js # Nodemailer configuration and email helpers
│ │ └── tokens.js # JWT creation and verification helpers
│ └── server.js # Express app setup and route mounting
├── package.json
└── ...



> File names can vary slightly, but the goal is to keep controllers, models, routes, middleware and utilities clearly separated.

---

### Backend Setup

From the project root:

cd backend
npm install


Create a `.env` file inside `backend`:

PORT=5000
MONGO_URI=mongodb://localhost:27017/sweet-shop

JWT configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

Email / OTP configuration (adjust to your provider)
EMAIL_FROM=no-reply@sweetshop.com
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

External OTP provider (if used)
OTP_PROVIDER_API_KEY=your_otp_provider_key

Google OAuth configuration (if enabled)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback



Start the backend server:

npm run dev # or npm start, depending on your scripts



The backend will run on:

- `http://localhost:5000`
- All API routes are under `/api` (for example: `/api/auth/login`, `/api/sweets`).

---

### Data Models

#### User

Typical fields:

- `email`: unique identifier for login.
- `password`: hashed password (never stored in plain text).
- `role`: `"User"` or `"Admin"`.
- `isVerified`: boolean flag for OTP/email verification.
- Optional fields for OTP (e.g. `otpCode`, `otpExpiresAt`) depending on implementation.

#### Sweet

Typical fields:

- `name`: sweet name (must be unique or validated).
- `category`: e.g. “Bengali”, “Dry Fruit”, etc.
- `price`: numeric price in INR.
- `quantity`: current stock level.
- Optional fields: `description`, `createdAt`, `updatedAt`.

---

### Authentication & Security (Backend)

#### Email + Password Auth

- `POST /api/auth/register`
  - Validates user input.
  - Hashes the password using a secure algorithm (like bcrypt).
  - Saves user record to MongoDB (optionally as unverified until OTP is confirmed).
  - Triggers OTP/email flow if enabled.

- `POST /api/auth/login`
  - Validates credentials.
  - Compares the provided password with stored password hash.
  - Checks if the account is verified (if OTP is used).
  - Issues a signed JWT containing user id and role.
  - Returns the token and basic user info to the client.

#### OTP / Email Verification

- On registration, backend can:
  - Generate an OTP code.
  - Store the OTP and its expiry time (in user document or a separate collection).
  - Send OTP via email using Nodemailer (configured with `SMTP_*` environment variables).

- User submits OTP to an endpoint like:
  - `POST /api/auth/verify-otp`
  - Backend verifies the OTP and expiry.
  - On success, marks the user as verified and allows login.

This prevents fake registrations and adds an extra security layer.

#### Google Login

- Frontend obtains a Google ID token using the Google client library.
- Backend exposes an endpoint (e.g. `POST /api/auth/google`) that:
  - Verifies the Google token.
  - Looks up an existing user by email or creates a new user record.
  - Issues a standard JWT that the rest of the app uses like normal login.

---

### JWT & Middleware

#### Auth Middleware

- Reads the `Authorization: Bearer <token>` header.
- Verifies the JWT using `JWT_SECRET`.
- If valid, attaches the decoded user (id, email, role) to `req.user`.
- If missing or invalid, responds with `401 Unauthorized`.

#### Admin Middleware

- Assumes `req.user` is already set by auth middleware.
- Checks `req.user.role === "Admin"`.
- If not admin, returns `403 Forbidden`.
- Used to protect routes like create/update/delete/restock sweets.

---

### Sweets & Inventory Logic

#### Sweets CRUD

All sweets routes are under `/api/sweets` and protected by JWT:

- `POST /api/sweets` (Admin only)  
  Creates a new sweet with `name`, `category`, `price`, `quantity`.

- `GET /api/sweets`  
  Returns all available sweets.

- `GET /api/sweets/search`  
  Accepts query params like `name`, `category`, `minPrice`, `maxPrice` and returns filtered sweets.

- `PUT /api/sweets/:id` (Admin only)  
  Updates sweet details.

- `DELETE /api/sweets/:id` (Admin only)  
  Deletes a sweet from the database.

#### Inventory Operations

- `POST /api/sweets/:id/purchase` (Authenticated user)  
  - Decreases stock by 1 (or by requested amount if designed that way).  
  - Validates that stock is greater than 0 before decrementing.  
  - Returns updated sweet data or an error if out of stock.

- `POST /api/sweets/:id/restock` (Admin only)  
  - Increases stock by a specified quantity.  
  - Used by admins to refill inventory from the dashboard.

All operations include error handling for invalid IDs, missing sweets, or insufficient stock.

---

### Error Handling & Validation

- Request bodies and query parameters are validated in controllers or using a validation library (for example, checking required fields and value ranges).
- Common error responses:
  - `400 Bad Request` for invalid input.
  - `401 Unauthorized` for missing/invalid token.
  - `403 Forbidden` for non-admin calling admin-only routes.
  - `404 Not Found` for non-existing resources.
- Error messages are designed to be clear and consumable by the frontend, which displays them to the user.

---

### Backend Tests

Tests are written using Jest and Supertest to follow a TDD-style workflow.

Run tests from the backend folder:

cd backend
npm test


Typical test coverage includes:

- **Auth**
  - Registration (valid and invalid input).
  - Login with correct and incorrect credentials.
  - Access to protected routes with and without tokens.
- **Sweets**
  - Creating, updating, deleting sweets as admin.
  - Preventing non-admins from performing restricted operations.
- **Inventory**
  - Purchasing sweets reduces quantity.
  - Prevent purchasing when quantity is zero.
  - Restocking increases quantity correctly.
- **Security**
  - JWT verification and role checks.
  - Rejecting requests with invalid or expired tokens.