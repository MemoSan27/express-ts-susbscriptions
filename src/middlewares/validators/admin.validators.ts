import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationResult } from 'joi';

const customerSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export const validateAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const result: ValidationResult = 
    customerSchema.validate(
        req.body,
        { abortEarly: false }
    );

    if (result.error) {
        return res.status(422).json({
            message: 'Invalid request data',
            errors: result.error.details.map(err => err.message),
        });
    }

    next();
};