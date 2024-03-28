import { Router } from 'express';
import { changePasswordController, 
    createCustomerController, 
    deleteCustomerByIdController, 
    getAllCustomersController, 
    getCustomerByIdController, 
    getLoggedCustomerController, 
    loginCustomerController, 
    updateNameAndLastnameController } from '../controllers/customer.controller';
import verifyCustomerJwt from '../middlewares/jwt/verifyCustomerJwt';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';
import { validateCustomer } from '../middlewares/validators/customer/customer.create.validators';
import { validateUpdateCustomer } from '../middlewares/validators/customer/customer.update.validators';
import { validateLoginCustomer } from '../middlewares/validators/customer/customer.login.validators';
import { validateChPassCustomer } from '../middlewares/validators/customer/customer.chspass.validators';


const customerRouter: Router = Router();

customerRouter.route('/')
    .get(verifyAdminJwt, getAllCustomersController)
    .post(validateCustomer, createCustomerController)

customerRouter.route('/login')
    .post(validateLoginCustomer, loginCustomerController)

customerRouter.route('/me')
    .get(verifyCustomerJwt, getLoggedCustomerController)

customerRouter.route('/auth-chpass')
    .post(validateChPassCustomer, verifyCustomerJwt, changePasswordController)    

customerRouter.route('/:id')
    .get(verifyAdminJwt, getCustomerByIdController)    
    .delete(verifyAdminJwt, deleteCustomerByIdController)    
    .patch(validateUpdateCustomer, verifyAdminJwt, updateNameAndLastnameController)    

export {customerRouter};