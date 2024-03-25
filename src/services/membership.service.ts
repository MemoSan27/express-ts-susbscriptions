import { Db, ObjectId } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Membership } from '../models/Membership';

export const createMembershipService = async (membership: Membership): Promise<ObjectId | null> => {
    try {
        const db = await dbConnection(); 
        const result = await db.collection<Membership>('memberships').insertOne(membership);
        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating membership:', error);
        return null;
    }
}