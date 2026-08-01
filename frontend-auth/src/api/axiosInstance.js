import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ===== Request Interceptor =====
// Menambahkan Authorization: Bearer <token> ke SETIAP request, jika token ada.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`, {
      withToken: Boolean(token),
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// ===== Response Interceptor =====
// Menangani 401 secara global: hapus token & redirect ke halaman login.
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Token tidak valid/expired -> redirect ke /login');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Hindari redirect loop kalau memang sudah di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response) {
      console.error(`❌ Server Error: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('❌ No Response from Server:', error.request);
    } else {
      console.error('❌ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
