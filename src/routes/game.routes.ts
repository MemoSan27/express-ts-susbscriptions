import { Router } from 'express';
import { createGameController, 
    deleteGameByIdController, 
    getAllGamesController, 
    getGameByIdController, 
    updateGameController } from '../controllers/game.controller';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';
import { validateCreateGame } from '../middlewares/validators/game/game.create.validators';
import { validateUpdateGame } from '../middlewares/validators/game/game.update.validators';

const gameRouter: Router = Router();

gameRouter.route('/')
    .get(getAllGamesController)
    .post(validateCreateGame, verifyAdminJwt, createGameController);

gameRouter.route('/:id')
    .get(getGameByIdController)
    .delete(verifyAdminJwt, deleteGameByIdController)
    .patch(validateUpdateGame, verifyAdminJwt, updateGameController);

export { gameRouter };