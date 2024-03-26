import { Router } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const downloadRouter: Router = Router();

downloadRouter.route('/')
    .get(mockMiddleware('GET desde /downloads'))
    .post(mockMiddleware('POST desde /downloads'))

downloadRouter.route('/:id')
    .get(mockMiddleware('GET ONE desde /downloads'))
    .delete(mockMiddleware('DELETE desde /downloads'))
    .patch(mockMiddleware('PATCH desde /downloads'))

export {downloadRouter};