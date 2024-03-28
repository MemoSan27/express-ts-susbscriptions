import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const adminSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
});

export const validateChPassAdmin = createValidationMiddleware(adminSchema);