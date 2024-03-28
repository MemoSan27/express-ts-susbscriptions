import { Request, Response, NextFunction } from 'express';
import cache from './nodeCacheInstance'; 

export const cacheMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
        
    const key = req.originalUrl;
    const cachedData = cache.get<any>(key);

    if (cachedData) {
        console.log('Cache hit!');
        res.json(cachedData);
        return;
    }
    next();
};