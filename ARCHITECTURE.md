# My Picture - Full-Stack Architecture

## Overview

This document provides a comprehensive overview of the My Picture application, connecting the Express.js backend with the React frontend.

## System Architecture

```
┌─────────────────┐
│   User/Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │  (Vite + React 18)
│  Port: 3000     │  - Three.js animations
│  my-picture-fe  │  - Framer Motion
└────────┬────────┘  - Tailwind CSS
         │
         │ HTTP Requests (proxied to /api)
         ▼
┌─────────────────┐
│  Express.js BE  │  (Port: 3069)
│  expressjs/     │  - Prisma ORM
│                 │  - MySQL Database
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MySQL DB     │
└─────────────────┘
```

## Frontend Architecture

### Routing Structure
```
/login                    → LoginPage (with Three.js background)
/register                 → RegisterPage (with Three.js background)
/dashboard                → DashboardPage (protected)
/dashboard/gallery        → ImageGallery (sub-route)
/dashboard/saved          → Saved images (sub-route)
/dashboard/profile        → User profile (sub-route)
```

### Component Hierarchy

```
App.jsx
├── ThemeProvider (dark mode context)
├── AuthProvider (auth context)
└── BrowserRouter
    ├── LoginPage
    │   └── ThreeBackground (Three.js particles + floating shapes)
    │   └── Auth Form (Button, Input components)
    ├── RegisterPage
    │   └── ThreeBackground
    │   └── Registration Form
    └── ProtectedRoute
        └── DashboardLayout
            ├── Header (user menu, dark toggle)
            ├── Sidebar (navigation)
            └── Main Content
                └── DashboardPage
                    ├── Stats Cards
                    └── ImageGallery
                        └── ImageCard (multiple)
```

### State Management

**Context Hooks:**
- `useAuth()` - User auth state, login/logout/register
- `useDarkMode()` - Dark mode toggle, localStorage persistence

**Local State (component-level):**
- Form inputs (Login/Register)
- Loading states
- Search queries
- UI toggles (sidebar, menus)

### API Layer

```
src/services/
├── api.js              → Axios instance with interceptors
├── index.js            → Combined exports
├── auth.js             → authService (register, login)
├── users.js            → userService (getCurrentUser, updateProfile)
├── images.js           → imageService (CRUD, search, save)
└── articles.js         → articleService (optional)
```

**Interceptor Behavior:**
- Request: Adds `Authorization: Bearer <token>` from localStorage
- Response: Handles 401 → redirects to /login

## Backend Architecture

### Router Structure (`src/routers/`)

| Router | Routes | Auth Required |
|--------|--------|---------------|
| `auth.router.js` | POST `/dang-ky`<br>POST `/dang-nhap` | No |
| `nguoi-dung.router.js` | GET `/me`<br>GET `/anh-da-luu`<br>GET `/anh-da-tao`<br>PUT `/me` | Yes |
| `hinh-anh.router.js` | GET `/`<br>GET `/tim-kiem`<br>GET `/:id`<br>POST `/`<br>POST `/:id/luu`<br>DELETE `/:id` | Mixed* |
| `article.router.js` | GET/POST/PUT/DELETE `/` | Yes |

*Some image routes are public (GET `/`, GET `/tim-kiem`), others require auth.

### Authentication Flow

1. **Login/Register:**
   - Frontend sends `{ email, matkhau }` to `/auth/dang-nhap`
   - Backend verifies bcrypt hash
   - Backend creates JWT via `tokenService.createAccessToken(userId)`
   - Backend sets cookie: `res.cookie("accessToken", accessToken)`
   - Frontend stores nothing (relies on cookie + localStorage user)

2. **Protected Routes:**
   - Frontend includes token in cookie automatically
   - `protect` middleware:
     - Reads token from `req.cookies.accessToken`
     - Verifies JWT via `tokenService.verifyAccessToken()`
     - Fetches user from DB
     - Attaches `req.user`
     - Calls `next()`

3. **API Calls:**
   - Axios automatically sends cookie (withCredentials: true)
   - Backend reads token from cookie (NOT Authorization header)
   - Token is HttpOnly cookie (more secure)

### Database Schema

**Tables:**
- `nguoi_dung` (users) - email, mat_khau (hashed), ho_ten, tuoi, anh_dai_dien
- `hinh_anh` (images) - ten_hinh, duong_dan (Cloudinary URL), mo_ta, nguoi_dung_id
- `binh_luan` (comments) - noi_dung, nguoi_dung_id, hinh_id
- `luu_anh` (saved) - Composite PK (nguoi_dung_id, hinh_id)

**Relations:**
- User → Many Images
- User → Many Comments
- Image → Many Comments
- User ↔ Image (Many-to-Many via luu_anh)

## Data Flow Examples

### 1. User Registration
```
Frontend: POST /auth/dang-ky { email, matkhau, ho_ten, tuoi }
  ↓
Backend: Check if email exists
  ↓
Backend: bcrypt.hashSync(matkhau, 10)
  ↓
Backend: prisma.nguoi_dung.create({...})
  ↓
Frontend: Show "Register success, please login"
  ↓
User redirected to /login
```

### 2. View Dashboard Images
```
Frontend (mounted): userService.getCurrentUser()
  ↓ (cookie sent automatically)
Backend: protect middleware → verify token → get user
  ↓
imageService.getAll()
  ↓
Backend: prisma.hinh_anh.findMany({ include: { nguoi_dung: true } })
  ↓
Frontend: Set images state → Render ImageGallery
```

### 3. Save Image
```
Frontend: imageService.save(imageId)
  ↓ (POST /hinh-anh/:id/luu with cookie)
Backend: protect → get user from token
  ↓
prisma.luu_anh.upsert({ nguoi_dung_id: user.id, hinh_id: imageId })
  ↓
Frontend: Update UI (heart icon filled)
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3069/api
VITE_GOOGLE_CLIENT_ID=xxx (optional)
```

### Backend (.env)
```env
DATABASE_URL="mysql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRE="7d"
COOKIE_MAX_AGE=604800000
```

## Running the Application

### Start Backend
```bash
cd expressjs
npm install
npx prisma db pull && npx prisma generate
npm run dev  # Port 3069
```

### Start Frontend
```bash
cd my-picture-fe
npm install
npm run dev  # Port 3000
```

Open http://localhost:3000

## API Testing

### Swagger Docs
- Available at: `http://localhost:3069/api-docs`
- Interactive API documentation

### Register User
```bash
curl -X POST http://localhost:3069/api/auth/dang-ky \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","matkhau":"123456","ho_ten":"Test User","tuoi":25}'
```

### Login
```bash
curl -X POST http://localhost:3069/api/auth/dang-nhap \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","matkhau":"123456"}' \
  -c cookies.txt
```

## Deployment Notes

### Frontend Build
```bash
npm run build
# Output in dist/ folder
# Deploy dist/ to any static hosting (Vercel, Netlify, etc.)
```

### Backend Deployment
- Set production environment variables
- Configure MySQL connection
- Run: `npm start` or use PM2

### CORS
BE CORS config: `app.use(cors({ origin: ["http://localhost:3000"] }))`
Add production URL when deploying.

## File Reference

### Frontend Key Files
- `src/App.jsx` - Routing setup
- `src/pages/LoginPage.jsx` - Login UI + Three.js
- `src/pages/DashboardPage.jsx` - Main dashboard
- `src/components/auth/ThreeBackground.jsx` - 3D effects
- `src/hooks/useAuth.jsx` - Auth logic
- `src/services/api.js` - HTTP client

### Backend Key Files
- `expressjs/server.js` - Express app setup
- `expressjs/src/routers/auth.router.js` - Auth endpoints
- `expressjs/src/services/auth.service.js` - Auth business logic
- `expressjs/src/controllers/auth.controller.js` - Request handlers
- `expressjs/prisma/schema.prisma` - Database schema
- `expressjs/src/common/middlewares/protect.middleware.js` - Auth guard

---

**Last Updated:** 2025-04-21
**Version:** 1.0
