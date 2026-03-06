import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authenticate';

export class JobController {
  async getAll(req: Request, res: Response) {
    res.status(501).json({ message: 'Get jobs endpoint - to be implemented' });
  }

  async getById(req: Request, res: Response) {
    res.status(501).json({ message: 'Get job by ID endpoint - to be implemented' });
  }

  async apply(req: AuthRequest, res: Response) {
    res.status(501).json({ message: 'Apply for job endpoint - to be implemented' });
  }
}
