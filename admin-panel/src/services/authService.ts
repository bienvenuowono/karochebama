import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1';

export const authService = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    // Le backend renvoie { user, tokens: { accessToken, refreshToken } }
    if (response.data && response.data.tokens && response.data.tokens.accessToken) {
      localStorage.setItem('admin_token', response.data.tokens.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
      return response.data;
    }
    
    throw new Error('Format de réponse invalide');
  },

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('admin_user');
      return user && user !== 'undefined' ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('admin_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('admin_token');
  }
};

