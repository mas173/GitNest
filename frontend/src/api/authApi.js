import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/auth';

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.request.use((config) => {
  const state = JSON.parse(localStorage.getItem('auth-storage'));
  if (state && state.state && state.state.token) {
    config.headers.Authorization = `Bearer ${state.state.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const registerUser = async (userData) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await authApi.post('/login', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await authApi.get('/me');
  return response.data;
};

export default authApi;
