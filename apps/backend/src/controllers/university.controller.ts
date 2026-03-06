import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authenticate';

export class UniversityController {
  async getAll(req: Request, res: Response) {
    res.status(501).json({ message: 'Get universities endpoint - to be implemented' });
  }

  async getById(req: Request, res: Response) {
    res.status(501).json({ message: 'Get university by ID endpoint - to be implemented' });
  }

  async getProgrammes(req: Request, res: Response) {
    res.status(501).json({ message: 'Get programmes endpoint - to be implemented' });
  }

  async follow(req: AuthRequest, res: Response) {
    res.status(501).json({ message: 'Follow university endpoint - to be implemented' });
  }

  async unfollow(req: AuthRequest, res: Response) {
    res.status(501).json({ message: 'Unfollow university endpoint - to be implemented' });
  }
}
