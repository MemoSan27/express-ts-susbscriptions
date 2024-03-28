import { Db } from "mongodb";
import dbConnection from "../configs/database/mongo.conn";
import { Customer } from "../models/Customer";
import { PaginationOptions, SearchOptions, SortOptions } from "../utils/interfaces/repositories/optionsRepository";


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