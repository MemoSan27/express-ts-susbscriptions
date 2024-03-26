import { Request, Response } from 'express';
import { createMembershipService, updateMembershipService } from '../services/membership.service';
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

export const updateMembershipController = async (req: Request, res: Response): Promise<void> => {
    try {
        const membershipId: string = req.params.id; 
        const updatedMembershipData: Partial<Membership> = req.body; 

        const updatedMembership = await updateMembershipService(membershipId, updatedMembershipData);

        if (updatedMembership) {
            res.status(200).json({ message: 'Membership updated successfully', updatedData: updatedMembershipData });
        } else {
            res.status(404).json({ message: 'Membership not found or not updated' });
        }
    } catch (error) {
        console.error('Error updating membership:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};