import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const customerSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

export const validateChPassCustomer = createValidationMiddleware(customerSchema);