import { Router, Request, Response } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';
import { createMembershipController } from '../controllers/membership.controller';


const memebershipRouter: Router = Router();

memebershipRouter.route('/')
    .get(mockMiddleware('GET desde /memberships'))
    .post(createMembershipController)

memebershipRouter.route('/:id')
    .get(mockMiddleware('GET ONE desde /memberships'))
    .delete(mockMiddleware('DELETE desde /memberships'))
    .patch(mockMiddleware('PATCH desde /memberships'))

export {memebershipRouter};