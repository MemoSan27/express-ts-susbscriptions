import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const customerRouter: Router = Router();

customerRouter.route('/')
    .get(mockMiddleware('GET desde /customers'));

export {customerRouter};