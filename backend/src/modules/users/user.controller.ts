import { Request, Response } from 'express';
import userService from './user.service';

class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`Updating user ${id} with data:`, req.body);
      const user = await userService.updateUser(Number(id), req.body);
      res.json({ success: true, data: user });
    } catch (error: any) {
      console.error('Update error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userService.deleteUser(Number(id));
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new UserController();
