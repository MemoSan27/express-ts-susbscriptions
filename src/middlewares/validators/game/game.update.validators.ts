import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const gameSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
});

export const validateUpdateGame = createValidationMiddleware(gameSchema);