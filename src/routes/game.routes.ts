import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const gameRouter: Router = Router();

gameRouter.route('/')
    .get(mockMiddleware('GET desde /games'));

export {gameRouter};