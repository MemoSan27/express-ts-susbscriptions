import { Db } from "mongodb";
import dbConnection from "../configs/database/mongo.conn";
import { Customer } from "../models/Customer";
import { PaginationOptions, SearchOptions, SortOptions } from "../utils/interfaces/repositories/optionsRepository";


export const getAllCustomersRepository = async (
    paginationOptions: PaginationOptions = { page: 1, limit: 10 },
    sortOptions: SortOptions = { sortBy: '_id', sortOrder: 1 },
    searchOptions: SearchOptions = {}
  ): Promise<Customer[] | null> => {
    try {
      const db: Db = await dbConnection();
      const { page = 1, limit = 10 } = paginationOptions;
      const { sortBy = '_id', sortOrder = 1 } = sortOptions;
      const { query = '' } = searchOptions;
  
      // Construye el objeto de ordenamiento correctamente
      const sortQuery: any = {};
      sortQuery[sortBy] = sortOrder;
  
      const customers = await db
        .collection<Customer>('customers')
        .find({ name: new RegExp(query, 'i') }) // Case-insensitive search by name
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