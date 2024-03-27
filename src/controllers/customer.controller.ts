import { NextFunction, Request, Response } from 'express';
import { changePasswordService, checkExistingEmailService, createCustomerService, getAllCustomersService, loginCustomerService, updateNameAndLastnameService } from '../services/customer.service';
import { Customer } from '../models/Customer';
import bcrypt from 'bcrypt'
import dbConnection from '../configs/database/mongo.conn';
import { AuthService } from '../utils/interfaces/auth.interface';
import { AuthenticatedCustomerRequest } from '../middlewares/jwt/verifyCustomerJwt';
import { ObjectId } from 'mongodb';
import { AuthenticatedRequest } from '../middlewares/jwt/verifyAdminJwt';


// Get all customers controller just by authenticated admin
export const getAllCustomersController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const authenticatedReq = req as AuthenticatedRequest; 
        if (authenticatedReq.role !== 'admin') {
            res.status(403).json({ message: 'Only administrators are authorized to access this service' });
            return;
        }

        const customers = await getAllCustomersService();
        
        if (customers !== null) {
            const response = customers.map(customer => ({
                _id: customer._id,
                name: customer.name,
                lastname: customer.lastname,
                email: customer.email
            }));
            res.status(200).json(response); 
        } else {
            res.status(500).json({ message: 'Error getting games' }); 
        }
    } catch (error) {
        console.error('Error getting games: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

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

      const { password, ...customerWithoutPassword } = customer;

      if (customerId) {
          const response = {
              message: 'Customer created successfully',
              customer: {
                  ...customerWithoutPassword
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

export const updateNameAndLastnameController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id; 
    const { name, lastname } = req.body;
        
    try {
        if (!((req as AuthenticatedRequest).role === 'admin')) { 
            res.status(403).json({ message: 'Only administrators are authorized to update name and lastname' });
            return; 
        }

        const success: boolean = await updateNameAndLastnameService(userId, name, lastname); 
        
        if (success) {
            res.status(200).json({ message: 'Name and lastname updated successfully' });
        } else {
            res.status(500).json({ message: 'Failed to update name and lastname' });
        }
    } catch (error) {
        console.error('Error updating name and lastname: ', error);
        res.status(500).json({ message: 'Internal server errorrrr' });
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


//Change authenticated customer password controller
export const changePasswordController = async (req: AuthenticatedCustomerRequest, res: Response) => {
  const userId = new ObjectId(req.userId); // Transformar userId a ObjectId
  const { oldPassword, newPassword } = req.body;

  try {
      const success = await changePasswordService(userId, oldPassword, newPassword);

      if (success) {
          return res.status(200).json({ message: 'Password changed success.' });
      } else {
          return res.status(400).json({ message: 'Invalid current password.' });
      }
  } catch (error) {
      console.error('Error in process: :', error);
      return res.status(500).json({ message: 'Internal server error'  });
  }
};