import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedCustomerRequest extends Request {
    user?: any; 
    userId?: any;
    role?: string;
}

const verifyCustomerJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.sendStatus(401);

    const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(
        token,
        process.env.TOKEN_SECRET as string,
        (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            const { user, userId, role } = decoded; 
            if (role !== 'customer') return res.sendStatus(403); 
            (req as AuthenticatedCustomerRequest).user = user; 
            (req as AuthenticatedCustomerRequest).userId = userId; 
            (req as AuthenticatedCustomerRequest).role = role;
            next();
        }
    );
};

export default verifyCustomerJwt;