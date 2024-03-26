import { Request, Response } from 'express';
import { AuthService, loginAdminService } from '../services/admin.service';
import dbConnection from '../configs/database/mongo.conn';
import { AuthenticatedRequest } from '../utils/jwt/verifyAdminJwt';


export const getLoggedAdminController = async(req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  return res.json(user)
}

export const loginAdminController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const db = await dbConnection();

    const authService: AuthService = loginAdminService(db);

    const token = await authService.login(email, password);

    if (!token) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in login process: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};