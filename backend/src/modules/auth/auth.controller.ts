import { Request, Response } from 'express';
import authService from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.register(validatedData);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      res.json(result);
    } catch (error: any) {
      console.error('Login error:', error.message);
      
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: 'Identifiants invalides (email ou mot de passe incorrect).' });
      }
      
      // Handle database connection errors or other issues
      res.status(500).json({ 
        error: 'Erreur serveur lors de la connexion',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { userId } = req.body; // In a real app, this comes from the auth middleware
      await authService.logout(userId);
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AuthController();
