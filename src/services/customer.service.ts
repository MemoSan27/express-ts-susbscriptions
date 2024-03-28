import { Db, Collection, ObjectId, Filter } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer';
import dotenv from 'dotenv';
import { AuthService } from '../utils/interfaces/auth.interface';
import dbConnection from '../configs/database/mongo.conn';
import { Membership } from '../models/Membership';
import cache from '../middlewares/cache/nodeCacheInstance';
import { createCustomerRepository, getAllCustomersRepository } from '../repositories/customer.repository';
import { PaginationOptions, SortOptions } from '../utils/interfaces/repositories/optionsRepository';

dotenv.config();

// Get all customers service
export const getAllCustomersService = async (
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

//Create new customer service
export const createCustomerService = async (customer: Customer): Promise<ObjectId | null> => {
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

//Get a single membership by id service
export const getCustomerByIdService = async(
    customerId: string
    ): Promise<Customer | null> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(customerId)) {
            throw new Error('Invalid customer ID');
        }

        const filter = { _id: new ObjectId(customerId) };
        const customer = await db.collection<Customer>('customers').findOne(filter);

        return customer; 
    } catch (error) {
        console.error('Error getting customer by ID: ', error);
        return null;
    }
}

//Service that checks if an email exist in database
export const checkExistingCustomerEmailService = async(
    email: string
    ): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();
        const customers: Collection<Customer> = db.collection<Customer>('customers');
        const existingCustomer = await customers.findOne({ email });

        return !!existingCustomer; 
    } catch (error) {
        console.error('Error checking existing email:', error);
        return true; 
    }
};

//Delete a customer by ID by an authorized admin
export const deleteCustomerByIdService = async(
    customerId: string
    ): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();

        if (!ObjectId.isValid(customerId)) {
            throw new Error('Invalid customer ID');
        }

        const filter = { _id: new ObjectId(customerId) };
        const result = await db.collection<Customer>('customers').deleteOne(filter);

        if (result.deletedCount === 1) {
            cache.del('allCustomers');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        return false;
    }
}

//Update just name or lastname service with administrator assitance
export const updateNameAndLastnameService = async(
    userId: string, 
    name: string, 
    lastname: string
    ): Promise<boolean> => {
    try {
        const db = await dbConnection();

        if (!ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }

        const filter: Filter<Customer> = { _id: new ObjectId(userId) }; 
       

        const result = await db.collection<Customer>('customers').updateOne(
            filter, 
            { $set: { name, lastname } });

        if (result.modifiedCount === 1) {
            cache.del('allCustomers');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error updating name and lastname: ', error);
        throw error;
    }
};

//Change authenticated customer password service
export const changePasswordService = async(
    userId: ObjectId, 
    oldPassword: string, 
    newPassword: string
    ): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();
        const customers = db.collection('customers');
        const user = await customers.findOne({ _id: userId });

        if (!user) {
            throw new Error('User not found');
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            return false;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await customers.updateOne({ _id: userId }, { $set: { password: hashedPassword } });

        return true;
    } catch (error) {
        console.error('Error in process: ', error);
        throw error;
    }
};

//Customer Login Service
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