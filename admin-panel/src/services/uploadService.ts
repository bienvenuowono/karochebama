import axios from 'axios';
import { authService } from './authService';
import { API_URL } from './api';

const UPLOAD_URL = 'http://localhost:5001/api/v1/upload';

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const token = authService.getToken();
    
    const response = await axios.post(UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data.url;
  }
};
