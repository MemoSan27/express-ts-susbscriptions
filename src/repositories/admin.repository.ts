import { Collection, Db, Filter, ObjectId } from "mongodb";
import dbConnection from "../configs/database/mongo.conn";
import bcrypt from 'bcrypt'
import { Administ } from "../models/Admin";

export const getAllAdminsRepository = async (): Promise<Administ[] | null> => {
    try {
        const db: Db = await dbConnection();
        const admins = await db.collection<Administ>('admins').find().toArray();

        return admins;
    } catch (error) {
        console.error('Error getting admins: ', error);
        return null;
    }
};

export const createAdminRepository = async (admin: Administ): Promise<ObjectId | null> => {
    try {
        const db: Db = await dbConnection();

        const { password, ...adminWithoutPassword } = admin;

        const hashedPassword = await bcrypt.hash(admin.password, 10);
        const adminToInsert = { ...adminWithoutPassword, password: hashedPassword };
        const result = await db.collection<Administ>('admins').insertOne(adminToInsert);

        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating admin: ', error);
        return null;
    }
};

export const getAdminByIdRepository = async (adminId: string): Promise<Administ | null> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(adminId)) {
            throw new Error('Invalid admin ID');
        }

        const filter = { _id: new ObjectId(adminId) };
        const admin = await db.collection<Administ>('admins').findOne(filter);

        return admin;
    } catch (error) {
        console.error('Error getting admin by ID: ', error);
        return null;
    }
};

export const deleteAdminByIdRepository = async (adminId: string): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(adminId)) {
            throw new Error('Invalid admin ID');
        }

        const filter = { _id: new ObjectId(adminId) };
        const result = await db.collection<Administ>('admins').deleteOne(filter);

        return result.deletedCount === 1;
    } catch (error) {
        console.error('Error deleting admin:', error);
        return false;
    }
};

export const updateNameAndLastnameRepository = async (
    adminId: string, 
    name: string
): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(adminId)) {
            throw new Error('Invalid admin ID');
        }

        const filter: Filter<Administ> = { _id: new ObjectId(adminId) };

        const result = await db.collection<Administ>('admins').updateOne(
            filter,
            { $set: { name } }
        );

        return result.modifiedCount === 1;
    } catch (error) {
        console.error('Error updating name and lastname: ', error);
        throw error;
    }
};

export const checkExistingAdminEmailRepository = async (email: string): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();
        const admins: Collection<Administ> = db.collection<Administ>('admins');
        const existingAdmin = await admins.findOne({ email });

        return !!existingAdmin; 
    } catch (error) {
        console.error('Error checking existing email:', error);
        return true; 
    }
};

export const changePasswordRepository = async (
    adminId: ObjectId, 
    oldPassword: string, 
    newPassword: string
): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();
        const admins = db.collection('admins');
        const admin = await admins.findOne({ _id: adminId });

        if (!admin) {
            throw new Error('Admin not found');
        }

        const passwordMatch = await bcrypt.compare(oldPassword, admin.password);

        if (!passwordMatch) {
            return false;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await admins.updateOne({ _id: adminId }, { $set: { password: hashedPassword } });

        return true;
    } catch (error) {
        console.error('Error in process: ', error);
        throw error;
    }
};