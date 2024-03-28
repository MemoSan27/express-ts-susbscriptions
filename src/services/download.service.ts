import {ObjectId} from 'mongodb';
import { Download } from '../models/Download';
import { AuthenticatedRequest } from '../middlewares/jwt/verifyAdminJwt';
import cache from '../middlewares/cache/nodeCacheInstance';
import { createDownloadRepository, 
    deleteDownloadRepository, 
    getAllDownloadsRepository, 
    getDownloadByIdRepository } from '../repositories/downloads.repository';



//Get all downloads service
export const getAllDownloadsService = async(
    req: AuthenticatedRequest
    ): Promise<Download[] | null> => {
    try {
        let downloads: Download[] | null;

        if (req.role === 'admin') {
            downloads = cache.get<Download[]>('adminDownloads') || null;
            if (!downloads) {
                downloads = await getAllDownloadsRepository(req.userId!, req.role);
                cache.set('adminDownloads', downloads, 300);
            } else{
                console.log('Cache hit for all downloads!');
            }
        } else if (req.role === 'customer') {
            const cacheKey = `customerDownloads_${req.userId}`;
            downloads = cache.get<Download[]>(cacheKey) || null;
            if (!downloads) {
                downloads = await getAllDownloadsRepository(req.userId!, req.role);
                cache.set(cacheKey, downloads, 300);
            }else{
                console.log('Cache hit for customer downloads!');
            }
        } else {
            throw new Error('Invalid role');
        }

        return downloads;
    } catch (error) {
        console.error('Error fetching downloads: ', error);
        return null;
    }
};

export const createDownloadService = async(
    download: Download,
    customerId: string
): Promise<ObjectId | null> => {
    try {
        return await createDownloadRepository(download, customerId);
    } catch (error) {
        console.error('Error creating download in service: ', error);
        return null;
    }
};

export const getDownloadByIdService = async (downloadId: string): Promise<Download | null> => {
    try {
        return await getDownloadByIdRepository(downloadId);
    } catch (error) {
        console.error('Error getting download by ID: ', error);
        return null;
    }
};

export const deleteDownloadService = async(
    req: AuthenticatedRequest, 
    downloadId: string): Promise<boolean> => {
    try {
        const customerId = req.userId;
        
        return await deleteDownloadRepository(downloadId, customerId!);
    } catch (error) {
        console.error('Error deleting download:', error);
        throw error;
    }
};