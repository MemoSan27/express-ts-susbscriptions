import { Router } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';


const customerRouter: Router = Router();

customerRouter.route('/')
    .get(mockMiddleware('GET desde /customers'))
    .post(mockMiddleware('POST desde /customers'))

customerRouter.route('/login')
    .post(mockMiddleware('Login a la aplicacion'))

customerRouter.route('/me')
    .get(mockMiddleware('GET desde /customers/me'))

customerRouter.route('/:id')
    .get(mockMiddleware('GET ONE desde /customers'))    
    .delete(mockMiddleware('DELETE desde /customers'))    
    .patch(mockMiddleware('PATCH desde /customers'))    

export {customerRouter};