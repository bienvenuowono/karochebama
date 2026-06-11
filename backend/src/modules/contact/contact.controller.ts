import { Request, Response } from 'express';
import contactService from './contact.service';
import { contactSchema } from './contact.validation';
import { sanitizeObject } from '../../utils/sanitize';

import { getPaginationParams, formatPaginatedResult } from '../../utils/pagination';

class ContactController {
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const { items, total } = await contactService.getAll(skip, limit);
      res.json(formatPaginatedResult(items, total, page, limit));
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      const message = await contactService.getById(id);
      if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
      res.json({ success: true, data: message });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body = sanitizeObject(req.body);
      const validatedData = contactSchema.parse(req.body);
      const message = await contactService.create(validatedData);
      
      // Notification non bloquante par e-mail
      const { sendAdminContactNotification } = require('../../utils/email');
      sendAdminContactNotification(
        message.name,
        message.email,
        message.subject || '',
        message.message
      ).catch((err: any) => console.error('Erreur lors de la notification email :', err));

      res.status(201).json({ success: true, data: message });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to create message' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      req.body = sanitizeObject(req.body);
      // On autorise la modification de isRead
      const data = {
        ...req.body,
        isRead: req.body.isRead !== undefined ? Boolean(req.body.isRead) : undefined
      };
      const message = await contactService.update(id, data);
      res.json({ success: true, data: message });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to update message' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      await contactService.delete(id);
      res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new ContactController();
