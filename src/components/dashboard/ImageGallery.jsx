import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid, LayoutGrid, Loader2 } from 'lucide-react'
import { Card, Button, Loader, ImageCard } from '../common'
import { imageService } from '../../services'
import toast from 'react-hot-toast'

const ImageGallery = ({ images, loading, onImageDelete, onImageSelect }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [gridCols, setGridCols] = useState(3)
  const [searching, setSearching] = useState(false)

  const handleSearch = async (query) => {
    if (!query.trim()) {
      onImageSelect?.(null)
      return
    }
    setSearching(true)
    try {
      const results = await imageService.search(query)
      onImageSelect?.(results)
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setSearching(false)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length >= 2) {
      handleSearch(query)
    } else if (query.length === 0) {
      onImageSelect?.(null)
    }
  }

  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aura-purple transition-all"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-aura-purple animate-spin" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">View:</span>
          <div className="flex bg-dark-800 rounded-lg p-1">
            {[2, 3, 4].map((cols) => (
              <button
                key={cols}
                onClick={() => setGridCols(cols)}
                className={cn(
                  'p-2 rounded transition-colors',
                  gridCols === cols
                    ? 'bg-aura-purple/20 text-aura-purple'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {cols === 2 ? (
                  <Grid className="w-5 h-5" />
                ) : (
                  <LayoutGrid className="w-5 h-5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="lg" />
        </div>
      ) : images?.length > 0 ? (
        <motion.div
          layout
          className={cn('grid gap-6', gridClass[gridCols])}
        >
          <AnimatePresence mode="popLayout">
            {images.map((image, index) => (
              <motion.div
                key={image.hinh_id || index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <ImageCard
                  image={image}
                  onDelete={onImageDelete}
                  showActions={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card className="text-center py-20">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Images Found</h3>
            <p className="text-gray-400">
              {searchQuery
                ? 'Try a different search term'
                : 'Start by uploading your first picture!'}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ImageGallery
