import { Db, ObjectId, Filter } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import { Game } from '../models/Game';
import { Membership } from '../models/Membership';
import cache from '../middlewares/cache/nodeCacheInstance';

// Get all games service chached for 5 minutes
export const getAllGamesService = async (): Promise<Game[] | null> => {
    try {
        const cachedGames = cache.get<Game[]>('allGames');

        if (cachedGames) {
            console.log('Cache hit for all games!');
            return cachedGames;
        }
        
        const db: Db = await dbConnection();
        const games = await db.collection<Game>('games').find().toArray();
        
        
        cache.set('allGames', games, 300);

        return games; 
    } catch (error) {
        console.error('Error getting games: ', error);
        return null;
    }
};

// Create a new game service
export const createGameService = async (
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

        cache.del('allGames');

        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating this game: ', error);
        return null;
    }
};

// Get a single game by its ID service
export const getGameByIdService = async(gameId: string): Promise<Game | null> => {
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
export const deleteGameByIdService = async(gameId: string): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(gameId)) {
            throw new Error('Invalid game ID');
        }

        const filter = { _id: new ObjectId(gameId) };
        const result = await db.collection<Game>('games').deleteOne(filter);

        if (result.deletedCount === 1) {
            cache.del('allGames');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error deleting game:', error);
        return false;
    }
}


// Update a game by its ID service
export const updateGameService = async(
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

        if (result.modifiedCount === 1) {
            cache.del('allGames');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error updating game: ', error);
        return false;
    }
};