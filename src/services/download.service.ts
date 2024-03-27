import { Db, Collection, ObjectId, Filter } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Customer } from '../models/Customer';
import { Game } from '../models/Game';
import { Download } from '../models/Download';
import { Membership } from '../models/Membership';


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

        // Verificar si la membresía requerida existe
        const membershipsCollection = db.collection<Membership>('memberships');
        const membershipFilter = { _id: new ObjectId(game.membershipRequiredId) };
        const requiredMembership = await membershipsCollection.findOne(membershipFilter);
        if (!requiredMembership) {
            throw new Error(`Membership required for the game does not exist.`);
        }

        // Verificar si el cliente existe y tiene la membresía adecuada para descargar el juego
        const customersCollection = db.collection<Customer>('customers');
        const customer = await customersCollection.findOne({ _id: new ObjectId(customerId) });
        if (!customer) {
            throw new Error(`Customer with id: ${customerId} does not exist.`);
        }

        // Verificar si el cliente tiene la membresía adecuada para descargar el juego
        if (
            requiredMembership.type === 'Diamond' &&
            customer.membershipId.toString() !== requiredMembership._id.toString()
        ) {
            throw new Error(`Customer does not have the required membership to download the game.`);
        }

        // Permitir el acceso si el cliente tiene una membresía de tipo "Diamond"
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

        // Verificar si el juego ya fue descargado por el cliente
        const downloadsCollection = db.collection<Download>('downloads');
        const existingDownload = await downloadsCollection.findOne({
            idCustomer: new ObjectId(customerId),
            idGame: new ObjectId(download.idGame)
        });
        if (existingDownload) {
            throw new Error(`Game is already downloaded by the customer.`);
        }

        // Crear la descarga con la fecha actual
        const downloadToInsert: Download = {
            idCustomer: new ObjectId(customerId),
            idGame: new ObjectId(download.idGame),
            downloadDate: new Date()
        };

        const result = await downloadsCollection.insertOne(downloadToInsert);

        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating download: ', error);
        return null;
    }
};