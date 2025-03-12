import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);