import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MoreHorizontal, Share2, Send, Bookmark } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import { imageService } from '../services'
import toast from 'react-hot-toast'
import api from '../services/api.js'

const aura = {
  surface:          '#060e20',
  surfaceLow:       '#081329',
  surfaceHigh:      '#101e3e',
  surfaceVariant:   '#142449',
  primary:          '#ff86c3',
  primaryContainer: '#f673b7',
  secondary:        '#2fd9f4',
  tertiary:         '#cebdff',
  onSurface:        '#dee5ff',
  onSurfaceVariant: '#9baad6',
  outline:          '#65759e',
  outlineVariant:   '#38476d',
}

const glass = {
  background:           'rgba(16,30,62,0.55)',
  backdropFilter:       'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border:               '1px solid rgba(56,71,109,0.15)',
  boxShadow:            '0 0 40px rgba(255,134,195,0.06)',
}

function Avatar({ src, name, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, rgba(255,134,195,0.3), rgba(47,217,244,0.2))`,
      border: '1px solid rgba(255,134,195,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {src
        ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontSize: size * 0.38, fontWeight: 700, color: aura.primary }}>
            {name?.[0]?.toUpperCase() || '?'}
          </span>
      }
    </div>
  )
}

export default function ImageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [image, setImage]               = useState(null)
  const [related, setRelated]           = useState([])
  const [comments, setComments]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [saved, setSaved]               = useState(false)
  const [showMenu, setShowMenu]         = useState(false)
  const [commentText, setCommentText]   = useState('')
  const [posting, setPosting]           = useState(false)
  const [replyingTo, setReplyingTo]     = useState(null)
  const [replyText, setReplyText]       = useState('')
  const [postingReply, setPostingReply] = useState(false)

  useEffect(() => {
    if (!id || id === 'undefined') return
    const load = async () => {
      try {
        setLoading(true)
        const [imgData, allImages] = await Promise.all([
          imageService.getById(id),
          imageService.getAll(),
        ])
        setImage(imgData)
        setRelated((allImages || []).filter(i => i.hinh_id !== Number(id)).slice(0, 8))

        try {
          const res = await api.get(`/hinh-anh/${id}/binh-luan`)
          setComments(res.data.data?.items || res.data.data || [])
        } catch { setComments([]) }
      } catch {
        toast.error('Không tải được ảnh')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleSave = async () => {
    try {
      await imageService.save(id)
      setSaved(prev => !prev)
      toast.success(saved ? 'Đã bỏ lưu' : 'Đã lưu ảnh!')
    } catch { toast.error('Lỗi, thử lại nhé') }
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    setPosting(true)
    try {
      const res = await api.post(`/hinh-anh/${id}/binh-luan`, { noi_dung: commentText })
      setComments(prev => [...prev, res.data.data || {
        binh_luan_id: Date.now(),
        noi_dung: commentText,
        nguoi_dung: { ho_ten: user?.ho_ten, anh_dai_dien: user?.anh_dai_dien },
      }])
      setCommentText('')
    } catch { toast.error('Không gửi được bình luận') }
    finally { setPosting(false) }
  }

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return
    setPostingReply(true)
    try {
      const res = await api.post(`/hinh-anh/${id}/binh-luan`, {
        noi_dung: replyText,
        binh_luan_cha_id: parentId,
      })
      setComments(prev => [...prev, res.data.data || {
        binh_luan_id: Date.now(),
        noi_dung: replyText,
        binh_luan_cha_id: parentId,
        nguoi_dung: { ho_ten: user?.ho_ten, anh_dai_dien: user?.anh_dai_dien },
      }])
      setReplyText('')
      setReplyingTo(null)
    } catch { toast.error('Không gửi được reply') }
    finally { setPostingReply(false) }
  }

  const validComments = comments.filter(c => c?.binh_luan_id && c?.noi_dung?.trim())

  if (loading) return (
    <div style={{ minHeight: '100vh', background: aura.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: `2px solid rgba(255,134,195,0.15)`, borderTopColor: aura.primary, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: aura.surface, color: aura.onSurface,
      fontFamily: 'Inter, sans-serif',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(255,134,195,0.1) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(47,217,244,0.07) 0%, transparent 40%)
      `,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Back button */}
      <div style={{ padding: '1.25rem 1.5rem', position: 'sticky', top: 0, zIndex: 40, background: 'rgba(6,14,32,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(20,36,73,0.6)', border: '1px solid rgba(56,71,109,0.3)', cursor: 'pointer', color: aura.onSurface }}>
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left: Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ borderRadius: '1.25rem', overflow: 'hidden', position: 'sticky', top: '5rem' }}>
          {image?.duong_dan
            ? <img src={image.duong_dan?.startsWith('http') ? image.duong_dan : `http://localhost:3069/${image.duong_dan}`}
                alt={image.ten_hinh} style={{ width: '100%', display: 'block', borderRadius: '1.25rem' }} />
            : <div style={{ height: '480px', background: aura.surfaceVariant, borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3rem' }}>🖼</span>
              </div>
          }
        </motion.div>

        {/* Right: Info + Comments */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div style={{ ...glass, borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Top actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                <button onClick={() => setShowMenu(v => !v)} style={{ background: 'rgba(20,36,73,0.5)', border: '1px solid rgba(56,71,109,0.25)', borderRadius: '0.6rem', padding: '0.5rem', cursor: 'pointer', color: aura.onSurfaceVariant, display: 'flex', alignItems: 'center' }}>
                  <MoreHorizontal size={16} />
                </button>

                {showMenu && (
                  <div onClick={() => setShowMenu(false)} style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, zIndex: 100, background: aura.surfaceHigh, border: '1px solid rgba(56,71,109,0.3)', borderRadius: '0.75rem', overflow: 'hidden', minWidth: '160px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                    {[
                      { label: '⬇️  Tải ảnh về', action: () => { const a = document.createElement('a'); a.href = image?.duong_dan?.startsWith('http') ? image.duong_dan : `http://localhost:3069/${image?.duong_dan}`; a.download = image?.ten_hinh || 'image'; a.click() } },
                      { label: '🔗  Copy link', action: () => { navigator.clipboard.writeText(window.location.href); toast.success('Đã copy link!') } },
                      { label: '🚩  Báo cáo', action: () => toast('Đã gửi báo cáo') },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '0.7rem 1rem', textAlign: 'left', color: aura.onSurface, fontSize: '0.85rem', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,134,195,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}

                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Đã copy link!') }}
                  style={{ background: 'rgba(20,36,73,0.5)', border: '1px solid rgba(56,71,109,0.25)', borderRadius: '0.6rem', padding: '0.5rem', cursor: 'pointer', color: aura.onSurfaceVariant, display: 'flex', alignItems: 'center' }}>
                  <Share2 size={16} />
                </button>
              </div>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
                style={{ padding: '0.6rem 1.5rem', borderRadius: '9999px', border: saved ? `1px solid rgba(255,134,195,0.3)` : 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.875rem', background: saved ? 'rgba(255,134,195,0.15)' : `linear-gradient(135deg, ${aura.primary}, ${aura.primaryContainer})`, color: saved ? aura.primary : '#5f003e', boxShadow: saved ? 'none' : '0 0 20px rgba(255,134,195,0.3)', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bookmark size={14} style={{ fill: saved ? aura.primary : 'none' }} />
                {saved ? 'Đã lưu' : 'Lưu'}
              </motion.button>
            </div>

            {/* Title + desc */}
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.03em', color: aura.onSurface, lineHeight: 1.15, marginBottom: '0.75rem' }}>
                {image?.ten_hinh ? image.ten_hinh.split('.').slice(0, -1).join('.') || image.ten_hinh : 'Untitled'}
              </h1>
              {image?.mo_ta && (
                <p style={{ color: aura.onSurfaceVariant, fontSize: '0.9rem', lineHeight: 1.7 }}>{image.mo_ta}</p>
              )}
            </div>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.875rem', background: 'rgba(20,36,73,0.35)', border: '1px solid rgba(56,71,109,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${image?.nguoi_dung_id}`)}>
                <Avatar src={image?.nguoi_dung?.anh_dai_dien} name={image?.nguoi_dung?.ho_ten} size={40} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: aura.onSurface }}>{image?.nguoi_dung?.ho_ten || 'Unknown'}</p>
                  <p style={{ fontSize: '0.75rem', color: aura.onSurfaceVariant }}>Creator</p>
                </div>
              </div>

            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(56,71,109,0.4), transparent)' }} />

            {/* Comments */}
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: aura.onSurface, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Bình luận
                <span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'rgba(47,217,244,0.15)', color: aura.secondary, borderRadius: '9999px', padding: '0.1rem 0.5rem' }}>
                  {validComments.length}
                </span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                <AnimatePresence>
                  {validComments.length === 0
                    ? <p style={{ color: aura.onSurfaceVariant, fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>Chưa có bình luận. Hãy là người đầu tiên!</p>
                    : validComments.map((c, i) => (
                      <motion.div key={c.binh_luan_id || i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>

                        {/* Avatar click → profile */}
                        <div onClick={() => c.nguoi_dung_id && navigate(`/profile/${c.nguoi_dung_id}`)}
                          style={{ cursor: c.nguoi_dung_id ? 'pointer' : 'default' }}>
                          <Avatar src={c.nguoi_dung?.anh_dai_dien} name={c.nguoi_dung?.ho_ten || c.nguoi_dung?.email || '?'} size={32} />
                        </div>

                        <div style={{ flex: 1 }}>
                          {/* Tên click → profile */}
                          <span
                            onClick={() => c.nguoi_dung_id && navigate(`/profile/${c.nguoi_dung_id}`)}
                            style={{ fontWeight: 600, fontSize: '0.8rem', color: aura.onSurface, cursor: c.nguoi_dung_id ? 'pointer' : 'default' }}
                            onMouseEnter={e => { if (c.nguoi_dung_id) e.currentTarget.style.color = aura.primary }}
                            onMouseLeave={e => e.currentTarget.style.color = aura.onSurface}
                          >
                            {c.nguoi_dung?.ho_ten || c.nguoi_dung?.email?.split('@')[0] || 'Ẩn danh'}
                          </span>
                          <p style={{ fontSize: '0.85rem', color: aura.onSurfaceVariant, lineHeight: 1.5, marginTop: '0.2rem' }}>{c.noi_dung}</p>

                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                            <button
                              onClick={() => { if (replyingTo === c.binh_luan_id) { setReplyingTo(null); setReplyText('') } else { setReplyingTo(c.binh_luan_id); setReplyText('') } }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: 0, color: replyingTo === c.binh_luan_id ? aura.primary : aura.onSurfaceVariant, fontWeight: replyingTo === c.binh_luan_id ? 600 : 400, transition: 'color 0.2s' }}>
                              {replyingTo === c.binh_luan_id ? 'Huỷ' : 'Reply'}
                            </button>
                          </div>

                          {replyingTo === c.binh_luan_id && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem', background: 'rgba(20,36,73,0.4)', borderRadius: '9999px', border: '1px solid rgba(56,71,109,0.25)', padding: '0.4rem 0.75rem' }}>
                              <input autoFocus value={replyText} onChange={e => setReplyText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleReply(c.binh_luan_id)}
                                placeholder={`Trả lời ${c.nguoi_dung?.ho_ten || 'người dùng'}...`}
                                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: aura.onSurface, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }} />
                              <button onClick={() => handleReply(c.binh_luan_id)} disabled={postingReply || !replyText.trim()}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: replyText.trim() ? aura.primary : aura.outlineVariant, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}>
                                <Send size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  }
                </AnimatePresence>
              </div>

              {/* Comment input */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1.25rem' }}>
                <Avatar src={user?.anh_dai_dien} name={user?.ho_ten} size={32} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(20,36,73,0.4)', borderRadius: '9999px', border: '1px solid rgba(56,71,109,0.25)', padding: '0.5rem 1rem' }}>
                  <input value={commentText} onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleComment()}
                    placeholder="Thêm bình luận..."
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: aura.onSurface, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }} />
                  <button onClick={handleComment} disabled={posting || !commentText.trim()}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: commentText.trim() ? aura.primary : aura.outlineVariant, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}>
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* More like this */}
      {related.length > 0 && (
        <div style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1.5rem 4rem' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em', color: aura.onSurface, textAlign: 'center', marginBottom: '1.75rem' }}>
            More like this
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {related.map((img, i) => (
              <motion.div key={img.hinh_id || i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.04 }}
                onClick={() => navigate(`/hinh-anh/${img.hinh_id}`)}
                style={{ cursor: 'pointer', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                {img.duong_dan
                  ? <img src={img.duong_dan?.startsWith('http') ? img.duong_dan : `http://localhost:3069/${img.duong_dan}`}
                      alt={img.ten_hinh} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                  : <div style={{ aspectRatio: '1', background: aura.surfaceVariant, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '2rem' }}>🖼</span>
                    </div>
                }
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${aura.outlineVariant}; border-radius: 2px; }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}