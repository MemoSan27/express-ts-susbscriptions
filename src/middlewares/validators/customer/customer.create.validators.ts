import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const customerSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    membershipId: Joi.string().required(),
});

export const validateCustomer = createValidationMiddleware(customerSchema);