import { Db, Collection } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admininst } from '../models/Admin';
import dotenv from 'dotenv';
import { AuthService } from '../utils/interfaces/auth.interface';

dotenv.config();

//Admin Login Service
export const loginAdminService = (db: Db): AuthService => {
    const admins: Collection<Admininst> = db.collection<Admininst>('admins');
  
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
        },
        tokenSecret,
        { expiresIn: '2d' });
      return token;
    };
  
    return { login };
  };