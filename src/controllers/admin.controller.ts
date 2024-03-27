import { Request, Response } from 'express';
import { changePasswordService, 
    checkExistingAdminEmailService, 
    createAdminService, 
    deleteAdminByIdService, 
    getAllAdminsService, 
    getAdminByIdService, 
    loginAdminService, 
    updateNameAndLastnameService } from '../services/admin.service';
import dbConnection from '../configs/database/mongo.conn';
import { AuthenticatedRequest } from '../middlewares/jwt/verifyAdminJwt';
import { AuthService } from '../utils/interfaces/auth.interface';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt'
import { Administ } from '../models/Admin';


// Get all admins controller
export const getAllAdminsController = async(
    req: AuthenticatedRequest, 
    res: Response
    ): Promise<void> => {
  try {
      const admins = await getAllAdminsService();
      
      if (admins !== null) {
          const response = admins.map(admin => ({
              _id: admin._id,
              name: admin.name,
              email: admin.email
          }));
          res.status(200).json(response); 
      } else {
          res.status(500).json({ message: 'Error getting admins' }); 
      }
  } catch (error) {
      console.error('Error getting admins: ', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

// Create new admin controller
export const createAdminController = async (
    req: Request,
    res: Response
  ) => {
    try {
      const admin: Administ = req.body;
  
      const emailExists = await checkExistingAdminEmailService(admin.email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const adminId = await createAdminService(admin);
  
      if (adminId) {
        // Eliminar la contraseña del admin antes de enviar la respuesta
        const { password, ...adminWithoutPassword } = admin;
  
        const response = {
          message: 'Admin created successfully',
          admin: {
            ...adminWithoutPassword
          }
        };
  
        res.status(201).json(response);
      } else {
        res.status(500).json({ message: 'Failed to create admin' });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Get an admin info by id
export const getAdminByIdController = async(
    req: AuthenticatedRequest, 
    res: Response
    ): Promise<void> => {
  try {
      const adminId: string = req.params.id;
      const admin = await getAdminByIdService(adminId);

      if (admin) {
          const sanitizedAdmin = {
              _id: admin._id,
              name: admin.name,
              email: admin.email
          };
          res.status(200).json(sanitizedAdmin);
      } else {
          res.status(404).json({ message: 'Admin not found' });
      }
  } catch (error) {
      console.error('Error getting the admin: ', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

// Delete an admin by ID
export const deleteAdminByIdController = async(
    req: AuthenticatedRequest, 
    res: Response
    ): Promise<void> => {
  try {
      const adminId: string = req.params.id;

      const deleted = await deleteAdminByIdService(adminId);

      if (deleted) {
          res.status(200).json({ message: 'Admin deleted successfully' });
      } else {
          res.status(404).json({ message: 'Admin not found or not deleted' });
      }
  } catch (error) {
      console.error('Error deleting admin:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

// Update an admin's name and lastname
export const updateNameAndLastnameController = async(
    req: Request, 
    res: Response, 
    ): Promise<void> => {
  const userId = req.params.id; 
  const { name } = req.body;
      
  try {
      const success: boolean = await updateNameAndLastnameService(userId, name); 
      
      if (success) {
          res.status(200).json({ message: 'Name updated successfully' });
      } else {
          res.status(500).json({ message: 'Admin not found' });
      }
  } catch (error) {
      console.error('Error updating name: ', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


// Change authenticated admin's password
export const changePasswordController = async(
    req: AuthenticatedRequest, 
    res: Response
    ) => {
  const userId = new ObjectId(req.userId); 
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
      return res.status(500).json({ message: 'Internal server error' });
  }
};

//Get logged administrator controller
export const getLoggedAdminController = async(
    req: AuthenticatedRequest, 
    res: Response
    ) => {
  const user = req.user;
  return res.json(user)
}

//Login administrator controller
export const loginAdminController = async(
    req: Request, 
    res: Response
    ) => {
  const { email, password } = req.body;

  try {
    const db = await dbConnection();

    const authService: AuthService = loginAdminService(db);

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