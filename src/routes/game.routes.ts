import { Router } from 'express';
import { createGameController, 
    deleteGameByIdController, 
    getAllGamesController, 
    getGameByIdController, 
    updateGameController } from '../controllers/game.controller';
import { validateGame } from '../middlewares/validators/game/game.validators';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';

const gameRouter: Router = Router();

gameRouter.route('/')
    .get(getAllGamesController)
    .post(validateGame, verifyAdminJwt, createGameController);

gameRouter.route('/:id')
    .get(getGameByIdController)
    .delete(verifyAdminJwt, deleteGameByIdController)
    .patch(validateGame, verifyAdminJwt, updateGameController);

export { gameRouter };