import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const adminSchema = Joi.object({
    name: Joi.string().required(),
});

export const validateUpdateAdmin = createValidationMiddleware(adminSchema);