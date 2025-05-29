import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Assuming your backend API is served under /api
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
  }
  return config;
});

export default instance;