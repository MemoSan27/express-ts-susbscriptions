import { Db, Collection } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admininst } from '../models/Admin';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthService {
    login(email: string, password: string): Promise<string | null>;
}

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

      const tokenSecret = process.env.TOKEN_SECRET || '32as26a26d2sa32d3as2d32a3sd1';
  
      const token = jwt.sign({ 
        email: admin.email, 
        role: admin.role },
        tokenSecret,
        { expiresIn: '2d' });
      return token;
    };
  
    return { login };
  };