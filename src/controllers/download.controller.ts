import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Download } from '../models/Download';
import { createDownloadService } from '../services/download.service';
import { AuthenticatedCustomerRequest } from '../middlewares/jwt/verifyCustomerJwt';


export const createDownloadController = async (req: AuthenticatedCustomerRequest, res: Response): Promise<void> => {
    try {
        // Obtener la ID del cliente del middleware verifyCustomerJwt
        const customerId: string | undefined = req.userId;

        // No autorizado si la ID del cliente no está presente
        if (!customerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Extraer datos del cuerpo de la solicitud (en este caso, solo el ID del juego)
        const { idGame }: { idGame: string } = req.body;

        // Verificar si el ID del juego es un ObjectId válido
        if (!ObjectId.isValid(idGame)) {
            res.status(400).json({ message: 'Invalid game ID' });
            return;
        }

        // Crear el objeto Download con la ID del cliente y el ID del juego
        const download: Download = {
            idCustomer: new ObjectId(customerId),
            idGame: new ObjectId(idGame),
            downloadDate: new Date()
        };

        // Llamar al servicio para crear la descarga
        const downloadId = await createDownloadService(download, customerId);

        // Manejar la respuesta del servicio
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