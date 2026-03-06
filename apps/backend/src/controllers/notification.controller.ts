import { Response } from 'express';
import { AuthRequest } from '../middleware/authenticate';

export class NotificationController {
  async getAll(req: AuthRequest, res: Response) {
    res.status(501).json({ message: 'Get notifications endpoint - to be implemented' });
  }

  async markAsRead(req: AuthRequest, res: Response) {
    res.status(501).json({ message: 'Mark as read endpoint - to be implemented' });
  }

  async markAllAsRead(req: AuthRequest, res: Response) {
    res.status(501).json({ message: 'Mark all as read endpoint - to be implemented' });
  }
}
