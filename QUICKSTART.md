# QUICK START GUIDE

## 📁 Project Structure

```
my-picture-fe/
├── src/
│   ├── components/
│   │   ├── common/          → Button, Input, Card, Loader
│   │   ├── auth/            → ThreeBackground, ProtectedRoute
│   │   ├── layout/          → Header, Sidebar, DashboardLayout
│   │   └── dashboard/       → ImageCard, ImageGallery
│   ├── pages/               → LoginPage, RegisterPage, DashboardPage
│   ├── services/            → API layer (auth, images, users, articles)
│   ├── hooks/               → useAuth, useDarkMode
│   ├── utils/               → helpers, constants
│   └── styles/              → globals.css (Tailwind)
├── index.html
├── package.json
└── README.md
```

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

1. **Set backend URL** in `.env`:
   ```
   VITE_API_URL=http://localhost:3069/api
   ```

2. **Backend must be running** on port 3069:
   ```bash
   cd ../expressjs
   npm run dev
   ```

## 🎨 Key Features Built

✅ **Three.js Animations** - Login/Register pages with particle fields & floating shapes  
✅ **Dark Theme** - Professional dark mode with purple/cyan/pink aura colors  
✅ **Framer Motion** - Smooth page transitions & micro-interactions  
✅ **Glass Morphism** - Modern glass-style UI elements  
✅ **Authentication** - Complete auth flow (login, register, protected routes)  
✅ **Image Gallery** - Grid layout with search, responsive columns (2/3/4)  
✅ **API Integration** - Full connectivity with Express.js backend  
✅ **Responsive Design** - Mobile-first with sidebar navigation  

## 🔗 Backend Connection

All API calls go to `VITE_API_URL` (default: `http://localhost:3069/api`)

**Auth endpoints:**
- POST `/auth/dang-ky` - Register
- POST `/auth/dang-nhap` - Login

**Image endpoints:**
- GET `/hinh-anh` - Get all images
- GET `/hinh-anh/tim-kiem?query=` - Search
- POST `/hinh-anh` - Upload (requires auth)
- POST `/hinh-anh/:id/luu` - Save/unsave

**User endpoints:**
- GET `/nguoi-dung/me` - Current user
- PUT `/nguoi-dung/me` - Update profile

## 📝 Notes

- Backend uses **cookie-based JWT** (not localStorage token)
- Frontend sends cookies automatically via `withCredentials: true`
- `ThreeBackground` component only loads on auth pages (performance)
- Dark mode is stored in localStorage & applied on app init
- All icons from **Lucide React**
- Grid uses **Tailwind CSS** responsive classes

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank screen | Check console, ensure Three.js loaded |
| 401 errors | Backend not running, check VITE_API_URL |
| Styles broken | Run `npm install` to get Tailwind |
| Module errors | Ensure Node 18+, delete node_modules & reinstall |

---

**Ready to deploy?** Run `npm run build` → Deploy `dist/` folder to Vercel/Netlify!
