import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationResult } from 'joi';

const membershipSchema = Joi.object({
    _id: Joi.string(),
    type: Joi.string().required(),
    price: Joi.number().required(),
});

export const validateMembership = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

    const result: ValidationResult =
    membershipSchema.validate(
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
}


