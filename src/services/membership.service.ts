import { Db, ObjectId, Filter } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Membership } from '../models/Membership';
import { createMembershipRepository, 
    deleteMembershipByIdRepository, 
    getAllMembershipsRepository, 
    getMembershipByIdRepository, 
    updateMembershipRepository } from '../repositories/membership.repository';

export const getAllMembershipsService = async(): Promise<Membership[] | null> => {
    try {
        return await getAllMembershipsRepository();
    } catch (error) {
        console.error('Error getting memberships: ', error);
        return null;
    }
};

export const createMembershipService = async(
    membership: Membership
): Promise<ObjectId | null> => {
    try {
        return await createMembershipRepository(membership);
    } catch (error) {
        console.error('Error creating membership: ', error);
        return null;
    }
};

export const getMembershipByIdService = async (
    membershipId: string
): Promise<Membership | null> => {
    try {
        return await getMembershipByIdRepository(membershipId);
    } catch (error) {
        console.error('Error getting membership by ID: ', error);
        return null;
    }
};

export const deleteMembershipByIdService = async (
    membershipId: string
): Promise<boolean> => {
    try {
        return await deleteMembershipByIdRepository(membershipId);
    } catch (error) {
        console.error('Error deleting membership:', error);
        return false;
    }
};

export const updateMembershipService = async (
    membershipId: string, 
    updatedMembershipData: Partial<Membership>
): Promise<boolean> => {
    try {
        return await updateMembershipRepository(membershipId, updatedMembershipData);
    } catch (error) {
        console.error('Error updating membership: ', error);
        return false;
    }
};