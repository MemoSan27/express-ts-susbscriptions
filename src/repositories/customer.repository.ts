import { Db, Filter, ObjectId } from "mongodb";
import dbConnection from "../configs/database/mongo.conn";
import { Customer } from "../models/Customer";
import { PaginationOptions, SortOptions } from "../utils/interfaces/repositories/optionsRepository";
import bcrypt from 'bcrypt'
import { Membership } from "../models/Membership";


export const getAllCustomersRepository = async(
  paginationOptions: PaginationOptions,
  sortOptions: SortOptions
): Promise<Customer[] | null> => {
  try {
      const db: Db = await dbConnection();
      const { page = 1, limit = 5 } = paginationOptions;
      const { sortBy = 'lastname', sortOrder = 1 } = sortOptions;

      const sortQuery: any = {};
      sortQuery[sortBy] = sortOrder;

      const customers = await db
          .collection<Customer>('customers')
          .find()
          .sort(sortQuery)
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray();

      return customers;
  } catch (error) {
      console.error('Error getting customers: ', error);
      return null;
  }
};

export const createCustomerRepository = async(
    customer: Customer
    ): Promise<ObjectId | null> => {
  try {
      const db: Db = await dbConnection(); 
      const membershipsCollection = db.collection<Membership>('memberships');

      const filter = { _id: new ObjectId(customer.membershipId) };
      const existingMembership = await membershipsCollection.findOne(filter);
      if (!existingMembership) {
          throw new Error(`Membership with id: ${customer.membershipId} does not exist.`);
      }

      const hashedPassword = await bcrypt.hash(customer.password, 10);
      const customerToInsert = { ...customer, password: hashedPassword };

      const result = await db.collection<Customer>('customers').insertOne(customerToInsert);

      return result.insertedId ? new ObjectId(result.insertedId) : null;
  } catch (error) {
      console.error('Error creating customer: ', error);
      return null;
  }
};

export const getCustomerByIdRepository = async(
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
};

export const checkExistingCustomerEmailRepository = async(
    email: string
    ): Promise<boolean> => {
  try {
      const db: Db = await dbConnection();
      const customers = db.collection<Customer>('customers');
      const existingCustomer = await customers.findOne({ email });

      return !!existingCustomer;
  } catch (error) {
      console.error('Error checking existing email:', error);
      return true; 
  }
};

export const deleteCustomerByIdRepository = async(
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
          return true;
      } else {
          return false;
      }
  } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
  }
};

export const updateNameAndLastnameRepository = async(
  userId: string, 
  name: string, 
  lastname: string
): Promise<boolean> => {
  try {
      const db: Db = await dbConnection();

      if (!ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID');
      }

      const filter: Filter<Customer> = { _id: new ObjectId(userId) }; 

      const result = await db.collection<Customer>('customers').updateOne(
          filter, 
          { $set: { name, lastname } });

      if (result.modifiedCount === 1) {
          return true;
      } else {
          return false;
      }
  } catch (error) {
      console.error('Error updating name and lastname: ', error);
      return false;
  }
};

export const changePasswordRepository = async(
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
      return false;
  }
};

export const searchCustomersByMembershipTypeRepository = async (membershipType: string): Promise<Customer[] | null> => {
    try {
        const db: Db = await dbConnection();

        const memberships = await db.collection('memberships').find({ type: membershipType }).toArray();

        const membershipIds = memberships.map(membership => membership._id.toString());

        const customers = await db.collection<Customer>('customers')
            .find({ membershipId: { $in: membershipIds } })
            .toArray();

        return customers;
    } catch (error) {
        console.error('Error searching customers by membership type: ', error);
        return null;
    }
};