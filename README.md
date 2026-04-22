# My Picture - Frontend

A modern, professional React frontend for a social image sharing platform featuring **Three.js animations**, **Framer Motion** interactions, and a beautiful **dark theme** with aura effects.

![React](https://img.shields.io/badge/React-18-61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-0.170-000000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF)

## Features

### Visual Effects
- **Three.js 3D Background** - Animated particle fields and floating geometric shapes
- **Framer Motion** - Smooth page transitions and micro-interactions
- **Dark Theme** - Professional aura dark mode with purple/cyan/pink accents
- **Glass Morphism** - Modern glass-style UI elements with backdrop blur
- **Gradient Effects** - Beautiful gradient backgrounds and buttons

### Functionality
- User Authentication (Login/Register)
- Protected Dashboard Routes
- Image Gallery with Grid Layout
- Image Search
- Save/Like Images
- User Profile Management
- Dark Mode Toggle
- Responsive Design (Mobile, Tablet, Desktop)

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI Framework |
| React Router | 6.28 | Navigation |
| Three.js | 0.170 | 3D Graphics |
| @react-three/fiber | 8.17 | React renderer for Three.js |
| @react-three/drei | 9.117 | Three.js helpers |
| Framer Motion | 12.8 | Animations |
| Tailwind CSS | 3.4 | Styling |
| Axios | 1.7 | HTTP Client |
| React Hot Toast | 2.4 | Notifications |
| Lucide React | 0.460 | Icons |

## Project Structure

```
my-picture-fe/
├── public/                    # Static assets
│   └── assets/
│       ├── images/
│       └── fonts/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── index.js
│   │   ├── auth/             # Auth-related components
│   │   │   ├── ThreeBackground.jsx  # Three.js animated background
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── index.js
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── index.js
│   │   └── dashboard/        # Dashboard components
│   │       ├── ImageCard.jsx
│   │       ├── ImageGallery.jsx
│   │       └── index.js
│   ├── pages/                # Page components
│   │   ├── LoginPage.jsx     # Login with Three.js background
│   │   ├── RegisterPage.jsx  # Register with Three.js background
│   │   └── DashboardPage.jsx # Main dashboard
│   ├── services/             # API services
│   │   ├── api.js            # Axios instance & interceptors
│   │   └── index.js          # Auth, User, Image, Article services
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.jsx       # Authentication state & methods
│   │   └── useDarkMode.jsx   # Dark mode toggle & persistence
│   ├── utils/                # Utilities
│   │   ├── constants.js      # Routes, API endpoints, messages
│   │   └── helpers.js        # Helper functions
│   ├── styles/               # Global styles
│   │   └── globals.css       # Tailwind imports + custom styles
│   ├── App.jsx               # Main app component with routing
│   └── main.jsx              # React entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Backend Integration

This frontend connects to the **Express.js** backend running on port **3069**.

### API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/dang-ky` | POST | Register new user | No |
| `/auth/dang-nhap` | POST | Login user | No |
| `/nguoi-dung/me` | GET | Get current user profile | Yes |
| `/nguoi-dung/me` | PUT | Update user profile | Yes |
| `/nguoi-dung/anh-da-luu` | GET | Get saved images | Yes |
| `/nguoi-dung/anh-da-tao` | GET | Get user's uploaded images | Yes |
| `/hinh-anh` | GET | Get all images | No |
| `/hinh-anh/tim-kiem` | GET | Search images | No |
| `/hinh-anh/:id` | GET | Get image by ID | Yes |
| `/hinh-anh` | POST | Upload image | Yes |
| `/hinh-anh/:id` | DELETE | Delete image | Yes |
| `/hinh-anh/:id/luu` | POST | Save/unsave image | Yes |
| `/hinh-anh/:id/binhluan` | GET | Get comments | Yes |
| `/hinh-anh/:id/binhluan` | POST | Add comment | Yes |

### Database Schema (Prisma)

The backend uses **Prisma ORM** with **MySQL**:

```prisma
model nguoi_dung {
  nguoi_dung_id Int         @id @default(autoincrement())
  email         String      @unique
  mat_khau      String?
  ho_ten        String?
  tuoi          Int?
  anh_dai_dien  String?
  // ... relationships
}

model hinh_anh {
  hinh_id       Int         @id @default(autoincrement())
  ten_hinh      String?
  duong_dan     String?
  mo_ta         String?
  nguoi_dung_id Int?
  // ... relationships
}

model binh_luan {
  binh_luan_id   Int       @id @default(autoincrement())
  nguoi_dung_id  Int?
  hinh_id        Int?
  noi_dung       String?
}

model luu_anh {
  nguoi_dung_id Int
  hinh_id       Int
  @@id([nguoi_dung_id, hinh_id])
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend server running on port 3069

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```
   VITE_API_URL=http://localhost:3069/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id (optional)
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

### Build for Production

```bash
npm run build
```

Preview:
```bash
npm run preview
```

## Key Features Explained

### 1. Three.js Animated Backgrounds

Located in `src/components/auth/ThreeBackground.jsx`:

- **ParticleField** - 2000+ particles that rotate slowly
- **FloatingShape** - Wireframe icosahedrons with bobbing animation
- Uses `@react-three/fiber` for React integration
- Performance optimized with `frustumCulled={false}`

```jsx
<ThreeBackground />
```

### 2. Dark Theme & Aura Effects

Custom Tailwind configuration with aura colors:

```js
// tailwind.config.js
colors: {
  aura: {
    purple: '#8b5cf6',
    blue: '#3b82f6',
    pink: '#ec4899',
    cyan: '#06b6d4',
  }
}
```

### 3. Authentication Flow

The `useAuth` hook manages auth state:

```jsx
const { user, login, register, logout, isAuthenticated } = useAuth()
```

- Automatically validates JWT token on app load
- Stores user in localStorage
- Protected routes via `ProtectedRoute` component
- Axios interceptor adds Authorization header

### 4. Motion Animations

Framer Motion is used throughout:

- Page transitions: `initial={{ opacity: 0 }} animate={{ opacity: 1 }}`
- Card hover: `whileHover={{ scale: 1.02, y: -5 }}`
- Layout animations: `<AnimatePresence mode="popLayout">`
- Staggered list items: `transition={{ delay: index * 0.05 }}`

## API Service Layer

All API calls are centralized in `src/services/`:

```js
import { authService, imageService, userService } from '@/services'

// Register
await authService.register({ email, password, name })

// Get images
const images = await imageService.getAll()

// Save image
await imageService.save(imageId)
```

Each service method handles:
- Request configuration
- Error handling via toast notifications
- Cookie-based auth (access token stored in cookie by BE)

## Component Architecture

### Reusable Components

- **Button** - Multiple variants (primary, secondary, ghost, danger) with loading state
- **Input** - With icons, labels, validation errors, focus states
- **Card** - Glass morphism style with hover effects
- **Loader** - Simple spinner component

### Layout Components

- **DashboardLayout** - Main layout with sidebar & header
- **Header** - Logo, search, user menu, dark mode toggle
- **Sidebar** - Navigation with active state indicator

## Design Decisions

1. **Dark Theme Default** - Modern, reduces eye strain, looks premium
2. **Aura Colors** - Purple/cyan/pink gradients for visual interest
3. **Glass Morphism** - `bg-dark-900/80 backdrop-blur-xl` for depth
4. **Three.js Only on Auth** - Performance optimization for dashboard
5. **Cookie-based Auth** - Backend handles JWT in cookies (more secure)
6. **Grid Layouts** - Responsive image galleries (2/3/4 columns)

## Troubleshooting

### Three.js Not Loading
- Ensure `THREE` is imported: `import * as THREE from 'three'`
- Check browser WebGL support
- Check console for errors

### CORS Issues
- Backend must run on port 3069
- `vite.config.js` proxy configured for `/api`

### Auth Not Working
- Check backend is running
- Verify cookies are enabled
- Check `.env` has correct `VITE_API_URL`

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install`
- Ensure Node 18+

## License

ISC

---

Built with passion for beautiful, performant web experiences.
