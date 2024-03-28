import { Request, Response } from 'express';
import { createMembershipService, 
    deleteMembershipByIdService, 
    getAllMembershipsService, 
    getMembershipByIdService, 
    updateMembershipService } 
    from '../services/membership.service';
import { Membership } from '../models/Membership';

export const getAllMembershipsController = async(
    req: Request,
    res: Response
    ): Promise<void> => {
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

export const createMembershipController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
        const membership: Membership = req.body;
        const membershipId = await createMembershipService(membership);
        
        if (membershipId) {
            const response = {
                message: 'Membership created successfully',
                membership: {
                    _id: membershipId,
                    ...membership
                }
            };
            res.status(201).json(response);
        } else {
            res.status(500).json({ message: 'Failed to create membership' });
        }
    } catch (error) {
        console.error('Error creating membership:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMembershipByIdController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
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

export const deleteMembershipByIdController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
        const membershipId: string = req.params.id;
        const deleted = await deleteMembershipByIdService(membershipId);

        if (deleted) {
            res.status(200).json({ message: 'Membership deleted successfully' });
        } else {
            res.status(404).json({ message: 'Membership not found or not deleted' });
        }
    } catch (error) {
        console.error('Error deleting membership:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateMembershipController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
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