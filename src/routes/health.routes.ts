import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const healthRouter: Router = Router();

healthRouter.route('/')
    .get(mockMiddleware('GET desde /health'));

export {healthRouter};