import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Camera, LogIn, LogOut } from 'lucide-react'
import { imageService } from '../services'
import { useAuth } from '../hooks/useAuth.jsx'
import toast from 'react-hot-toast'
import api from '../services/api.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3069/api'

const getImageUrl = (path) => {
  if (!path) return '';
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Ensure single slash between API_URL and path
  const base = API_URL.replace(/\/+$/, '');
  const imgPath = path.replace(/^\/+/, '');
  return `${base}/${imgPath}`;
};

const aura = {
  surface: '#060e20', surfaceHigh: '#101e3e', surfaceVariant: '#142449',
  primary: '#ff86c3', primaryContainer: '#f673b7', secondary: '#2fd9f4',
  onSurface: '#dee5ff', onSurfaceVariant: '#9baad6', outlineVariant: '#38476d',
}

// Danh sách các danh mục phân loại
const CATEGORIES = [
  'Tất cả', 'Thiết kế', 'Phong cảnh', 'Anime', 'Động vật', 'Xe cộ', 'Nghệ thuật', 'Cyberpunk', 'Meme','Khác'
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  
  // States cho tìm kiếm và phân loại
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  useEffect(() => { fetchImages() }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const data = await imageService.getAll()
      setImages(data || [])
    } catch {
      toast.error('Không tải được ảnh')
      setImages([])
    } finally {
      setLoading(false)
    }
  }

const handleSearch = async (e) => {
  e.preventDefault()
  setActiveCategory('')
  if (!search.trim()) {
    setActiveCategory('Tất cả')
    return fetchImages()
  }
  setSearching(true)
  try {
    const data = await imageService.search(search.trim())
    setImages(data || [])
  } catch { toast.error('Tìm kiếm thất bại') }
  finally { setSearching(false) }
}

  // Hàm xử lý khi bấm vào các nút Phân loại (Filter)
  const handleCategoryClick = async (category) => {
    setActiveCategory(category)
    setSearch(category === 'Tất cả' ? '' : category)
    
    if (category === 'Tất cả') {
      return fetchImages()
    }

    setSearching(true)
    try {
      const data = await imageService.search(category)
      setImages(data || [])
    } catch { toast.error('Lọc ảnh thất bại') }
    finally { setSearching(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', background: aura.surface, color: aura.onSurface,
      fontFamily: 'Inter, sans-serif',
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(255,134,195,0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 75%, rgba(47,217,244,0.08) 0%, transparent 40%)
      `,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 2rem',
        background: 'rgba(6,14,32,0.75)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(56,71,109,0.12)',
        gap: '1rem',
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', flexShrink: 0,
          background: `linear-gradient(135deg, ${aura.primary}, ${aura.primaryContainer})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          cursor: 'pointer'
        }} onClick={() => { setSearch(''); setActiveCategory('Tất cả'); fetchImages(); }}>
          Aura
        </span>

        {/* Thanh Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <Search size={15} style={{
            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
            color: aura.onSurfaceVariant, pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm ảnh..."
            style={{
              width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem',
              background: 'rgba(20,36,73,0.5)', border: '1px solid rgba(56,71,109,0.3)',
              borderRadius: '9999px', color: aura.onSurface,
              fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', outline: 'none',
            }}
          />
        </form>

        {/* User Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, alignItems: 'center' }}>
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')} style={{
                padding: '0.55rem 1.1rem', borderRadius: '9999px',
                background: 'rgba(20,36,73,0.5)', border: '1px solid rgba(56,71,109,0.3)',
                color: aura.onSurfaceVariant, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
              }}>
                Dashboard
              </button>
              <div
                onClick={() => navigate('/dashboard')}
                style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${aura.primary}44, ${aura.secondary}44)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid rgba(255,134,195,0.2)`, cursor: 'pointer', overflow: 'hidden',
                }}
              >
                {user?.anh_dai_dien
                  ? <img src={getImageUrl(user.anh_dai_dien)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '0.875rem', fontWeight: 700, color: aura.primary }}>
                      {user?.ho_ten?.[0]?.toUpperCase() || 'U'}
                    </span>
                }
              </div>
              <button onClick={logout} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1.1rem', borderRadius: '9999px',
                background: 'rgba(20,36,73,0.5)', border: '1px solid rgba(56,71,109,0.3)',
                color: aura.onSurfaceVariant, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
              }}>
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 1.1rem', borderRadius: '9999px',
              background: `linear-gradient(135deg, ${aura.primary}, ${aura.primaryContainer})`,
              border: 'none', color: '#5f003e', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 700,
            }}>
              <LogIn size={14} /> Đăng nhập
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6.5rem 1.5rem 4rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.04em', color: aura.onSurface, lineHeight: 1.1,
            marginBottom: '0.75rem',
          }}>
            Khám phá những bức ảnh{' '}
            <span style={{
              background: `linear-gradient(135deg, ${aura.primary}, ${aura.secondary})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>tuyệt vời</span>
          </h1>
        </motion.div>

        {/* THANH PHÂN LOẠI (FILTER BAR) SIÊU MƯỢT */}
        <div 
          className="hide-scrollbar"
          style={{ 
            display: 'flex', gap: '0.75rem', overflowX: 'auto', 
            paddingBottom: '0.5rem', marginBottom: '2rem', 
            justifyContent: 'center', WebkitOverflowScrolling: 'touch'
          }}
        >
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={{
                whiteSpace: 'nowrap', padding: '0.6rem 1.25rem',
                borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600,
                transition: 'all 0.2s', cursor: 'pointer',
                background: activeCategory === category ? aura.primary : 'rgba(20,36,73,0.5)',
                color: activeCategory === category ? '#5f003e' : aura.onSurface,
                border: activeCategory === category ? 'none' : '1px solid rgba(56,71,109,0.3)',
                boxShadow: activeCategory === category ? '0 0 15px rgba(255,134,195,0.3)' : 'none'
              }}
              onMouseEnter={e => { if(activeCategory !== category) e.currentTarget.style.borderColor = aura.primary }}
              onMouseLeave={e => { if(activeCategory !== category) e.currentTarget.style.borderColor = 'rgba(56,71,109,0.3)' }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Lưới ảnh */}
        {loading || searching ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <div style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '50%',
              border: `2px solid rgba(255,134,195,0.15)`, borderTopColor: aura.primary,
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        ) : images.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4"
          >
            {images.map((img, i) => (
              <motion.div
                key={img.hinh_id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/hinh-anh/${img.hinh_id}`)}
                style={{
                  breakInside: 'avoid', marginBottom: '1rem',
                  borderRadius: '1rem', overflow: 'hidden',
                  cursor: 'pointer', position: 'relative',
                  background: aura.surfaceHigh,
                }}
              >
                {img.duong_dan
                  ? <img
                      src={getImageUrl(img.duong_dan)}
                      alt={img.ten_hinh}
                      style={{ width: '100%', display: 'block', borderRadius: '1rem' }}
                      loading="lazy"
                    />
                  : <div style={{
                      height: '200px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', background: aura.surfaceVariant,
                    }}>
                      <Camera size={32} style={{ color: aura.outlineVariant }} />
                    </div>
                }
                
                <div className="img-overlay" style={{
                  position: 'absolute', inset: 0, borderRadius: '1rem',
                  background: 'linear-gradient(to top, rgba(6,14,32,0.8) 0%, transparent 50%)',
                  opacity: 0, transition: 'opacity 0.2s',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', padding: '1rem',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  {img.ten_hinh && (
                    <p style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600, fontSize: '0.85rem', color: aura.onSurface,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {img.ten_hinh.split('.').slice(0, -1).join('.') || img.ten_hinh}
                    </p>
                  )}
                  {img.nguoi_dung?.ho_ten && (
                    <p style={{ fontSize: '0.75rem', color: aura.secondary, marginTop: '0.2rem' }}>
                      {img.nguoi_dung.ho_ten}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <Camera size={48} style={{ color: aura.outlineVariant, marginBottom: '1rem', margin: '0 auto' }} />
            <p style={{ color: aura.onSurfaceVariant }}>Không tìm thấy ảnh nào trong danh mục này</p>
          </div>
        )}
      </main>

      {/* Ẩn thanh cuộn cho thanh filter mượt hơn */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}