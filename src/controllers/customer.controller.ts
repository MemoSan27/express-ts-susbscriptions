import { Request, Response } from 'express';
import { checkExistingEmailService, createCustomerService, loginCustomerService } from '../services/customer.service';
import { Customer } from '../models/Customer';
import bcrypt from 'bcrypt'
import dbConnection from '../configs/database/mongo.conn';
import { AuthService } from '../utils/interfaces/auth.interface';
import { AuthenticatedCustomerRequest } from '../middlewares/jwt/verifyCustomerJwt';

//Create new customer controller
export const createCustomerController = async (req: Request, res: Response) => {
    try {
        const customer: Customer = req.body;

        const emailExists = await checkExistingEmailService(customer.email);
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(customer.password, 10);
        customer.password = hashedPassword;

        const customerId = await createCustomerService(customer);

        if (customerId) {
            const response = {
                message: 'Customer created successfully',
                customer: {
                    _id: customerId,
                    ...customer
                }
            };
            res.status(201).json(response);
        } else {
            res.status(500).json({ message: 'Failed to create customer' });
        }
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Get logged customer controller
export const getLoggedCustomerController = async(req: AuthenticatedCustomerRequest, res: Response) => {
    const user = req.user;
    return res.json(user)
  }

//Login customer controller
export const loginCustomerController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const db = await dbConnection();
  
      const authService: AuthService = loginCustomerService(db);
  
      const token = await authService.login(email, password);
  
      if (!token) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error in login process: ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };