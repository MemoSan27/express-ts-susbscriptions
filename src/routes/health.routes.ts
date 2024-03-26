import { Router } from 'express';
import { checkHealthController } from '../controllers/health.controller';


const healthRouter: Router = Router();

healthRouter.route('/')
    .get(checkHealthController);

export {healthRouter};