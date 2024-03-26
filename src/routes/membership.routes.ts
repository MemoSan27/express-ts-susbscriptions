import { Router } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';
import { createMembershipController, getAllMembershipsController, updateMembershipController } from '../controllers/membership.controller';
import { validateMembership } from '../middlewares/validators/membership.validators';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';


const memebershipRouter: Router = Router();

memebershipRouter.route('/')
    .get(getAllMembershipsController)
    .post(validateMembership, verifyAdminJwt, createMembershipController)

memebershipRouter.route('/:id')
    .get(mockMiddleware('GET ONE desde /memberships'))
    .delete(mockMiddleware('DELETE desde /memberships'))
    .patch(validateMembership, verifyAdminJwt, updateMembershipController)

export {memebershipRouter};