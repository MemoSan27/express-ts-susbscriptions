import { Router } from 'express';
import verifyCustomerJwt from '../middlewares/jwt/verifyCustomerJwt';
import { createDownloadController, 
    deleteDownloadController, 
    getAllDownloadsController, 
    getDownloadByIdController } from '../controllers/download.controller';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';
import { validateCreateDownload } from '../middlewares/validators/downloads/downloads.create.validators';

const downloadRouter: Router = Router();

downloadRouter.route('/')
    .get(verifyAdminJwt, getAllDownloadsController);

downloadRouter.route('/customer')
    .get(verifyCustomerJwt, getAllDownloadsController)
    .post(validateCreateDownload, verifyCustomerJwt, createDownloadController);

downloadRouter.route('/:id')
    .get(verifyAdminJwt, getDownloadByIdController)
    .delete(verifyCustomerJwt, deleteDownloadController)

export { downloadRouter };