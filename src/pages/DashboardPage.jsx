import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, MessageCircle, Share2, Upload, Compass, PlusCircle, User as UserIcon, LogOut, Camera, Pencil, Trash2, X } from 'lucide-react'
import { userService, imageService } from '../services'
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

export default function DashboardPage() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()

  const [myImages, setMyImages] = useState([])
  const [savedImages, setSavedImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('gallery')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ ho_ten: '', tuoi: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  // State Thống kê
  const [userStats, setUserStats] = useState({ followers: 0, following: 0 })

  // State quản lý Modal Sửa Ảnh (Giao diện xịn, nói không với window.prompt)
  const [editingImage, setEditingImage] = useState(null)
  const [editImageForm, setEditImageForm] = useState({ ten_hinh: '', mo_ta: '' })
  const [savingImage, setSavingImage] = useState(false)

  const fetchImages = async () => {
    try {
      const [mine, saved] = await Promise.all([
        userService.getCreatedImages(),
        userService.getSavedImages(),
      ])
      setMyImages(mine || [])
      setSavedImages(saved || [])
    } catch {
      toast.error('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
    const loadStats = async () => {
      if (!user?.nguoi_dung_id) return;
      try {
        // Không có endpoint profile trong service hiện tại, tạm bỏ qua
        // Có thể thêm sau nếu cần
        // const res = await api.get(`/nguoi-dung/${user.nguoi_dung_id}/profile`)
        // if (res.data.data?._count) {
        //   setUserStats({
        //     followers: res.data.data._count.followers || 0,
        //     following: res.data.data._count.following || 0
        //   })
        // }
      } catch (e) {
        console.error("Lỗi lấy stats:", e);
      }
    };
    loadStats();
  }, [user])

  const handleGoToUpload = () => navigate('/upload')

  // --- HÀM MỞ MODAL SỬA ẢNH ---
  const openEditImageModal = (img, e) => {
    e.stopPropagation()
    setEditingImage(img)
    setEditImageForm({ ten_hinh: img.ten_hinh || '', mo_ta: img.mo_ta || '' })
  }

  // --- HÀM LƯU THÔNG TIN ẢNH TỪ MODAL ---
  const handleSaveImageDetails = async () => {
    if (!editingImage) return
    setSavingImage(true)
    try {
      // Sử dụng api trực tiếp vì chưa có update trong imageService
      const token = localStorage.getItem('accessToken')
      const res = await api.put(`/hinh-anh/${editingImage.hinh_id}`, editImageForm)

      toast.success("Cập nhật thông tin ảnh thành công!")
      setEditingImage(null)
      fetchImages()
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Cập nhật thất bại'
      toast.error(msg)
    } finally {
      setSavingImage(false)
    }
  }

  const handleDeleteImage = async (imgId, e) => {
    e.stopPropagation()
    if (!window.confirm('Xóa ảnh này không?')) return
    try {
      await imageService.delete(imgId)
      setMyImages(prev => prev.filter(img => img.hinh_id !== imgId))
      toast.success('Đã xóa ảnh!')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Xóa thất bại'
      toast.error(msg)
    }
  }

  const openEditModal = () => {
    setEditForm({ ho_ten: user?.ho_ten || '', tuoi: user?.tuoi || '' })
    setShowEditModal(true)
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      await userService.updateProfile({
        ho_ten: editForm.ho_ten,
        tuoi: Number(editForm.tuoi)
      })
      updateUser({ ho_ten: editForm.ho_ten, tuoi: Number(editForm.tuoi) })
      toast.success('Đã cập nhật thông tin!')
      setShowEditModal(false)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Cập nhật thất bại'
      toast.error(msg)
    } finally {
      setSavingProfile(false)
    }
  }

  const avatarInputRef = useRef(null)

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append("anh_dai_dien", file)
    try {
      toast.loading("Đang cập nhật Avatar...", { id: "avatar" })
      const token = localStorage.getItem('accessToken')
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3069/api').replace(/\/+$/, '')
      const response = await fetch(`${BASE}/nguoi-dung/avatar`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) throw new Error("Cập nhật thất bại")
      const data = await response.json()
      updateUser({ anh_dai_dien: data.data?.anh_dai_dien || data.anh_dai_dien })
      toast.success("Đổi Avatar thành công!", { id: "avatar" })
    } catch (error) {
      toast.error(error.message, { id: "avatar" })
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Đã copy link!')
  }

  const images = activeTab === 'gallery' ? myImages : savedImages

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: '#060e20', color: '#dee5ff' }}>
      <input type="file" hidden ref={avatarInputRef} accept="image/*" onChange={handleAvatarChange} />

      {/* TOP NAV */}
      <nav className="hidden md:flex justify-between items-center px-8 py-3 w-full fixed top-0 z-50 backdrop-blur-2xl"
           style={{ backgroundColor: 'rgba(6, 14, 32, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 0 40px rgba(255,134,195,0.08)' }}>
        <div className="text-2xl font-black tracking-tighter cursor-pointer" style={{ color: '#ff86c3' }} onClick={() => navigate('/')}>
          Aura
        </div>
        <div className="w-64 h-10 rounded-full flex items-center px-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={16} className="mr-2 text-gray-400" />
          <span className="text-sm text-gray-400">Search...</span>
        </div>
        <div className="flex gap-5 items-center text-gray-400">
          <Bell size={20} className="hover:text-white cursor-pointer transition-colors" />
          <MessageCircle size={20} className="hover:text-white cursor-pointer transition-colors" />
          <div className="border-b-2 pb-1 cursor-pointer" style={{ borderColor: '#ff86c3', color: '#ff86c3' }}>
            <UserIcon size={22} />
          </div>
          <LogOut size={20} onClick={logout} className="hover:text-red-400 cursor-pointer transition-colors ml-2" title="Đăng xuất" />
        </div>
      </nav>

      <main className="flex-grow pt-8 md:pt-20 pb-24 md:pb-8">
        <section className="relative w-full overflow-hidden pb-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 rounded-full pointer-events-none"
               style={{ background: 'rgba(255,134,195,0.1)', filter: 'blur(100px)' }} />

          <div className="relative z-10 max-w-screen-xl mx-auto px-6 pt-12 md:pt-16 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-6 cursor-pointer group" onClick={() => avatarInputRef.current.click()}>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 transition-opacity"
                   style={{ borderColor: '#ff86c3', boxShadow: '0 0 30px rgba(255, 134, 195, 0.4)' }}>
                {user?.anh_dai_dien ? (
                  <img
                    src={getImageUrl(user.anh_dai_dien)}
                    alt="Avatar" className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold group-hover:opacity-60 transition-opacity"
                       style={{ backgroundColor: '#142449', color: '#ff86c3' }}>
                    {user?.ho_ten?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera size={36} className="text-white drop-shadow-lg" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
              {user?.ho_ten || 'Người Dùng Bí Ẩn'}
            </h1>
            <p className="mb-6 text-gray-400">@{user?.email?.split('@')[0] || 'aura_user'}</p>

            {/* Chỉ số Thống kê */}
            <div className="flex gap-6 md:gap-10 mb-8 flex-wrap justify-center">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">{myImages.length}</span>
                <span className="text-sm text-gray-400">Đã đăng</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">{savedImages.length}</span>
                <span className="text-sm text-gray-400">Đã lưu</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">{userStats.followers}</span>
                <span className="text-sm text-gray-400">Người theo dõi</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">{userStats.following}</span>
                <span className="text-sm text-gray-400">Đang theo dõi</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleShare} className="px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
                style={{ backgroundColor: 'rgba(20,36,73,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#dee5ff' }}>
                <Share2 size={16} /> Chia sẻ
              </button>
              <button onClick={openEditModal} className="px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors"
                style={{ backgroundColor: 'rgba(20,36,73,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,134,195,0.3)', color: '#ff86c3' }}>
                <Pencil size={16} /> Sửa thông tin
              </button>
              <button onClick={handleGoToUpload} className="px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #ff86c3, #f673b7)', color: '#4a002f', boxShadow: '0 0 30px rgba(255,134,195,0.25)' }}>
                <Upload size={16} /> Upload ảnh mới
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="max-w-screen-xl mx-auto px-6 mb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex justify-center gap-12 text-lg font-semibold">
            {[{ id: 'gallery', label: 'Đã tạo' }, { id: 'saved', label: 'Đã lưu' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="pb-3 px-2 relative transition-colors"
                style={{ color: activeTab === tab.id ? '#ff86c3' : '#9baad6' }}>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-[2px]"
                              style={{ backgroundColor: '#ff86c3', boxShadow: '0 0 10px rgba(255,134,195,0.5)' }} />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-screen-xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#ff86c3' }}></div>
            </div>
          ) : images.length > 0 ? (
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
              {images.map((img, idx) => {
                const item = activeTab === 'saved' ? (img.hinh_anh || img) : img
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    key={item.hinh_id || idx}
                    onClick={() => navigate(`/hinh-anh/${item.hinh_id}`)}
                    className="relative group rounded-xl overflow-hidden mb-6 cursor-pointer"
                    style={{ breakInside: 'avoid', backgroundColor: '#0c1934' }}
                  >
                    <img
                      src={getImageUrl(item.duong_dan)}
                      alt={item.ten_hinh}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                         style={{ background: 'linear-gradient(to top, rgba(6,14,32,0.9) 0%, transparent 60%)' }}>
                      <h3 className="font-semibold text-base text-white truncate">
                        {item.ten_hinh ? item.ten_hinh.split('.').slice(0, -1).join('.') || item.ten_hinh : 'Untitled'}
                      </h3>
                      
                      {/* Nút Xóa & Sửa cho tab "Đã tạo" */}
                      {activeTab === 'gallery' && (
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={(e) => openEditImageModal(item, e)}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:scale-110"
                            style={{ background: 'rgba(255,134,195,0.95)', color: '#060e20' }}
                            title="Sửa thông tin"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteImage(item.hinh_id, e)}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-red-600 hover:scale-110"
                            style={{ background: 'rgba(220,38,38,0.85)', color: 'white' }}
                            title="Xóa ảnh"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Camera size={48} className="mx-auto mb-4 opacity-50" style={{ color: '#ff86c3' }} />
              <h3 className="text-xl font-bold text-white mb-2">Chưa có ảnh nào</h3>
              <p className="text-gray-400 mb-6">
                {activeTab === 'gallery' ? 'Hãy upload bức ảnh đầu tiên!' : 'Hãy lưu những ảnh bạn thích!'}
              </p>
              <button onClick={() => activeTab === 'gallery' ? handleGoToUpload() : navigate('/')}
                className="px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 mx-auto"
                style={{ background: 'linear-gradient(135deg, #ff86c3, #f673b7)', color: '#4a002f' }}>
                <Upload size={16} /> {activeTab === 'gallery' ? 'Đăng ảnh mới' : 'Khám phá ảnh'}
              </button>
            </div>
          )}
        </section>
      </main>

      {/* MOBILE NAV */}
      <nav className="md:hidden flex justify-around items-center fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-full px-6 py-3 z-50 backdrop-blur-3xl"
           style={{ backgroundColor: 'rgba(16,30,62,0.8)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <Compass size={24} className="text-gray-400 hover:text-[#2fd9f4] cursor-pointer" onClick={() => navigate('/')} />
        <PlusCircle size={24} className="text-gray-400 hover:text-[#2fd9f4] cursor-pointer" onClick={handleGoToUpload} />
        <Bell size={24} className="text-gray-400 hover:text-[#2fd9f4] cursor-pointer" />
        <div className="rounded-full p-2 text-white cursor-pointer shadow-lg" onClick={() => window.scrollTo(0, 0)}
             style={{ background: 'linear-gradient(to bottom right, #ff86c3, #f673b7)', boxShadow: '0 0 15px rgba(255,134,195,0.4)' }}>
          <UserIcon size={20} />
        </div>
      </nav>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setShowEditModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
            className="w-full max-w-md mx-4 rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: '#101e3e', border: '1px solid rgba(255,134,195,0.2)', boxShadow: '0 0 60px rgba(255,134,195,0.1)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Sửa thông tin cá nhân</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Họ và tên</label>
              <input value={editForm.ho_ten} onChange={e => setEditForm(f => ({ ...f, ho_ten: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-white focus:outline-none transition-colors"
                style={{ background: 'rgba(20,36,73,0.6)', border: '1px solid rgba(56,71,109,0.6)' }} placeholder="Nhập họ tên..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Tuổi</label>
              <input type="number" value={editForm.tuoi} onChange={e => setEditForm(f => ({ ...f, tuoi: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-white focus:outline-none transition-colors"
                style={{ background: 'rgba(20,36,73,0.6)', border: '1px solid rgba(56,71,109,0.6)' }} placeholder="Nhập tuổi..." min={1} max={120} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowEditModal(false)} className="px-5 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-colors">Hủy</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="px-6 py-2 rounded-full text-sm font-bold disabled:opacity-50 transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #ff86c3, #f673b7)', color: '#4a002f' }}>
                {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- MODAL SỬA THÔNG TIN ẢNH (MỚI) --- */}
      {editingImage && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setEditingImage(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
            className="w-full max-w-md mx-4 rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: '#101e3e', border: '1px solid rgba(255,134,195,0.2)', boxShadow: '0 0 60px rgba(255,134,195,0.1)' }}>
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Sửa thông tin ảnh</h2>
              <button onClick={() => setEditingImage(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Tên ảnh */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Tên ảnh</label>
              <input value={editImageForm.ten_hinh} onChange={e => setEditImageForm(f => ({ ...f, ten_hinh: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-white focus:outline-none transition-colors"
                style={{ background: 'rgba(20,36,73,0.6)', border: '1px solid rgba(56,71,109,0.6)' }} placeholder="Nhập tên ảnh..." />
            </div>

            {/* Mô tả & Category */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Mô tả / Phân loại</label>
              <textarea value={editImageForm.mo_ta} onChange={e => setEditImageForm(f => ({ ...f, mo_ta: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-white focus:outline-none transition-colors resize-none"
                style={{ background: 'rgba(20,36,73,0.6)', border: '1px solid rgba(56,71,109,0.6)' }} placeholder="Nhập tag để phân loại (VD: [Anime] Cô gái...)" rows="3" />
              <span className="text-xs text-gray-400">Mẹo: Ghi thêm từ khóa (VD: Meme, Phong cảnh...) vào đây để phân loại ảnh trên Trang chủ.</span>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setEditingImage(null)} className="px-5 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-colors">Hủy</button>
              <button onClick={handleSaveImageDetails} disabled={savingImage} className="px-6 py-2 rounded-full text-sm font-bold disabled:opacity-50 transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #ff86c3, #f673b7)', color: '#4a002f' }}>
                {savingImage ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </div>
  )
}