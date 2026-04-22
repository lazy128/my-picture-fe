import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowLeft } from 'lucide-react'
import { Button, Input } from "../components/common";
import { useAuth } from "../hooks/useAuth.jsx";
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    tuoi: '',
    mat_khau: '',
    confirmPassword: '',
    anh_dai_dien: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.ho_ten.trim()) newErrors.ho_ten = 'Vui lòng nhập họ tên'
    if (!formData.email) newErrors.email = 'Vui lòng nhập email'
    if (!formData.tuoi) newErrors.tuoi = 'Vui lòng nhập tuổi'
    if (!formData.mat_khau) newErrors.mat_khau = 'Vui lòng nhập mật khẩu'
    if (formData.mat_khau.length < 6) newErrors.mat_khau = 'Mật khẩu phải ít nhất 6 ký tự'
    if (formData.mat_khau !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await register({
        ho_ten: formData.ho_ten,
        email: formData.email,
        tuoi: parseInt(formData.tuoi),
        mat_khau: formData.mat_khau,
        anh_dai_dien: formData.anh_dai_dien || undefined,
      })
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      setTimeout(() => navigate('/login'), 1000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  return (
<div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* --- BẮT ĐẦU NỀN CSS AURA TỪ HTML --- */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#060e20', zIndex: 0 }}>
        {/* Lớp phủ sáng trên cùng */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(255, 134, 195, 0.15) 0%, rgba(6, 14, 32, 0) 70%)', pointerEvents: 'none' }} />
        {/* Quả cầu sáng màu hồng (trên trái) */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', backgroundColor: 'rgba(255, 134, 195, 0.05)', filter: 'blur(120px)', pointerEvents: 'none' }} />
        {/* Quả cầu sáng màu xanh (dưới phải) */}
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', backgroundColor: 'rgba(47, 217, 244, 0.05)', filter: 'blur(150px)', pointerEvents: 'none' }} />
      </div>
      {/* --- KẾT THÚC NỀN --- */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass-dark rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-aura-cyan to-aura-blue mb-4 shadow-lg shadow-aura-cyan/25"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join the My Picture community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Input
                label="Full Name"
                type="text"
                name="ho_ten"
                placeholder="Your full name"
                value={formData.ho_ten}
                onChange={handleChange}
                error={errors.ho_ten}
                required
              />
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <Input
                label="Age"
                type="number"
                name="tuoi"
                placeholder="Your age"
                value={formData.tuoi}
                onChange={handleChange}
                error={errors.tuoi}
                min="1"
                max="120"
                required
              />
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="mat_khau"
                placeholder="Create a password"
                value={formData.mat_khau}
                onChange={handleChange}
                error={errors.mat_khau}
                required
              />
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
            </motion.div>

            {/* Toggle show password */}
            <div
              onClick={() => setShowPassword(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}
              className="text-gray-400 text-sm"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Đang tạo tài khoản...' : 'Create Account'}
              </Button>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-aura-cyan hover:text-aura-blue transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Link to="/" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage