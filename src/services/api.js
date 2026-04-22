import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log chi tiết lỗi để debug
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    })

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    // Nếu backend trả về message, hiển thị qua toast
    const backendMessage = error.response?.data?.message
    if (backendMessage && !error.config?.url?.includes('/auth/dang-nhap') && !error.config?.url?.includes('/auth/dang-ky')) {
      toast.error(backendMessage)
    }

    return Promise.reject(error)
  }
)

export default api
