import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Download } from '../models/Download';
import { createDownloadService, 
    deleteDownloadService, 
    getAllDownloadsService, 
    getDownloadByIdService} from '../services/download.service';
import { AuthenticatedCustomerRequest } from '../middlewares/jwt/verifyCustomerJwt';

//Get all downloads controller
export const getAllDownloadsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const downloads = await getAllDownloadsService(req);
        res.status(200).json(downloads);
    } catch (error) {
        console.error('Error fetching downloads:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Create a new download depending about memberships and game required kind of memberships controller
export const createDownloadController = async (
    req: AuthenticatedCustomerRequest, 
    res: Response
    ): Promise<void> => {
    try {
        const customerId: string | undefined = req.userId;

        if (!customerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { idGame }: { idGame: string } = req.body;

        if (!ObjectId.isValid(idGame)) {
            res.status(400).json({ message: 'Invalid game ID' });
            return;
        }

        const download: Download = {
            idCustomer: customerId,
            idGame: idGame,
            downloadDate: new Date()
        };

        const downloadId = await createDownloadService(download, customerId);

        if (downloadId) {
            res.status(201).json({ message: 'Download created successfully', downloadId });
        } else {
            res.status(500).json({ message: 'Failed to create download' });
        }
    } catch (error) {
        console.error('Error creating download:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a single download by ID controller
export const getDownloadByIdController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
        const downloadId: string = req.params.id;
        const download = await getDownloadByIdService(downloadId);

        if (download) {
            res.status(200).json(download);
        } else {
            res.status(404).json({ message: 'Download not found' });
        }
    } catch (error) {
        console.error('Error getting the download: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete an own download controller 
export const deleteDownloadController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
        const downloadId = req.params.id;
        const success = await deleteDownloadService(req, downloadId);

        if (success) {
            res.status(200).json({ message: 'Download deleted successfully' });
        } else {
            res.status(404).json({ message: 'Download not found or unauthorized' });
        }
    } catch (error) {
        console.error('Error deleting download:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};