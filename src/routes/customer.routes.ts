import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const homeRouter = Router();

homeRouter.route('/')
    .get(mockMiddleware('Welcome to subscriptions system!'));

export default homeRouter;