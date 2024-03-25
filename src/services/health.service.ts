import { Db } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import colors from 'colors';

export async function checkDatabaseHealth(): Promise<boolean> {

    try {
        const db: Db = await dbConnection();
        await db.command({ ping: 1 });
        return true; // La base de datos está disponible
      } catch (error) {
        console.error(colors.bgRed.bold('Database connection error:' + error));
        return false; // La base de datos no está disponible
      }
}