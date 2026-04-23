import api from './api.js'

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/dang-ky', userData)
    return response.data.data
  },

  login: async (email, mat_khau) => {
    const response = await api.post('/auth/dang-nhap', { email, mat_khau })
    return response.data.data
  },
}

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/nguoi-dung/me')
    return response.data.data
  },

  updateProfile: async (userData) => {
    const response = await api.put('/nguoi-dung/me', userData)
    return response.data.data
  },

  getSavedImages: async () => {
    const response = await api.get('/nguoi-dung/anh-da-luu')
    return response.data.data?.items || response.data.data
  },

  getCreatedImages: async () => {
    const response = await api.get('/nguoi-dung/anh-da-tao')
    return response.data.data?.items || response.data.data
  },
}

export const imageService = {
  getAll: async () => {
    const response = await api.get('/hinh-anh')
    return response.data.data?.items || response.data.data
  },

  getById: async (id) => {
    const response = await api.get(`/hinh-anh/${id}`)
    return response.data.data
  },

  search: async (query) => {
    const response = await api.get(`/hinh-anh/tim-kiem?ten=${encodeURIComponent(query)}`)
    return response.data.data?.items || response.data.data
  },

create: async (formData) => {
    const token = localStorage.getItem('accessToken');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3069/api';

    // FIX CHỐT HẠ: Thêm /upload vào URL để Backend nhận được file!
    const response = await fetch(`${API_URL}/hinh-anh/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
       throw new Error(data.message || 'Lỗi từ server!');
    }
    return data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/hinh-anh/${id}`)
    return response.data.data
  },

  save: async (id) => {
    const response = await api.post(`/hinh-anh/${id}/luu-anh`)
    return response.data.data
  },

  update: async (id, data) => {
    const response = await api.put(`/hinh-anh/${id}`, data)
    return response.data.data
  },
}
  export const profileService = {
    getUserById: async (id) => {
        const res = await api.get(`/nguoi-dung/${id}/profile`)
        return res.data.data
    },
    getImagesByUserId: async (id) => {
        const res = await api.get(`/nguoi-dung/${id}/anh`)
        return res.data.data?.items || res.data.data
    },
    toggleFollow: async (id) => {
        const res = await api.post(`/nguoi-dung/${id}/follow`)
        return res.data.data
    },
    checkFollow: async (id) => {
        const res = await api.get(`/nguoi-dung/${id}/follow`)
        return res.data.data
    },
}