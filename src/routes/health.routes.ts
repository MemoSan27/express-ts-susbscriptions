import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';
import { checkHealthController } from '../controllers/health.controller';


const healthRouter: Router = Router();

healthRouter.route('/')
    .get(checkHealthController);

export {healthRouter};