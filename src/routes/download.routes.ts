import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const downloadRouter: Router = Router();

downloadRouter.route('/')
    .get(mockMiddleware('GET desde /downloads'));

export {downloadRouter};