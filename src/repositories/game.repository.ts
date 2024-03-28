import { Db, Filter, ObjectId } from "mongodb";
import dbConnection from "../configs/database/mongo.conn";
import { Game } from "../models/Game";
import { Membership } from "../models/Membership";
import { PaginationOptions, SortOptions } from "../utils/interfaces/repositories/optionsRepository";

export const getAllGamesRepository = async (
    paginationOptions: PaginationOptions,
    sortOptions: SortOptions
): Promise<Game[] | null> => {
    try {
        const db: Db = await dbConnection();
        const { page = 1, limit = 5 } = paginationOptions;
        const { sortBy = 'title', sortOrder = 1 } = sortOptions;

        const sortQuery: any = {};
        sortQuery[sortBy] = sortOrder;

        const games = await db
            .collection<Game>('games')
            .find()
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return games;
    } catch (error) {
        console.error('Error getting games: ', error);
        return null;
    }
};

export const createGameRepository = async(
    game: Game
    ): Promise<ObjectId | null> => {
    try {
        const db: Db = await dbConnection(); 
    
        const membershipsCollection = db.collection<Membership>('memberships');
        const filter = { _id: new ObjectId(game.membershipRequiredId) };
        const existingMembership = await membershipsCollection.findOne(filter);

        if (!existingMembership) {
            throw new Error(`Membership with id: ${game.membershipRequiredId} does not exist.`);
        }

        const gamesCollection = db.collection<Game>('games');
        const existingGame = await gamesCollection.findOne({ title: game.title });
        
        if (existingGame) {
            return null; 
        }

        const result = await gamesCollection.insertOne(game);

        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating this game: ', error);
        return null;
    }
};

export const getGameByIdRepository = async(
    gameId: string
    ): Promise<Game | null> => {
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
};

export const deleteGameByIdRepository = async(
    gameId: string
    ): Promise<boolean> => {
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
};

export const updateGameRepository = async(
    gameId: string, 
    updatedGameData: Partial<Game>
): Promise<boolean> => {
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