import { Router } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';
import { validateCustomer } from '../middlewares/validators/customer.validators';
import { changePasswordController, createCustomerController, getLoggedCustomerController, loginCustomerController } from '../controllers/customer.controller';
import verifyCustomerJwt from '../middlewares/jwt/verifyCustomerJwt';


const customerRouter: Router = Router();

customerRouter.route('/')
    .get(mockMiddleware('GET desde /customers'))
    .post(validateCustomer, createCustomerController)

customerRouter.route('/login')
    .post(loginCustomerController)

customerRouter.route('/me')
    .get(verifyCustomerJwt, getLoggedCustomerController)

customerRouter.route('/auth-chpass')
    .post(verifyCustomerJwt, changePasswordController)    

customerRouter.route('/:id')
    .get(mockMiddleware('GET ONE desde /customers'))    
    .delete(mockMiddleware('DELETE desde /customers'))    
    .patch(mockMiddleware('PATCH desde /customers'))    

export {customerRouter};