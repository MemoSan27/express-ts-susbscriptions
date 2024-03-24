import { Request, Response, NextFunction } from 'express';
import { mockController } from '../controllers/mockController';


export const mockMiddleware = (description: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        mockController(req, res, description);
    };
};