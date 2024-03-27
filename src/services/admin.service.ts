import { Db, Collection, ObjectId, Filter } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Administ } from '../models/Admin';
import dotenv from 'dotenv';
import { AuthService } from '../utils/interfaces/auth.interface';
import dbConnection from '../configs/database/mongo.conn';

dotenv.config();

// Get all admins service
export const getAllAdminsService = async (): Promise<Administ[] | null> => {
  try {
      const db: Db = await dbConnection();
      const admins = await db.collection<Administ>('admins').find().toArray();
      return admins;
  } catch (error) {
      console.error('Error getting admins: ', error);
      return null;
  }
}

// Create new admin service
export const createAdminService = async (admin: Administ): Promise<ObjectId | null> => {
  try {
      const db: Db = await dbConnection();
      const result = await db.collection<Administ>('admins').insertOne(admin);
      return result.insertedId ? new ObjectId(result.insertedId) : null;
  } catch (error) {
      console.error('Error creating admin: ', error);
      return null;
  }
}

// Get a single admin by id service
export const getAdminByIdService = async (adminId: string): Promise<Administ | null> => {
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
}

// Delete an admin by ID service
export const deleteAdminByIdService = async (adminId: string): Promise<boolean> => {
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
}

// Update just name or lastname service with administrator assistance
export const updateNameAndLastnameService = async (adminId: string, name: string): Promise<boolean> => {
  try {
      const db = await dbConnection();

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

export const checkExistingAdminEmailService = async (email: string): Promise<boolean> => {
  try {
      const db: Db = await dbConnection();
      const admins: Collection<Administ> = db.collection<Administ>('admins');

      const existingAdmin = await admins.findOne({ email });
      return !!existingAdmin; // Devuelve true si el cliente existe, false si no
  } catch (error) {
      console.error('Error checking existing email:', error);
      return true; // Devuelve true para manejar el caso de error
  }
};

// Change authenticated admin password service
export const changePasswordService = async (adminId: ObjectId, oldPassword: string, newPassword: string): Promise<boolean> => {
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

//Admin Login Service
export const loginAdminService = (db: Db): AuthService => {
    const admins: Collection<Administ> = db.collection<Administ>('admins');
  
    const login: AuthService['login'] = async (email, password) => {
      const admin = await admins.findOne({ email });
  
      if (!admin) {
        return null; 
      }
  
      const passwordMatch = await bcrypt.compare(password, admin.password);
  
      if (!passwordMatch) {
        return null;
      }

      const tokenSecret = process.env.TOKEN_SECRET!;
  
      const token = jwt.sign({ 
        userId: admin._id,
        user: admin.name,
        role: 'admin',
        },
        tokenSecret,
        { expiresIn: '2d' });
      return token;
    };
  
    return { login };
  };