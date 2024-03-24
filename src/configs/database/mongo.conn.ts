import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI || '';
const MONGO_DB: string = process.env.MONGO_DB || '';

async function dbConnection(): Promise<Db> {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log(colors.bgWhite.bold('Connected success to MongoDB'));

        const db = client.db(MONGO_DB);

        return db;

    } catch (err) {
        console.error(colors.bgRed.bold('Error connecting to MongoDB:'), err);
        throw err; 
    }
}

export default dbConnection;