import { Db } from 'mongodb';
import bcrypt from 'bcrypt';
import dbConnection from '../../configs/database/mongo.conn';

async function seed() {
  const db: Db = await dbConnection();

  try {
    const adminCount = await db.collection('admins').countDocuments();
    if (adminCount > 0) {
      console.log('One or more admins already exists in database. Not necessary seed data.');
      return;
    }

    const hashedPassword = await bcrypt.hash('super27', 10);

    const result = await db.collection('admins').insertOne({
      name: 'Super Admin',
      email: 'superadmin@memo.com',
      password: hashedPassword,
      rol: 'superadmin'
    });

    console.log('Super admin created success:', result.insertedId);
  } catch (error) {
    console.error('Error in seed process:', error);
  } 
}

seed();