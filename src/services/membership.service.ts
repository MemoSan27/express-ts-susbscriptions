import { Db, ObjectId, Filter } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Membership } from '../models/Membership';

//Create new membership service
export const createMembershipService = async (membership: Membership): Promise<ObjectId | null> => {
    try {
        const db: Db = await dbConnection(); 
        const result = await db.collection<Membership>('memberships').insertOne(membership);
        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating membership:', error);
        return null;
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
        console.error('Error updating membership:', error);
        return false;
    }
};