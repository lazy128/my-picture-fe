import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CloudUpload, Image as ImageIcon } from 'lucide-react'
import { imageService } from '../services'
import toast from 'react-hot-toast'

const CATEGORIES = ['Thiết kế', 'Phong cảnh', 'Anime', 'Động vật', 'Xe cộ', 'Nghệ thuật', 'Cyberpunk', 'Meme']

export default function UploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadData, setUploadData] = useState({ ten_hinh: '', mo_ta: '', category: 'Anime' })
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => { 
    const file = event.target.files[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    const defaultName = file.name.split('.').slice(0, -1).join('.')
    setUploadData(prev => ({ ...prev, ten_hinh: defaultName }))
  }

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Vui lòng chọn một bức ảnh!")
    if (!uploadData.ten_hinh) return toast.error("Vui lòng nhập tiêu đề!")

    setLoading(true)
    const formData = new FormData()
    formData.append("file_anh", selectedFile)
    formData.append("ten_hinh", uploadData.ten_hinh)

    // Nối Category vào trước mô tả để thanh Search ở HomePage tìm được
    const moTaHoanChinh = `[${uploadData.category}] ${uploadData.mo_ta}`
    formData.append("mo_ta", moTaHoanChinh)

    try {
      toast.loading("Đang đẩy ảnh lên mây...", { id: "uploading" })

      await imageService.create(formData)

      toast.success("Đăng Aura thành công rực rỡ!", { id: "uploading" })
      navigate('/')
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Upload thất bại"
      toast.error("Lỗi: " + msg, { id: "uploading" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] font-sans flex flex-col relative overflow-hidden">
      {/* Nền Ethereal */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#ff86c3] opacity-5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#2fd9f4] opacity-5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <nav className="flex items-center px-8 py-6 relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pb-20 flex flex-col md:flex-row gap-8 items-start relative z-10">
        
        {/* Left: Upload Area */}
        <div className="w-full md:w-3/5">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Create New Aura</h1>
          
          <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
          
          <div 
            onClick={() => !selectedFile && fileInputRef.current.click()}
            className={`aspect-video md:aspect-[4/3] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all relative overflow-hidden
              ${selectedFile ? 'border-transparent bg-black/40' : 'border-[#38476d] hover:border-[#ff86c3] bg-[#142449]/40 cursor-pointer'}`}
          >
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(''); }}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm hover:bg-red-500 transition-colors">
                  Đổi ảnh khác
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-center p-8">
                <CloudUpload size={64} className="text-[#65759e] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Click để chọn ảnh</h3>
                <p className="text-sm text-gray-400">Hỗ trợ JPG, PNG, WEBP. Khuyên dùng ảnh chất lượng cao.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Form Details */}
        <div className="w-full md:w-2/5 flex flex-col gap-6">
          <div className="bg-[#101e3e]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#38476d]/50 flex flex-col gap-5">
            <h2 className="text-2xl font-bold border-b border-[#38476d]/50 pb-4">Aura Details</h2>
            
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Tiêu đề</label>
              <input value={uploadData.ten_hinh} onChange={e => setUploadData({...uploadData, ten_hinh: e.target.value})}
                className="w-full bg-[#142449]/50 border border-[#38476d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff86c3] transition-colors"
                placeholder="Ví dụ: Neon Cityscape" />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Phân loại (Category)</label>
              <select value={uploadData.category} onChange={e => setUploadData({...uploadData, category: e.target.value})}
                className="w-full bg-[#142449]/50 border border-[#38476d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff86c3] transition-colors appearance-none">
                {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#101e3e]">{cat}</option>)}
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Mô tả thêm</label>
              <textarea value={uploadData.mo_ta} onChange={e => setUploadData({...uploadData, mo_ta: e.target.value})}
                className="w-full bg-[#142449]/50 border border-[#38476d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff86c3] transition-colors resize-none"
                placeholder="Nhập vài dòng cảm nghĩ về bức ảnh này..." rows="4"></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <button onClick={() => navigate(-1)} className="px-6 py-3 font-medium text-gray-400 hover:text-white transition-colors">Hủy</button>
            <button onClick={handleUpload} disabled={loading}
              className="px-8 py-3 rounded-full bg-gradient-to-br from-[#ff86c3] to-[#f673b7] text-[#5f003e] font-bold shadow-[0_0_20px_rgba(255,134,195,0.2)] hover:scale-105 transition-transform disabled:opacity-50">
              {loading ? 'Đang đăng...' : 'Publish Aura'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}