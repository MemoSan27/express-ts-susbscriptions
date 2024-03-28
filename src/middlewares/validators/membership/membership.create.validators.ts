import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const membershipSchema = Joi.object({
    _id: Joi.string(),
    type: Joi.string().required(),
    price: Joi.number().required(),
});

export const validateMembership = createValidationMiddleware(membershipSchema);

