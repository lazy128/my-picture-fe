import { cn } from '../../utils/helpers.js'
import { motion } from 'framer-motion'

const Card = ({
  children,
  className,
  hover = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={cn(
        'bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-2xl',
        'shadow-xl shadow-black/20 overflow-hidden',
        hover && 'cursor-pointer transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
