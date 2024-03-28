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
import { validateCreateAdmin } from '../middlewares/validators/admin/admin.create.validators';
import { validateLoginAdmin } from '../middlewares/validators/admin/admin.login.validators';
import { validateChPassAdmin } from '../middlewares/validators/admin/admin.chpass.validators';
import { validateUpdateAdmin } from '../middlewares/validators/admin/admin.update.validators';

const adminRouter: Router = Router();

adminRouter.route('/')
    .get(verifyAdminJwt, getAllAdminsController)
    .post(validateCreateAdmin, verifyAdminJwt, createAdminController);//

adminRouter.route('/login')
    .post(validateLoginAdmin, loginAdminController);//

adminRouter.route('/me')
    .get(verifyAdminJwt, getLoggedAdminController)    

adminRouter.route('/auth-chpass')
    .post(validateChPassAdmin, verifyAdminJwt, changePasswordController);

adminRouter.route('/:id')
    .get(verifyAdminJwt, getAdminByIdController)
    .delete(verifyAdminJwt, deleteAdminByIdController)
    .patch(validateUpdateAdmin, verifyAdminJwt, updateNameAndLastnameController);

export { adminRouter };