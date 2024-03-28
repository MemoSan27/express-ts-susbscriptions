import { Db, ObjectId } from "mongodb";
import dbConnection from "../configs/database/mongo.conn";
import { Download } from "../models/Download";
import { Customer } from "../models/Customer";
import { Game } from "../models/Game";
import { Membership } from "../models/Membership";

export const getAllDownloadsRepository = async(
    userId: string, 
    role: string
    ): Promise<Download[] | null> => {
    try {
        const db: Db = await dbConnection();
        const downloadsCollection = db.collection<Download>('downloads');

        let downloads: Download[];

        if (role === 'admin') {
            downloads = await downloadsCollection.find().toArray();
        } else if (role === 'customer') {
            downloads = await downloadsCollection.find({ idCustomer: userId }).toArray();
        } else {
            throw new Error('Invalid role');
        }

        return downloads;
    } catch (error) {
        console.error('Error fetching downloads from repository: ', error);
        return null;
    }
};

export const createDownloadRepository = async (
    download: Download,
    customerId: string
): Promise<ObjectId | null> => {
    try {
        const db: Db = await dbConnection();

        const gamesCollection = db.collection<Game>('games');
        const gameFilter = { _id: new ObjectId(download.idGame) };
        const game = await gamesCollection.findOne(gameFilter);

        if (!game) {
            throw new Error(`Game with id: ${download.idGame} does not exist.`);
        }

        const membershipsCollection = db.collection<Membership>('memberships');
        const membershipFilter = { _id: new ObjectId(game.membershipRequiredId) };
        const requiredMembership = await membershipsCollection.findOne(membershipFilter);

        if (!requiredMembership) {
            throw new Error(`Membership required for the game does not exist.`);
        }

        const customersCollection = db.collection<Customer>('customers');
        const customer = await customersCollection.findOne({ _id: new ObjectId(customerId) });

        if (!customer) {
            throw new Error(`Customer with id: ${customerId} does not exist.`);
        }
        
        if (
            requiredMembership.type === 'Diamond' &&
            customer.membershipId.toString() !== requiredMembership._id.toString()
        ) {
            throw new Error(`Customer does not have the required membership to download the game.`);
        }

        if (requiredMembership.type === 'Gold') {
            const customerMembership = await membershipsCollection.findOne({
                _id: new ObjectId(customer.membershipId)
            });

            if (!customerMembership) {
                throw new Error(`Customer membership not found.`);
            }

            if (
                customerMembership.type !== 'Diamond' &&
                customerMembership.type !== 'Gold'
            ) {
                throw new Error(`Customer does not have the required membership to download the game.`);
            }
        }
        
        const downloadsCollection = db.collection<Download>('downloads');
        const existingDownload = await downloadsCollection.findOne({
            idCustomer: customerId,
            idGame: download.idGame
        });

        if (existingDownload) {
            throw new Error(`Game is already downloaded by the customer.`);
        }
       
        const downloadToInsert: Download = {
            idCustomer: customerId,
            idGame: download.idGame,
            downloadDate: new Date(),
        };

        const result = await downloadsCollection.insertOne(downloadToInsert);

        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating download in repository: ', error);
        return null;
    }
};

export const getDownloadByIdRepository = async(
    downloadId: string
    ): Promise<Download | null> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(downloadId)) {
            throw new Error('Invalid download ID');
        }

        const filter = { _id: new ObjectId(downloadId) };
        const download = await db.collection<Download>('downloads').findOne(filter);

        return download; 
    } catch (error) {
        console.error('Error getting download by ID: ', error);
        return null;
    }
};


export const deleteDownloadRepository = async(
    downloadId: string, 
    customerId: string
    ): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();
        const downloadsCollection = db.collection<Download>('downloads');
        
        const deleteResult = await downloadsCollection.deleteOne({ _id: new ObjectId(downloadId), idCustomer: customerId });

        return deleteResult.deletedCount === 1;
    } catch (error) {
        console.error('Error deleting download:', error);
        throw error;
    }
};

export const deleteDownloadsByCustomerIdRepository = async (customerId: string): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(customerId)) {
            throw new Error('Invalid customer ID');
        }

        const filter = { idCustomer: customerId };
        const result = await db.collection('downloads').deleteMany(filter);

        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting downloads by customer ID:', error);
        return false;
    }
};