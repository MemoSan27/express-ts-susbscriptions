import { Router } from 'express';
import verifyCustomerJwt from '../middlewares/jwt/verifyCustomerJwt';
import { createDownloadController, 
    deleteDownloadController, 
    getAllDownloadsController, 
    getDownloadByIdController } from '../controllers/download.controller';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';

const downloadRouter: Router = Router();

downloadRouter.route('/')
    .get(verifyAdminJwt, getAllDownloadsController);

downloadRouter.route('/customer')
    .get(verifyCustomerJwt, getAllDownloadsController)
    .post(verifyCustomerJwt, createDownloadController);

downloadRouter.route('/:id')
    .get(verifyAdminJwt, getDownloadByIdController)
    .delete(verifyCustomerJwt, deleteDownloadController)

export { downloadRouter };