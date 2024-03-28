import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const gameSchema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    membershipRequiredId: Joi.string().required(),
});

export const validateCreateGame = createValidationMiddleware(gameSchema);