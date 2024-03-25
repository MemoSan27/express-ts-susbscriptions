import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI || '';
const MONGO_DB: string = process.env.MONGO_DB || '';

let cachedDb: Db | null = null;

export const dbConnection = async(): Promise<Db> => {
    if (cachedDb) {
        return cachedDb;
    }

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log(colors.bgGreen.bold('Connected successfully to MongoDB'));

        const db = client.db(MONGO_DB);
        cachedDb = db; 

        return db;
    } catch (err) {
        console.error(colors.bgRed.bold('Error connecting to MongoDB:'), err);
        throw err;
    }
}

export default dbConnection;