import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/index.js'
import { userService } from '../services/index.js'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token && !user) {
        try {
          const userData = await userService.getCurrentUser()
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (error) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, mat_khau) => {
    const result = await authService.login(email, mat_khau)
    localStorage.setItem('accessToken', result.accessToken)
    const userData = await userService.getCurrentUser()
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    navigate('/')
    return result
  }

  const register = async (userData) => {
    return await authService.register(userData)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const updateUser = (newData) => {
    const updated = { ...user, ...newData }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateUser,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}