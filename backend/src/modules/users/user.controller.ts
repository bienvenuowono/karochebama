import { Request, Response } from 'express';
import userService from './user.service';
import { sanitizeObject } from '../../utils/sanitize';

import { getPaginationParams, formatPaginatedResult } from '../../utils/pagination';

class UserController {
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const { items, total } = await userService.getAllUsers(skip, limit);
      res.json(formatPaginatedResult(items, total, page, limit));
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { password, ...rest } = req.body;
      const sanitizedRest = sanitizeObject(rest);
      const payload = password !== undefined ? { ...sanitizedRest, password } : sanitizedRest;
      
      const user = await userService.createUser(payload);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { password, ...rest } = req.body;
      const sanitizedRest = sanitizeObject(rest);
      const payload = password !== undefined ? { ...sanitizedRest, password } : sanitizedRest;
      
      console.log(`Updating user ${id} with data:`, payload);
      const user = await userService.updateUser(Number(id), payload);
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
