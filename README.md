# 🚀 PurpleMerit
PurpleMerit is a high-performance **MERN Stack** application featuring a robust **Role-Based Access Control (RBAC)** system. It demonstrates professional backend architecture with standardized API handling and a centralized state-managed frontend.

[**Live Demo**](https://purple-merit-xi.vercel.app)

---

## 🛠️ Tech Stack & Core Features

| Category | Technologies & Features |
| :--- | :--- |
| **Frontend** | **React (Vite)**, Redux Toolkit, Tailwind CSS, Axios, Lucide Icons |
| **Backend** | **Node.js**, Express.js, JWT Auth (Access/Refresh Tokens), Bcrypt |
| **Database** | **MongoDB** (Mongoose ODM) |
| **Security** | RBAC Middleware (Admin/User), Protected Routes, Secure Cookie Handling |
| **Architecture** | Controller-Service-Model, Standardized `apiResponse` & `apiError` classes |

---

## ⚙️ Environment Configuration

Create a `.env` file in your root directory and paste the following:

```env
# Server & API
PORT=5000

CORS_ORIGIN=[https://purple-merit-xi.vercel.app](https://purple-merit-xi.vercel.app)

# Database
MONGO_URI= your mongo uri

# Auth Secrets
ACCESS_TOKEN_SECRET== your access token secret 
REFRESH_TOKEN_SECRET= your refresh token secret

```
### env for frontend
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1

```


# Clone and Install
git clone [https://github.com/adeedkhann/purplemerit.git](https://github.com/adeedkhann/purplemerit.git)
npm install

# Run Project (Concurrent or Separate)
cd backend && npm run dev
cd ../frontend && npm run dev
