import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationResult } from 'joi';

const gameSchema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    membershipRequiredId: Joi.string().required(),
});

export const validateGame = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const result: ValidationResult = 
    gameSchema.validate(
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
