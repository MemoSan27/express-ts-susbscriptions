import { Db, ObjectId, Filter } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Game } from '../models/Game';

// Get all games service
export const getAllGamesService = async (): Promise<Game[] | null> => {
    try {
        const db: Db = await dbConnection(); 
        const games = await db.collection<Game>('games').find().toArray();

        return games; 
    } catch (error) {
        console.error('Error getting games: ', error);
        return null;
    }
}

// Create a new game service
export const createGameService = async (game: Game): Promise<ObjectId | null> => {
    try {
        const db: Db = await dbConnection(); 
        const result = await db.collection<Game>('games').insertOne(game);

        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating game: ', error);
        return null;
    }
}

// Get a single game by its ID service
export const getGameByIdService = async (gameId: string): Promise<Game | null> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(gameId)) {
            throw new Error('Invalid game ID');
        }

        const filter = { _id: new ObjectId(gameId) };
        const game = await db.collection<Game>('games').findOne(filter);

        return game; 
    } catch (error) {
        console.error('Error getting game by ID: ', error);
        return null;
    }
}

// Delete a game by ID service
export const deleteGameByIdService = async (gameId: string): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(gameId)) {
            throw new Error('Invalid game ID');
        }

        const filter = { _id: new ObjectId(gameId) };
        const result = await db.collection<Game>('games').deleteOne(filter);

        return result.deletedCount === 1;
    } catch (error) {
        console.error('Error deleting game:', error);
        return false;
    }
}

// Update a game by its ID service
export const updateGameService = async (gameId: string, updatedGameData: Partial<Game>): Promise<boolean> => {
    try {
        const db: Db = await dbConnection(); 
        
        if (!ObjectId.isValid(gameId)) {
            throw new Error('Invalid game ID');
        }
        
        const filter: Filter<Game> = { _id: new ObjectId(gameId) }; 
        
        const result = await db.collection<Game>('games').updateOne(
            filter, 
            { $set: updatedGameData } 
        );

        return result.modifiedCount === 1; 
    } catch (error) {
        console.error('Error updating game: ', error);
        return false;
    }
};