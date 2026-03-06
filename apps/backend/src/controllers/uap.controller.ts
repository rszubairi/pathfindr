import { Response } from 'express';
import { AuthRequest } from '../middleware/authenticate';

export class UAPController {
  async getProfile(req: AuthRequest, res: Response) {
    // TODO: Get user's UAP
    res.status(501).json({ message: 'Get profile endpoint - to be implemented' });
  }

  async updateProfile(req: AuthRequest, res: Response) {
    // TODO: Update user's UAP
    res.status(501).json({ message: 'Update profile endpoint - to be implemented' });
  }

  async uploadDocument(req: AuthRequest, res: Response) {
    // TODO: Upload document to S3
    res.status(501).json({ message: 'Upload document endpoint - to be implemented' });
  }

  async deleteDocument(req: AuthRequest, res: Response) {
    // TODO: Delete document from S3
    res.status(501).json({ message: 'Delete document endpoint - to be implemented' });
  }
}
