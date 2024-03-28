import { Request, Response } from 'express';
import { createGameService, 
    deleteGameByIdService, 
    getAllGamesService, 
    getGameByIdService, 
    searchGamesByMembershipTypeService, 
    updateGameService } 
    from '../services/game.service';
import { Game } from '../models/Game';
import { PaginationOptions, SortOptions } from '../utils/interfaces/repositories/optionsRepository';

export const getAllGamesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, sortBy = 'title', sortOrder = 1 } = req.query;

        const paginationOptions: PaginationOptions = { page: Number(page), limit: 5 };
        const sortOptions: SortOptions = { sortBy: String(sortBy), sortOrder: Number(sortOrder) };

        const games = await getAllGamesService(paginationOptions, sortOptions);

        if (games !== null) {
            res.status(200).json(games);
        } else {
            res.status(500).json({ message: 'Error getting games' });
        }
    } catch (error) {
        console.error('Error getting games: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createGameController = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try {
        const game: Game = req.body;
        const gameId = await createGameService(game);
        
        if (gameId) {
            const response = {
                message: 'Game created successfully',
                game: {
                    _id: gameId,
                    ...game
                }
            };
            res.status(201).json(response);
        } else {
            res.status(400).json({ message: 'Game already exists' }); 
        }
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getGameByIdController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
        const gameId: string = req.params.id;
        const game = await getGameByIdService(gameId);

        if (game) {
            res.status(200).json(game);
        } else {
            res.status(404).json({ message: 'Download not found' });
        }
    } catch (error) {
        console.error('Error getting the download: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteGameByIdController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
        const gameId: string = req.params.id;
        const deleted = await deleteGameByIdService(gameId);

        if (deleted) {
            res.status(200).json({ message: 'Game deleted successfully' });
        } else {
            res.status(404).json({ message: 'Game not found or not deleted' });
        }
    } catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateGameController = async(
    req: Request, 
    res: Response
    ): Promise<void> => {
    try {
        const gameId: string = req.params.id; 
        const updatedGameData: Partial<Game> = req.body; 

        const updatedGame = await updateGameService(gameId, updatedGameData);

        if (updatedGame) {
            res.status(200).json({ message: 'Game updated successfully', updatedData: updatedGameData });
        } else {
            res.status(404).json({ message: 'Game not found or not updated' });
        }
    } catch (error) {
        console.error('Error updating game: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchGamesByMembershipTypeController = async (req: Request, res: Response): Promise<void> => {
    try {
        const membershipType: string | undefined = req.query.type?.toString();

        if (!membershipType) {
            res.status(400).json({ message: 'Membership type is required' });
            return;
        }

        const games = await searchGamesByMembershipTypeService(membershipType);

        if (games === null) {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (games.length === 0) {
            res.status(404).json({ message: 'No games found with the specified membership type' });
            return;
        }

        res.status(200).json(games);
    } catch (error) {
        console.error('Error in searchGamesByMembershipTypeController: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};