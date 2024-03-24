import { MongoClient } from 'mongodb';

export const verifyDB = async(client: MongoClient): Promise<void> => {
    try {
        const database = client.db('subscriptions');
        const result = await database.command({ ping: 1 });
        if ((result as any).ok === 1) {
            console.log('Database is connected with no issues');
        } else {
            throw new Error('Database is not online');
        }
    } catch (error) {
        console.error('Error verifying database:', error);
        throw error;
    }
};