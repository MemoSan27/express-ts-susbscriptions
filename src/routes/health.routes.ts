import { Router, Request, Response } from 'express';
import { healthCheckHandler } from '../controllers/health.controller';



const healtRouter: Router = Router();

healtRouter.route('/')
    .get(healthCheckHandler);

export {healtRouter};