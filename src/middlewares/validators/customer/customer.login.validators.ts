import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const customerSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const validateLoginCustomer = createValidationMiddleware(customerSchema);