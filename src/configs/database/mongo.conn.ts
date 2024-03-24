import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const MONGO_DB = process.env.MONGO_DB || '';

async function dbConnection() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log('Connected success to MongoDB');

        const db = client.db(MONGO_DB);

        return db;

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err; 
    }
}

export default dbConnection;