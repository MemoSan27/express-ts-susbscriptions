import { Db, Collection, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer';
import dotenv from 'dotenv';
import { AuthService } from '../utils/interfaces/auth.interface';
import cache from '../middlewares/cache/nodeCacheInstance';
import { changePasswordRepository, 
    checkExistingCustomerEmailRepository, 
    createCustomerRepository, 
    deleteCustomerByIdRepository, 
    getAllCustomersRepository, 
    getCustomerByIdRepository, 
    updateNameAndLastnameRepository } from '../repositories/customer.repository';
import { PaginationOptions, SortOptions } from '../utils/interfaces/repositories/optionsRepository';

dotenv.config();

// Get all customers service
export const getAllCustomersService = async(
    paginationOptions: PaginationOptions,
    sortOptions: SortOptions
): Promise<Customer[] | null> => {
    try {
        const cacheKey = JSON.stringify({ paginationOptions, sortOptions });
        const cachedCustomers = cache.get<Customer[]>(cacheKey);

        if (cachedCustomers) {
            console.log('Cache hit for all customers!');
            return cachedCustomers;
        }

        const customers = await getAllCustomersRepository(paginationOptions, sortOptions);
        if (customers !== null) {
            cache.set(cacheKey, customers, 300);
        }
        
        return customers;
    } catch (error) {
        console.error('Error getting customers: ', error);
        return null;
    }
};

export const createCustomerService = async (
    customer: Customer
    ): Promise<ObjectId | null> => {
    try {
        const result = await createCustomerRepository(customer);
        if (result !== null) {
            cache.del('allCustomers');
        }
        return result;
    } catch (error) {
        console.error('Error creating customer: ', error);
        return null;
    }
};

export const getCustomerByIdService = async(
    customerId: string
    ): Promise<Customer | null> => {
    try {
        return await getCustomerByIdRepository(customerId);
    } catch (error) {
        console.error('Error getting customer by ID: ', error);
        return null;
    }
};

export const checkExistingCustomerEmailService = async(
    email: string
    ): Promise<boolean> => {
    try {
        return await checkExistingCustomerEmailRepository(email);
    } catch (error) {
        console.error('Error checking existing email:', error);
        return true;
    }
};

export const deleteCustomerByIdService = async(
    customerId: string
    ): Promise<boolean> => {
    try {
        const result = await deleteCustomerByIdRepository(customerId);
        if (result) {
            cache.del('allCustomers');
        }
        return result;
    } catch (error) {
        console.error('Error deleting customer:', error);
        return false;
    }
};

export const updateNameAndLastnameService = async (
    userId: string, 
    name: string, 
    lastname: string
): Promise<boolean> => {
    try {
        const result = await updateNameAndLastnameRepository(userId, name, lastname);

        if (result) {
            cache.del('allCustomers');
        }

        return result;
    } catch (error) {
        console.error('Error updating name and lastname: ', error);
        return false;
    }
};

export const changePasswordService = async (
    userId: ObjectId, 
    oldPassword: string, 
    newPassword: string
): Promise<boolean> => {
    try {
        return await changePasswordRepository(userId, oldPassword, newPassword);
    } catch (error) {
        console.error('Error in process: ', error);
        throw error;
    }
};

export const loginCustomerService = (db: Db): AuthService => {
    const customers: Collection<Customer> = db.collection<Customer>('customers');

    const login: AuthService['login'] = async (email, password) => {
        const customer = await customers.findOne({ email });

        if (!customer) {
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, customer.password);

        if (!passwordMatch) {
            return null;
        }

        const tokenSecret = process.env.TOKEN_SECRET!;

        const token = jwt.sign({
            userId: customer._id,
            user: customer.name + ' ' + customer.lastname,
            role: 'customer', 
        },
            tokenSecret,
            { expiresIn: '2d' });
        return token;
    };

    return { login };
};