import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'http://localhost:5001/api/v1';
=======
const API_URL = 'http://localhost:5000/api/v1';
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1

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
<<<<<<< HEAD
    try {
      const user = localStorage.getItem('admin_user');
      return user && user !== 'undefined' ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
=======
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
  },

  getToken() {
    return localStorage.getItem('admin_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('admin_token');
  }
};
<<<<<<< HEAD

=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
