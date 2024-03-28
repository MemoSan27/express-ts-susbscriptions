import { Db, ObjectId, Filter } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Game } from '../models/Game';
import { Membership } from '../models/Membership';
import cache from '../middlewares/cache/nodeCacheInstance';
import { createGameRepository, deleteGameByIdRepository, getAllGamesRepository, getGameByIdRepository, updateGameRepository } from '../repositories/game.repository';

// Get all games service chached for 5 minutes
export const getAllGamesService = async (): Promise<Game[] | null> => {
    try {
        const cachedGames = cache.get<Game[]>('allGames');

        if (cachedGames) {
            console.log('Cache hit for all games!');
            return cachedGames;
        }
        
        const games = await getAllGamesRepository();
        
        if (games !== null) {
            cache.set('allGames', games, 300);
        }

        return games; 
    } catch (error) {
        console.error('Error getting games: ', error);
        return null;
    }
};

// Create a new game service
export const createGameService = async (game: Game): Promise<ObjectId | null> => {
    try {
        const result = await createGameRepository(game);

        if (result !== null) {
            cache.del('allGames');
        }

        return result;
    } catch (error) {
        console.error('Error creating this game: ', error);
        return null;
    }
};

// Get a single game by its ID service
export const getGameByIdService = async (gameId: string): Promise<Game | null> => {
    try {
        return await getGameByIdRepository(gameId);
    } catch (error) {
        console.error('Error getting game by ID: ', error);
        return null;
    }
};

// Delete a game by ID service
export const deleteGameByIdService = async (gameId: string): Promise<boolean> => {
    try {
        const result = await deleteGameByIdRepository(gameId);

        if (result) {
            cache.del('allGames');
        }

        return result;
    } catch (error) {
        console.error('Error deleting game:', error);
        return false;
    }
};


// Update a game by its ID service
export const updateGameService = async (
    gameId: string, 
    updatedGameData: Partial<Game>
): Promise<boolean> => {
    try {
        const result = await updateGameRepository(gameId, updatedGameData);

        if (result) {
            cache.del('allGames');
        }

        return result;
    } catch (error) {
        console.error('Error updating game: ', error);
        return false;
    }
};