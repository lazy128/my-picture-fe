import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, LogOut, User, Camera } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useDarkMode } from '../../hooks/useDarkMode.jsx'
import { cn } from '../../utils/helpers.js'

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800 z-40">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-dark-800 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-300" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aura-purple to-aura-pink flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              My Picture
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-300" />
            )}
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aura-cyan to-aura-blue flex items-center justify-center">
                {user?.anh_dai_dien ? (
                  <img
                    src={user.anh_dai_dien}
                    alt={user.ho_ten}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <span className="text-sm text-gray-300 hidden md:block max-w-[100px] truncate">
                {user?.ho_ten || 'User'}
              </span>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 glass-dark rounded-xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-dark-700">
                    <p className="text-white font-medium truncate">
                      {user?.ho_ten}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-800 text-gray-300 hover:text-white transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-800 text-gray-300 hover:text-white transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      Settings
                    </button>
                    <hr className="my-2 border-dark-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-800 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
