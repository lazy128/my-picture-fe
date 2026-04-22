import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Eye, Trash2, Download } from 'lucide-react'
import { Card } from '../common'
import { useAuth } from '../../hooks/useAuth'
import { imageService } from '../../services'
import toast from 'react-hot-toast'
import { formatDate, truncateText, cn } from '../../utils/helpers'

const ImageCard = ({ image, onDelete, showActions = true }) => {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(image.likeCount || 0)
  const [isSaving, setIsSaving] = useState(false)

  const isOwner = user?.nguoi_dung_id === image.nguoi_dung_id

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      if (isSaving) {
        await imageService.unsave(image.hinh_id)
        setIsLiked(false)
        setLikes((prev) => prev - 1)
        toast.success('Removed from saved')
      } else {
        await imageService.save(image.hinh_id)
        setIsLiked(true)
        setLikes((prev) => prev + 1)
        toast.success('Added to saved')
      }
    } catch (error) {
      toast.error('Failed to update')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
      await imageService.delete(image.hinh_id)
      toast.success('Image deleted')
      onDelete?.(image.hinh_id)
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="overflow-hidden group">
        <div className="relative aspect-square overflow-hidden bg-dark-800">
          {image.duong_dan ? (
            <motion.img
              src={image.duong_dan}
              alt={image.ten_hinh || 'Image'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
              <Camera className="w-12 h-12 text-gray-600" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                      'p-2 rounded-full transition-colors',
                      isLiked
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    )}
                  >
                    <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
                  </motion.button>
                  <span className="text-white text-sm">{likes}</span>
                </div>

                {isOwner && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {image.createdAt && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-xs text-gray-300">
              {formatDate(image.createdAt)}
            </div>
          )}
        </div>

        <div className="p-4">
          {image.ten_hinh && (
            <h3 className="font-semibold text-white mb-1 truncate">
              {image.ten_hinh}
            </h3>
          )}
          {image.mo_ta && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {truncateText(image.mo_ta, 100)}
            </p>
          )}
          {image.nguoi_dung && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-aura-purple to-aura-pink flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {image.nguoi_dung.ho_ten?.[0] || 'U'}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {image.nguoi_dung.ho_ten}
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default ImageCard
