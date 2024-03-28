import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const customerSchema = Joi.object({
    name: Joi.string().required(),
    lastname: Joi.string().required(),
});

export const validateUpdateCustomer = createValidationMiddleware(customerSchema);