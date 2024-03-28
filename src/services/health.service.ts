import { Db } from 'mongodb';
import dbConnection from '../configs/database/mongo.conn';
import colors from 'colors';
import cache from '../middlewares/cache/nodeCacheInstance';

export const checkDatabaseHealth = async(): Promise<boolean> => {
    try {
        const db: Db = await dbConnection();

        await db.command({ ping: 1 });
        return true;
    } catch (error) {
        console.error(colors.bgRed.bold('Database connection error:'), error);
        return false;
    }
}

export const checkCacheHealth = async (): Promise<boolean> => {
    try {
      const cacheActive = cache.getStats().keys > 0;
  
      const startTime = Date.now();
      cache.keys();
      const responseTime = Date.now() - startTime;
      const acceptableResponseTime = 100; 
      const cacheResponseTimeAcceptable = responseTime <= acceptableResponseTime;
  
      return cacheActive && cacheResponseTimeAcceptable;
    } catch (error) {
      console.error('Cache health check failed:', error);
      return false;
    }
};