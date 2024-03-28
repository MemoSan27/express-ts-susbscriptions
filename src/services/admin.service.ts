import { Db, Collection, ObjectId, Filter } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Administ } from '../models/Admin';
import dotenv from 'dotenv';
import { AuthService } from '../utils/interfaces/auth.interface';
import { changePasswordRepository, 
  checkExistingAdminEmailRepository, 
  createAdminRepository, 
  deleteAdminByIdRepository, 
  getAdminByIdRepository, 
  getAllAdminsRepository, 
  updateNameAndLastnameRepository 
} from '../repositories/admin.repository';

dotenv.config();

export const getAllAdminsService = async(): Promise<Administ[] | null> => {
  try {
      return await getAllAdminsRepository();
  } catch (error) {
      console.error('Error getting admins: ', error);
      return null;
  }
};

export const createAdminService = async(
  admin: Administ
  ): Promise<ObjectId | null> => {
  try {
      return await createAdminRepository(admin);
  } catch (error) {
      console.error('Error creating admin: ', error);
      return null;
  }
};

export const getAdminByIdService = async(
  adminId: string
  ): Promise<Administ | null> => {
  try {
      return await getAdminByIdRepository(adminId);
  } catch (error) {
      console.error('Error getting admin by ID: ', error);
      return null;
  }
};

export const deleteAdminByIdService = async(
  adminId: string
  ): Promise<boolean> => {
  try {
      return await deleteAdminByIdRepository(adminId);
  } catch (error) {
      console.error('Error deleting admin:', error);
      return false;
  }
};

export const updateNameAndLastnameService = async(
  adminId: string, 
  name: string
): Promise<boolean> => {
  try {
      return await updateNameAndLastnameRepository(adminId, name);
  } catch (error) {
      console.error('Error updating name and lastname: ', error);
      throw error;
  }
};

export const checkExistingAdminEmailService = async(
  email: string
  ): Promise<boolean> => {
  try {
      return await checkExistingAdminEmailRepository(email);
  } catch (error) {
      console.error('Error checking existing email:', error);
      return true; 
  }
};

export const changePasswordService = async (
  adminId: ObjectId, 
  oldPassword: string, 
  newPassword: string
): Promise<boolean> => {
  try {
      return await changePasswordRepository(adminId, oldPassword, newPassword);
  } catch (error) {
      console.error('Error in process: ', error);
      throw error;
  }
};

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