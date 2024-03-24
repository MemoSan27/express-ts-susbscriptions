import cron from 'node-cron';
import { MongoClient } from 'mongodb'; // Cambia la importación a MongoClient
import dbConnection from "../../configs/database/mongo.conn";
import { verifyDB } from "./verifyDB";
import { verifyWeb } from "./verifyWeb";

export const healthCheck = () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Running health check...');
        let client: MongoClient | undefined; 
        try {
            client = await dbConnection();
            if (client) {
                await verifyDB(client); 
                await verifyWeb();
                console.log('Health check COMPLETED SUCCESS');
            } else {
                throw new Error('Error: Could not establish connection with MongoDB');
            }
        } catch (error: any) {
            console.error('Health check failed:', error.message);
        } finally {
            if (client) {
                await client.close();
            }
        }
    });
};