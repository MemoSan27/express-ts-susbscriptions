import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const adminSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const validateLoginAdmin = createValidationMiddleware(adminSchema);