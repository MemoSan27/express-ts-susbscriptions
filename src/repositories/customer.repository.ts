import { Db, ObjectId } from "mongodb";
import dbConnection from "../configs/database/mongo.conn";
import { Customer } from "../models/Customer";
import { PaginationOptions, SearchOptions, SortOptions } from "../utils/interfaces/repositories/optionsRepository";
import bcrypt from 'bcrypt'
import { Membership } from "../models/Membership";


export const getAllCustomersRepository = async (
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

export const createCustomerRepository = async (customer: Customer): Promise<ObjectId | null> => {
  try {
      const db: Db = await dbConnection(); 
      const membershipsCollection = db.collection<Membership>('memberships');

      const filter = { _id: new ObjectId(customer.membershipId) };
      const existingMembership = await membershipsCollection.findOne(filter);
      if (!existingMembership) {
          throw new Error(`Membership with id: ${customer.membershipId} does not exist.`);
      }

      // Hashing the password before storing it
      const hashedPassword = await bcrypt.hash(customer.password, 10);
      const customerToInsert = { ...customer, password: hashedPassword };

      const result = await db.collection<Customer>('customers').insertOne(customerToInsert);

      return result.insertedId ? new ObjectId(result.insertedId) : null;
  } catch (error) {
      console.error('Error creating customer: ', error);
      return null;
  }
};