import { Db, Collection, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer';
import dotenv from 'dotenv';
import { AuthService } from '../utils/interfaces/auth.interface';
import dbConnection from '../configs/database/mongo.conn';

dotenv.config();

//Create new customer service
export const createCustomerService = async (customer: Customer): Promise<ObjectId | null> => {
    try {
        const db: Db = await dbConnection(); 

        const result = await db.collection<Customer>('customers').insertOne(customer);
        return result.insertedId ? new ObjectId(result.insertedId) : null;
    } catch (error) {
        console.error('Error creating customer: ', error);
        return null;
    }
}

//Service that checks if an email exist in database
export const checkExistingEmailService = async (email: string): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();
        const customers: Collection<Customer> = db.collection<Customer>('customers');

        const existingCustomer = await customers.findOne({ email });
        return !!existingCustomer; // Devuelve true si el cliente existe, false si no
    } catch (error) {
        console.error('Error checking existing email:', error);
        return true; // Devuelve true para manejar el caso de error
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
            user: customer.name + ' ' + customer.lastname,
            email: customer.email,
            role: 'customer', 
        },
            tokenSecret,
            { expiresIn: '2d' });
        return token;
    };

    return { login };
};