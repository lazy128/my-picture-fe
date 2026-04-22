import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'
import { ThemeProvider } from './hooks/useDarkMode.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ImageDetailPage from './pages/ImageDetailPage.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

import UploadPage from './pages/UploadPage.jsx' 

import './styles/globals.css'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#101e3e',
                color: '#dee5ff',
                border: '1px solid rgba(56,71,109,0.3)',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* CÁC ROUTE CẦN ĐĂNG NHẬP MỚI VÀO ĐƯỢC */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/hinh-anh/:id" element={<ProtectedRoute><ImageDetailPage /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* 2. KHAI BÁO ĐƯỜNG DẪN CHO TRANG UPLOAD */}
            <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App