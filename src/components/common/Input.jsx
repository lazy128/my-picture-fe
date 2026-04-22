import { cn } from '../../utils/helpers.js'
import { motion } from 'framer-motion'

const Input = ({
  label,
  error,
  className,
  type = 'text',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type={type}
          className={cn(
            'w-full bg-dark-800 border rounded-xl px-4 py-3 text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-aura-purple focus:border-transparent',
            'transition-all duration-300',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-dark-700 hover:border-dark-600',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input
