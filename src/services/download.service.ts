import { Db, Collection, ObjectId, Filter } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Customer } from '../models/Customer';
import { Game } from '../models/Game';
import { Download } from '../models/Download';
import { Membership } from '../models/Membership';
import { AuthenticatedRequest } from '../middlewares/jwt/verifyAdminJwt';
import cache from '../middlewares/cache/nodeCacheInstance';

//Get all downloads service
export const getAllDownloadsService = async (req: AuthenticatedRequest): Promise<Download[] | null> => {
    try {
        const cachedDownloads = cache.get<Download[]>('allDownloads');

        if (cachedDownloads) {
            console.log('Cache hit for all downloads!');
            return cachedDownloads;
        }

        const db: Db = await dbConnection();
        const downloadsCollection = db.collection<Download>('downloads');
        
        let downloads: Download[];

        if (req.role === 'admin') {
            downloads = await downloadsCollection.find().toArray();
            cache.set('allDownloads', downloads, 300);
        } else if (req.role === 'customer') {
            const customerId = req.userId;
            downloads = await downloadsCollection.find({ idCustomer: customerId }).toArray();
        } else {
            throw new Error('Invalid role');
        }

        return downloads; 
    } catch (error) {
        console.error('Error fetching downloads: ', error);
        return null;
    }
};

//Create a new download depending about memberships and game required kind of memberships service
export const createDownloadService = async (
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

        cache.del('allDownloads');

        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating download: ', error);
        return null;
    }
};

// Get a single download by ID  and just by an authenticated admin service
export const getDownloadByIdService = async(downloadId: string): Promise<Game | null> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(downloadId)) {
            throw new Error('Invalid download ID');
        }

        const filter = { _id: new ObjectId(downloadId) };
        const game = await db.collection<Game>('downloads').findOne(filter);

        return game; 
    } catch (error) {
        console.error('Error getting download by ID: ', error);
        return null;
    }
}

// Delete an own download service
export const deleteDownloadService = async (
    req: AuthenticatedRequest, 
    downloadId: string
): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();
        const downloadsCollection = db.collection<Download>('downloads');
        
        const customerId = req.userId;
        
        const deleteResult = await downloadsCollection.deleteOne({ _id: new ObjectId(downloadId), idCustomer: customerId });

        if (deleteResult.deletedCount === 1) {
            cache.del('allDownloads');
            return true;
        } else {
            return false; 
        }
    } catch (error) {
        console.error('Error deleting download:', error);
        throw error;
    }
};