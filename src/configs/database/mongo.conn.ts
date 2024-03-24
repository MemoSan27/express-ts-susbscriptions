import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI: string = process.env.MONGO_URI || '';
const MONGO_DB: string = process.env.MONGO_DB || '';

async function dbConnection(): Promise<MongoClient> { // Ajusta el tipo de retorno a MongoClient
    if (!MONGO_URI || !MONGO_DB) {
        throw new Error('Las variables de entorno MONGO_URI y MONGO_DB son necesarias');
    }

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log('Conexión exitosa a MongoDB');

        return client;

    } catch (error) {
        console.error('Error de conexión a MongoDB:', error);
        throw error;
    }
}

export default dbConnection;