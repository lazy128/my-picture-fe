import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import toast from 'react-hot-toast'

const aura = {
  surface: '#060e20', surfaceHigh: '#101e3e', surfaceVariant: '#142449',
  primary: '#ff86c3', primaryContainer: '#f673b7', secondary: '#2fd9f4',
  tertiary: '#cebdff', onSurface: '#dee5ff', onSurfaceVariant: '#9baad6',
  outline: '#65759e', outlineVariant: '#38476d',
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', mat_khau: '' })  // ← đổi
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [focused, setFocused] = useState('')

  const validate = () => {
    const e = {}
    if (!formData.email) e.email = 'Vui lòng nhập email'
    if (!formData.mat_khau) e.mat_khau = 'Vui lòng nhập mật khẩu'  // ← đổi
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(formData.email, formData.mat_khau)  // ← đổi
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const inputStyle = (name) => ({
    width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
    background: focused === name ? 'rgba(20,36,73,0.5)' : 'rgba(20,36,73,0.25)',
    border: `1px solid ${errors[name] ? 'rgba(253,111,133,0.5)' : focused === name ? 'rgba(255,134,195,0.35)' : 'rgba(56,71,109,0.3)'}`,
    borderRadius: '0.875rem', color: aura.onSurface,
    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none',
    transition: 'all 0.3s ease', boxSizing: 'border-box',
    boxShadow: focused === name ? '0 0 15px rgba(255,134,195,0.08)' : 'none',
  })

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: aura.surface, fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

 {/* --- NỀN CSS AURA MỚI (THAY THẾ SVG CŨ) --- */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#060e20', zIndex: 0 }}>
        {/* Lớp nền cực quang 3 điểm */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 30%, rgba(255, 134, 195, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(47, 217, 244, 0.1) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(206, 189, 255, 0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        {/* Quả cầu sáng trung tâm 1 */}
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: '24rem', height: '24rem', borderRadius: '50%', backgroundColor: 'rgba(255, 134, 195, 0.05)', filter: 'blur(80px)', mixBlendMode: 'screen', pointerEvents: 'none' }} />
        {/* Quả cầu sáng trung tâm 2 */}
        <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '500px', height: '500px', borderRadius: '50%', backgroundColor: 'rgba(47, 217, 244, 0.03)', filter: 'blur(100px)', mixBlendMode: 'screen', pointerEvents: 'none' }} />
      </div>
      {/* -------------------------------------- */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(20,36,73,0.5)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(56,71,109,0.3)', borderRadius: '9999px',
          padding: '0.5rem 1rem', cursor: 'pointer',
          color: aura.onSurfaceVariant, fontSize: '0.8rem', fontWeight: 500,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = aura.onSurface; e.currentTarget.style.borderColor = 'rgba(255,134,195,0.3)' }}
        onMouseLeave={e => { e.currentTarget.style.color = aura.onSurfaceVariant; e.currentTarget.style.borderColor = 'rgba(56,71,109,0.3)' }}
      >
        <ArrowLeft size={14} /> Trang chủ
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: '420px', margin: '0 1.5rem',
          background: 'rgba(16,30,62,0.6)', backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(56,71,109,0.2)',
          borderRadius: '1.5rem', padding: '2.5rem',
          boxShadow: '0 0 60px rgba(255,134,195,0.06), 0 24px 48px rgba(0,0,0,0.3)',
          position: 'relative', zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              width: '3.5rem', height: '3.5rem', borderRadius: '1rem', margin: '0 auto 1.25rem',
              background: `linear-gradient(135deg, ${aura.primary}, ${aura.primaryContainer})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(255,134,195,0.3)',
            }}
          >
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#5f003e' }}>A</span>
          </motion.div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em',
            color: aura.onSurface, marginBottom: '0.4rem',
          }}>Welcome Back</h1>
          <p style={{ color: aura.onSurfaceVariant, fontSize: '0.875rem' }}>Đăng nhập vào tài khoản Aura của bạn</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Email */}
          <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: aura.onSurfaceVariant, marginBottom: '0.5rem' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                color: focused === 'email' ? aura.primary : aura.outline, transition: 'color 0.2s', pointerEvents: 'none',
              }} />
              <input
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                style={inputStyle('email')}
              />
            </div>
            {errors.email && <p style={{ fontSize: '0.75rem', color: '#fd6f85', marginTop: '0.35rem' }}>{errors.email}</p>}
          </motion.div>

          {/* Mat khau */}
          <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: aura.onSurfaceVariant, marginBottom: '0.5rem' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                color: focused === 'mat_khau' ? aura.primary : aura.outline, transition: 'color 0.2s', pointerEvents: 'none',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="mat_khau"                          // ← đổi
                placeholder="Nhập mật khẩu"
                value={formData.mat_khau}                // ← đổi
                onChange={handleChange}
                onFocus={() => setFocused('mat_khau')}   // ← đổi
                onBlur={() => setFocused('')}
                style={{ ...inputStyle('mat_khau'), paddingRight: '3rem' }}  // ← đổi
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem',
                  color: aura.outline, display: 'flex', alignItems: 'center', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = aura.primary}
                onMouseLeave={e => e.currentTarget.style.color = aura.outline}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.mat_khau && <p style={{ fontSize: '0.75rem', color: '#fd6f85', marginTop: '0.35rem' }}>{errors.mat_khau}</p>}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '0.9rem',
              background: loading ? 'rgba(255,134,195,0.4)' : `linear-gradient(135deg, ${aura.primary}, ${aura.primaryContainer})`,
              border: 'none', borderRadius: '9999px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem',
              color: '#5f003e', marginTop: '0.5rem',
              boxShadow: loading ? 'none' : '0 0 25px rgba(255,134,195,0.3)',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '1rem', height: '1rem', borderRadius: '50%',
                  border: '2px solid rgba(95,0,62,0.3)', borderTopColor: '#5f003e',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Đang đăng nhập...
              </>
            ) : 'Đăng nhập'}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: aura.onSurfaceVariant }}
        >
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: aura.primary, fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = aura.primaryContainer}
            onMouseLeave={e => e.target.style.color = aura.primary}
          >Đăng ký</Link>
        </motion.p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
    </div>
  )
}