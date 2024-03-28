import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const adminSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const validateCreateAdmin = createValidationMiddleware(adminSchema);