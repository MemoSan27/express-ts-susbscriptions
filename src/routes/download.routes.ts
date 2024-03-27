import { Router } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';
import verifyCustomerJwt from '../middlewares/jwt/verifyCustomerJwt';
import { createDownloadController } from '../controllers/download.controller';

const downloadRouter: Router = Router();

downloadRouter.route('/')
    .get(mockMiddleware('GET desde /downloads'));

downloadRouter.route('/customer')
    .get(mockMiddleware('GET desde /downloads/customer'))
    .post(verifyCustomerJwt, createDownloadController);

downloadRouter.route('/:id')
    .get(mockMiddleware('GET ONE desde /downloads'))
    .delete(mockMiddleware('DELETE desde /downloads'))

export { downloadRouter };