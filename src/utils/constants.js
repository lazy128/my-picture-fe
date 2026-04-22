export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/dang-nhap',
    REGISTER: '/auth/dang-ky',
  },
  USERS: {
    ME: '/nguoi-dung/me',
    SAVED_IMAGES: '/nguoi-dung/anh-da-luu',
    CREATED_IMAGES: '/nguoi-dung/anh-da-tao',
    UPDATE: '/nguoi-dung/me',
  },
  IMAGES: {
    ALL: '/hinh-anh',
    SEARCH: '/hinh-anh/tim-kiem',
    BY_ID: (id) => `/hinh-anh/${id}`,
    SAVE: (id) => `/hinh-anh/${id}/luu`,
    DELETE: (id) => `/hinh-anh/${id}`,
  },
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
  DARK_MODE: 'darkMode',
}

export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    REGISTER_SUCCESS: 'Đăng ký thành công! Vui lòng đăng nhập.',
    LOGOUT_SUCCESS: 'Đã đăng xuất',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  },
  ERROR: {
    NETWORK: 'Lỗi kết nối mạng. Vui lòng thử lại.',
    UNKNOWN: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
  },
}
