import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Camera, Heart, Image, User, Home } from 'lucide-react'
import { cn } from '../../utils/helpers.js'

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/dashboard/gallery', icon: Image, label: 'Gallery' },
  { path: '/dashboard/saved', icon: Heart, label: 'Saved' },
  { path: '/dashboard/profile', icon: User, label: 'Profile' },
]

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed left-0 top-16 bottom-0 w-64 bg-dark-900/95 backdrop-blur-xl border-r border-dark-800 z-50 lg:translate-x-0"
      >
        <div className="p-4">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-aura-purple/20 to-aura-cyan/20 text-white border border-aura-purple/30'
                        : 'text-gray-400 hover:text-white hover:bg-dark-800'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-aura-purple/10 to-aura-cyan/10 border border-dark-700">
            <p className="text-sm text-gray-400 mb-2">My Picture v1.0</p>
            <p className="text-xs text-gray-500">Built with Three.js & Motion</p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
