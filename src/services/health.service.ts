import { Db } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import colors from 'colors';

export async function checkDatabaseHealth(): Promise<boolean> {
    try {
        const db: Db = await dbConnection();

        await db.command({ ping: 1 });
        return true;
    } catch (error) {
        console.error(colors.bgRed.bold('Database connection error:'), error);
        return false;
    }
}