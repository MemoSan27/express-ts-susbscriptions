import { Request, Response } from 'express';
import { createMembershipService, getAllMembershipsService, getMembershipByIdService, updateMembershipService } from '../services/membership.service';
import { Membership } from '../models/Membership';

//Get all membership info controller
export const getAllMembershipsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const memberships = await getAllMembershipsService();
        
        if (memberships !== null) {
            res.status(200).json(memberships); 
        } else {
            res.status(500).json({ message: 'Error getting memberships' }); 
        }
    } catch (error) {
        console.error('Error getting memberships: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//Create a new membership controller with admin jwt validation
export const createMembershipController = async(
    req: Request, res: Response): Promise<void> => {
        
        const membership: Membership = req.body;
        await createMembershipService(membership);
        res.status(201).json({
            message: 'Type of membership created sucess',
            membership,
        });
};

//Get a single membership by id controller
export const getMembershipByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const membershipId: string = req.params.id;
        const membership = await getMembershipByIdService(membershipId);
        if (membership) {
            res.status(200).json(membership);
        } else {
            res.status(404).json({ message: 'Membership not found' });
        }
    } catch (error) {
        console.error('Error getting the membership: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//Update by id a membership controller with admin jwt validation  
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
        console.error('Error updating membership: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};