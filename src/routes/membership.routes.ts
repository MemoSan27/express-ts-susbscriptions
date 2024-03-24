import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const memebershipRouter: Router = Router();

memebershipRouter.route('/')
    .get(mockMiddleware('GET desde /memberships'));

export {memebershipRouter};