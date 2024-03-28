import Joi from 'joi';
import { createValidationMiddleware } from '../validation.middleware';

const downloadSchema = Joi.object({
    idGame: Joi.string().required(),
});

export const validateCreateDownload = createValidationMiddleware(downloadSchema);