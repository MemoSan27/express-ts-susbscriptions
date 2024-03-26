import { Db } from 'mongodb';
import bcrypt from 'bcrypt';
import dbConnection from '../../configs/database/mongo.conn';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const db: Db = await dbConnection();

  try {
    const adminCount = await db.collection('admins').countDocuments();
    if (adminCount > 0) {
      console.log('One or more admins already exists in database. Not necessary seed data.');
      return;
    }

    const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;
    if (seedAdminPassword === undefined) {
      throw new Error('Seed admin password is not defined in environment variables.');
    }

    const hashedPassword = await bcrypt.hash(seedAdminPassword, 10);

    const result = await db.collection('admins').insertOne({
      name: process.env.SEED_ADMIN_NAME,
      email: process.env.SEED_ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Super admin created success:', result.insertedId);
  } catch (error) {
    console.error('Error in seed process:', error);
  } 
}

seed();