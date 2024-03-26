import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';
import { getLoggedAdminController, loginAdminController } from '../controllers/admin.controller';
import verifyAdminJwt from '../utils/jwt/verifyAdminJwt';


const adminRouter: Router = Router();

adminRouter.route('/')
    .get(mockMiddleware('GET desde /customers'))
    .post(mockMiddleware('POST desde /customers'))

adminRouter.route('/login')
    .post(loginAdminController)

adminRouter.route('/me')
    .get(verifyAdminJwt, getLoggedAdminController)

adminRouter.route('/:id')
    .get(mockMiddleware('GET ONE desde /customers'))    
    .delete(mockMiddleware('DELETE desde /customers'))    
    .patch(mockMiddleware('PATCH desde /customers'))    

export {adminRouter};