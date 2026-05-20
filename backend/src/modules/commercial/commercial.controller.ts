import { Request, Response } from 'express';
import commercialService from './commercial.service';
import { commercialSchema } from './commercial.validation';
import { sanitizeObject } from '../../utils/sanitize';

import { getPaginationParams, formatPaginatedResult } from '../../utils/pagination';

class CommercialController {
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const { items, total } = await commercialService.getAll(skip, limit);
      res.json(formatPaginatedResult(items, total, page, limit));
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      const form = await commercialService.getById(id);
      if (!form) return res.status(404).json({ success: false, error: 'Form not found' });
      res.json({ success: true, data: form });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body = sanitizeObject(req.body);
      const validatedData = commercialSchema.parse(req.body);
      const form = await commercialService.create(validatedData);
      
      // Notification non bloquante par e-mail
      const { sendAdminCommercialNotification } = require('../../utils/email');
      sendAdminCommercialNotification(
        form.type,
        form.agentName,
        form.clientName,
        form.product,
        form.quantity,
        form.location
      ).catch((err: any) => console.error('Erreur lors de la notification email :', err));

      res.status(201).json({ success: true, data: form });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to create form' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      req.body = sanitizeObject(req.body);
      
      const data = {
        ...req.body,
        isProcessed: req.body.isProcessed !== undefined ? Boolean(req.body.isProcessed) : undefined
      };
      
      const form = await commercialService.update(id, data);
      res.json({ success: true, data: form });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to update form' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      await commercialService.delete(id);
      res.json({ success: true, message: 'Form deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new CommercialController();
