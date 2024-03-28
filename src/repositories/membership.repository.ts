import { Db, Filter, ObjectId } from "mongodb";
import dbConnection from "../configs/database/mongo.conn";
import { Membership } from "../models/Membership";

export const getAllMembershipsRepository = async(): Promise<Membership[] | null> => {
    try {
        const db: Db = await dbConnection();
        const memberships = await db.collection<Membership>('memberships').find().toArray();

        return memberships; 
    } catch (error) {
        console.error('Error getting memberships: ', error);
        return null;
    }
};

export const createMembershipRepository = async(
    membership: Membership
): Promise<ObjectId | null> => {
    try {
        const db: Db = await dbConnection(); 
        const result = await db.collection<Membership>('memberships').insertOne(membership);

        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating membership: ', error);
        return null;
    }
};

export const getMembershipByIdRepository = async(
    membershipId: string
): Promise<Membership | null> => {
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
};

export const deleteMembershipByIdRepository = async(
    membershipId: string
): Promise<boolean> => {
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
};

export const updateMembershipRepository = async(
    membershipId: string, 
    updatedMembershipData: Partial<Membership>
): Promise<boolean> => {
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