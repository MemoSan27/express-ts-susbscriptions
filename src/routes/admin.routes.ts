import { Router } from 'express';
import { changePasswordController, 
    createAdminController, 
    deleteAdminByIdController, 
    getAllAdminsController, 
    getAdminByIdController, 
    loginAdminController, 
    updateNameAndLastnameController, 
    getLoggedAdminController } from '../controllers/admin.controller';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';
import { validateAdmin } from '../middlewares/validators/admin.validators';

const adminRouter: Router = Router();

adminRouter.route('/')
    .get(verifyAdminJwt, getAllAdminsController)
    .post(validateAdmin, verifyAdminJwt, createAdminController);

adminRouter.route('/login')
    .post(loginAdminController);

adminRouter.route('/me')
    .get(verifyAdminJwt, getLoggedAdminController)    

adminRouter.route('/auth-chpass')
    .post(verifyAdminJwt, changePasswordController);

adminRouter.route('/:id')
    .get(verifyAdminJwt, getAdminByIdController)
    .delete(verifyAdminJwt, deleteAdminByIdController)
    .patch(validateAdmin, verifyAdminJwt, updateNameAndLastnameController);

export { adminRouter };