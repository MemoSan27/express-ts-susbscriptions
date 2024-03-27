import { Router } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';
import { validateCustomer } from '../middlewares/validators/customer.validators';
import { changePasswordController, createCustomerController, getAllCustomersController, getCustomerByIdController, getLoggedCustomerController, loginCustomerController, updateNameAndLastnameController } from '../controllers/customer.controller';
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
    .delete(mockMiddleware('DELETE desde /customers'))    
    .patch(verifyAdminJwt, updateNameAndLastnameController)    

export {customerRouter};