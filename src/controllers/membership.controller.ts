import { Request, Response } from 'express';
import { createMembershipService } from '../services/membership.service';
import { Membership } from '../models/Membership';

export const createMembershipController = async(
    req: Request, res: Response): Promise<void> => {
        
        const membership: Membership = req.body;
        await createMembershipService(membership);
        res.status(201).json({
            message: 'Type of membership created sucess',
            membership,
        });
};