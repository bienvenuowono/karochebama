import axios from 'axios';

<<<<<<< HEAD
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
=======
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
<<<<<<< HEAD

=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
