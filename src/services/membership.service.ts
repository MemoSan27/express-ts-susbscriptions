import { Db, ObjectId, Filter } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Membership } from '../models/Membership';

//Get all memberships info service
export const getAllMembershipsService = async (): Promise<Membership[] | null> => {
    try {
        const db: Db = await dbConnection(); 
        
        const memberships = await db.collection<Membership>('memberships').find().toArray();
        return memberships; 
    } catch (error) {
        console.error('Error getting memberships: ', error);
        return null;
    }
}


//Create new membership service
export const createMembershipService = async (membership: Membership): Promise<ObjectId | null> => {
    try {
        const db: Db = await dbConnection(); 

        const result = await db.collection<Membership>('memberships').insertOne(membership);
        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating membership: ', error);
        return null;
    }
}

//Get a single membership by id service
export const getMembershipByIdService = async (membershipId: string): Promise<Membership | null> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(membershipId)) {
            throw new Error('Invalid membership ID');
        }

        const filter = { _id: new ObjectId(membershipId) };

        const membership = await db.collection<Membership>('memberships').findOne(filter);
        return membership; 
    } catch (error) {
        console.error('Error getting membership by ID: ', error);
        return null;
    }
}

//Delete a membership service
export const deleteMembershipByIdService = async (membershipId: string): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(membershipId)) {
            throw new Error('Invalid membership ID');
        }

        const filter = { _id: new ObjectId(membershipId) };

        const result = await db.collection('memberships').deleteOne(filter);
        return result.deletedCount === 1;
    } catch (error) {
        console.error('Error deleting membership:', error);
        return false;
    }
}

//Update membership service
export const updateMembershipService = async (membershipId: string, updatedMembershipData: Partial<Membership>): Promise<boolean> => {
    try {
        const db: Db = await dbConnection(); 
        
        if (!ObjectId.isValid(membershipId)) {
            throw new Error('Invalid membership ID');
        }
        
        const filter: Filter<Membership> = { _id: new ObjectId(membershipId) }; 
        
        const result = await db.collection<Membership>('memberships').updateOne(
            filter, 
            { $set: updatedMembershipData } 
        );

        return result.modifiedCount === 1; 
    } catch (error) {
        console.error('Error updating membership: ', error);
        return false;
    }
};