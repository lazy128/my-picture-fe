import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import { profileService } from '../services'
import { useAuth } from '../hooks/useAuth.jsx'
import toast from 'react-hot-toast'
import api from '../services/api.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3069/api'

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = API_URL.replace(/\/+$/, '');
  const imgPath = path.replace(/^\/+/, '');
  return `${base}/${imgPath}`;
};

const aura = {
  surface: '#060e20', surfaceHigh: '#101e3e', surfaceVariant: '#142449',
  primary: '#ff86c3', primaryContainer: '#f673b7', secondary: '#2fd9f4',
  onSurface: '#dee5ff', onSurfaceVariant: '#9baad6', outlineVariant: '#38476d',
}

export default function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    // Nếu là profile của mình thì redirect về dashboard
    if (user && +id === user.nguoi_dung_id) {
      navigate('/dashboard')
      return
    }
    loadProfile()
  }, [id])

  const loadProfile = async () => {
    try {
      const [profileData, imagesData, followData] = await Promise.all([
        profileService.getUserById(id),
        profileService.getImagesByUserId(id),
        profileService.checkFollow(id),
      ])
      setProfile(profileData)
      setImages(imagesData || [])
      setFollowing(followData?.following || false)
    } catch {
      toast.error('Không tải được profile')
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      const result = await profileService.toggleFollow(id)
      setFollowing(result.following)
      toast.success(result.message)
    } catch { toast.error('Lỗi, thử lại nhé') }
    finally { setFollowLoading(false) }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:aura.surface, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'2.5rem', height:'2.5rem', borderRadius:'50%', border:`2px solid rgba(255,134,195,0.15)`, borderTopColor:aura.primary, animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:aura.surface, color:aura.onSurface, fontFamily:'Inter, sans-serif',
      backgroundImage:`radial-gradient(circle at 15% 20%, rgba(255,134,195,0.12) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(47,217,244,0.08) 0%, transparent 40%)`
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, display:'flex', alignItems:'center', padding:'0.875rem 1.5rem',
        background:'rgba(6,14,32,0.75)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(56,71,109,0.12)', gap:'1rem' }}>
        <button onClick={() => navigate(-1)} style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(20,36,73,0.5)',
          border:'1px solid rgba(56,71,109,0.3)', borderRadius:'9999px', padding:'0.5rem 1rem', cursor:'pointer', color:aura.onSurfaceVariant, fontSize:'0.8rem' }}>
          <ArrowLeft size={14} /> Quay lại
        </button>
        <span style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:800, fontSize:'1.25rem',
          background:`linear-gradient(135deg, ${aura.primary}, ${aura.primaryContainer})`,
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', cursor:'pointer' }}
          onClick={() => navigate('/')}>Aura</span>
      </nav>

      <main style={{ maxWidth:'1100px', margin:'0 auto', padding:'6rem 1.5rem 4rem' }}>

        {/* Profile Header */}
        <div style={{ textAlign:'center', marginBottom:'3rem', position:'relative' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,134,195,0.08)', filter:'blur(60px)', pointerEvents:'none' }} />

          {/* Avatar */}
          <div style={{ width:'120px', height:'120px', borderRadius:'50%', margin:'0 auto 1.25rem',
            border:`3px solid ${aura.primary}`, boxShadow:`0 0 30px rgba(255,134,195,0.3)`, overflow:'hidden',
            background:aura.surfaceVariant, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {profile?.anh_dai_dien
              ? <img src={getImageUrl(profile.anh_dai_dien)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span style={{ fontSize:'2.5rem', fontWeight:700, color:aura.primary }}>
                  {profile?.ho_ten?.[0]?.toUpperCase() || '?'}
                </span>
            }
          </div>

          <h1 style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:800, fontSize:'2rem', marginBottom:'0.25rem' }}>
            {profile?.ho_ten || 'Ẩn danh'}
          </h1>
          <p style={{ color:aura.onSurfaceVariant, marginBottom:'1.5rem', fontSize:'0.9rem' }}>
            @{profile?.email?.split('@')[0]}
          </p>

          {/* Stats */}
          <div style={{ display:'flex', gap:'2.5rem', justifyContent:'center', marginBottom:'1.75rem' }}>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:800, fontSize:'1.5rem' }}>
                {profile?._count?.hinh_anh || 0}
              </div>
              <div style={{ fontSize:'0.8rem', color:aura.onSurfaceVariant }}>Ảnh</div>
            </div>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:800, fontSize:'1.5rem' }}>
                {profile?._count?.followers || 0}
              </div>
              <div style={{ fontSize:'0.8rem', color:aura.onSurfaceVariant }}>Followers</div>
            </div>
            <div>
              <div style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:800, fontSize:'1.5rem' }}>
                {profile?._count?.following || 0}
              </div>
              <div style={{ fontSize:'0.8rem', color:aura.onSurfaceVariant }}>Following</div>
            </div>
          </div>

          {/* Follow button */}
          <button onClick={handleFollow} disabled={followLoading} style={{
            padding:'0.75rem 2.5rem', borderRadius:'9999px', border:'none', cursor:'pointer',
            fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:700, fontSize:'0.9rem',
            background: following
              ? 'rgba(20,36,73,0.6)'
              : `linear-gradient(135deg, ${aura.primary}, ${aura.primaryContainer})`,
            color: following ? aura.onSurface : '#4a002f',
            border: following ? '1px solid rgba(56,71,109,0.3)' : 'none',
            boxShadow: following ? 'none' : `0 0 25px rgba(255,134,195,0.3)`,
            transition:'all 0.2s',
          }}>
            {followLoading ? '...' : following ? 'Đang theo dõi' : 'Theo dõi'}
          </button>
        </div>

        {/* Images Grid */}
        <h2 style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontWeight:700, fontSize:'1.2rem',
          marginBottom:'1.5rem', color:aura.onSurface }}>
          Ảnh đã đăng
        </h2>

        {images.length > 0 ? (
          <div style={{ columns:4, columnGap:'1rem' }}>
            {images.map((img, i) => (
              <motion.div key={img.hinh_id || i}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                whileHover={{ scale:1.02 }}
                onClick={() => navigate(`/hinh-anh/${img.hinh_id}`)}
                style={{ breakInside:'avoid', marginBottom:'1rem', borderRadius:'1rem',
                  overflow:'hidden', cursor:'pointer', background:aura.surfaceHigh }}
              >
                {img.duong_dan
                  ? <img src={getImageUrl(img.duong_dan)}
                      alt={img.ten_hinh} style={{ width:'100%', display:'block', borderRadius:'1rem' }} loading="lazy" />
                  : <div style={{ height:'200px', display:'flex', alignItems:'center', justifyContent:'center', background:aura.surfaceVariant }}>
                      <Camera size={32} style={{ color:aura.outlineVariant }} />
                    </div>
                }
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'4rem', color:aura.onSurfaceVariant }}>
            <Camera size={48} style={{ margin:'0 auto 1rem', opacity:0.4 }} />
            <p>Chưa có ảnh nào</p>
          </div>
        )}
      </main>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } } * { box-sizing:border-box; }`}</style>
    </div>
  )
}