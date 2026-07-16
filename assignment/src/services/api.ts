import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('userToken') || '{}');

  if (token?.token) {
    config.headers.Authorization = `Bearer ${token?.token}`;
  }

  return config;
});

export default api;
