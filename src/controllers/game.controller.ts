import { Request, Response } from 'express';
import { createGameService, 
    deleteGameByIdService, 
    getAllGamesService, 
    getGameByIdService, 
    updateGameService } 
    from '../services/game.service';
import { Game } from '../models/Game';

// Get all games controller
export const getAllGamesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const games = await getAllGamesService();
        
        if (games !== null) {
            res.status(200).json(games); 
        } else {
            res.status(500).json({ message: 'Error getting games' }); 
        }
    } catch (error) {
        console.error('Error getting games: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Create a new game controller
export const createGameController = async(
    req: Request, res: Response): Promise<void> => {
        
        const game: Game = req.body;
        await createGameService(game);
        res.status(201).json({
            message: 'Game created successfully',
            game,
        });
};

// Get a single game by ID controller
export const getGameByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const gameId: string = req.params.id;
        const game = await getGameByIdService(gameId);
        if (game) {
            res.status(200).json(game);
        } else {
            res.status(404).json({ message: 'Game not found' });
        }
    } catch (error) {
        console.error('Error getting the game: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete a game by ID controller
export const deleteGameByIdController = async (req: Request, res: Response): Promise<void> => {
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

// Update a game by ID controller 
export const updateGameController = async (req: Request, res: Response): Promise<void> => {
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