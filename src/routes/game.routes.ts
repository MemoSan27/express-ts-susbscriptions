import { Router } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const gameRouter: Router = Router();

gameRouter.route('/')
    .get(mockMiddleware('GET desde /games'))
    .post(mockMiddleware('POST desde /games'))

gameRouter.route('/:id')
    .get(mockMiddleware('GET ONE desde /games'))
    .delete(mockMiddleware('DELETE desde /games'))
    .patch(mockMiddleware('PATCH desde /games'))

export {gameRouter};