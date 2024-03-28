import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationResult, Schema } from 'joi';

export const createValidationMiddleware = (schema: Schema) => (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const result: ValidationResult = schema.validate(req.body, { abortEarly: false });

    if (result.error) {
        return res.status(422).json({
            message: 'Invalid request data',
            errors: result.error.details.map(err => err.message),
        });
    }

    next();
};