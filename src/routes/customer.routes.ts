import { Router } from 'express';
import { validateCustomer } from '../middlewares/validators/customer.validators';
import { changePasswordController, createCustomerController, deleteCustomerByIdController, getAllCustomersController, getCustomerByIdController, getLoggedCustomerController, loginCustomerController, updateNameAndLastnameController } from '../controllers/customer.controller';
import verifyCustomerJwt from '../middlewares/jwt/verifyCustomerJwt';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';


const customerRouter: Router = Router();

customerRouter.route('/')
    .get(verifyAdminJwt, getAllCustomersController)
    .post(validateCustomer, createCustomerController)

customerRouter.route('/login')
    .post(loginCustomerController)

customerRouter.route('/me')
    .get(verifyCustomerJwt, getLoggedCustomerController)

customerRouter.route('/auth-chpass')
    .post(verifyCustomerJwt, changePasswordController)    

customerRouter.route('/:id')
    .get(verifyAdminJwt, getCustomerByIdController)    
    .delete(verifyAdminJwt, deleteCustomerByIdController)    
    .patch(verifyAdminJwt, updateNameAndLastnameController)    

export {customerRouter};