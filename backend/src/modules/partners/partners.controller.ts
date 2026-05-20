import { Request, Response } from 'express';
import partnerService from './partners.service';
import { partnerSchema } from './partners.validation';
import { sanitizeObject } from '../../utils/sanitize';

import { getPaginationParams, formatPaginatedResult } from '../../utils/pagination';

class PartnerController {
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const { items, total } = await partnerService.getAll(skip, limit);
      res.json(formatPaginatedResult(items, total, page, limit));
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      const application = await partnerService.getById(id);
      if (!application) return res.status(404).json({ success: false, error: 'Application not found' });
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body = sanitizeObject(req.body);
      const validatedData = partnerSchema.parse(req.body);
      const application = await partnerService.create(validatedData);
      
      // Notification non bloquante par e-mail
      const { sendAdminPartnerNotification } = require('../../utils/email');
      sendAdminPartnerNotification(
        application.name,
        application.type,
        application.email,
        application.phone,
        application.location,
        application.description
      ).catch((err: any) => console.error('Erreur lors de la notification email :', err));

      res.status(201).json({ success: true, data: application });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to create application' });
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
      
      const application = await partnerService.update(id, data);
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to update application' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      await partnerService.delete(id);
      res.json({ success: true, message: 'Application deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new PartnerController();
