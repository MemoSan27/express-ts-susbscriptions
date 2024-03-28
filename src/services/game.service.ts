import { ObjectId} from 'mongodb';
import { Game } from '../models/Game';
import cache from '../middlewares/cache/nodeCacheInstance';
import { createGameRepository, 
    deleteGameByIdRepository, 
    getAllGamesRepository, 
    getGameByIdRepository, 
    updateGameRepository } from '../repositories/game.repository';
import { PaginationOptions, SortOptions } from '../utils/interfaces/repositories/optionsRepository';

    export const getAllGamesService = async (
        paginationOptions: PaginationOptions,
        sortOptions: SortOptions
    ): Promise<Game[] | null> => {
        try {
            const games = await getAllGamesRepository(paginationOptions, sortOptions);
            return games;
        } catch (error) {
            console.error('Error in getAllGamesService: ', error);
            return null;
        }
    };

export const createGameService = async(game: Game): Promise<ObjectId | null> => {
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

export const getGameByIdService = async (gameId: string): Promise<Game | null> => {
    try {
        return await getGameByIdRepository(gameId);
    } catch (error) {
        console.error('Error getting game by ID: ', error);
        return null;
    }
};

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