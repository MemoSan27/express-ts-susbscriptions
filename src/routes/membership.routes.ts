import { Router } from 'express';
import { mockMiddleware } from '../utils/mocks/middlewares/mockMiddleware';
import { createMembershipController, deleteMembershipByIdController, getAllMembershipsController, getMembershipByIdController, updateMembershipController } from '../controllers/membership.controller';
import { validateMembership } from '../middlewares/validators/membership.validators';
import verifyAdminJwt from '../middlewares/jwt/verifyAdminJwt';


const memebershipRouter: Router = Router();

memebershipRouter.route('/')
    .get(getAllMembershipsController)
    .post(validateMembership, verifyAdminJwt, createMembershipController)

memebershipRouter.route('/:id')
    .get(getMembershipByIdController)
    .delete(verifyAdminJwt, deleteMembershipByIdController)
    .patch(validateMembership, verifyAdminJwt, updateMembershipController)

export {memebershipRouter};