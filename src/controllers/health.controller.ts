import { Request, Response } from 'express';
import * as HealthService from '../services/health.service';

export const checkHealthController = async (
  req: Request, 
  res: Response
): Promise<void> => {
  try {
    const isDatabaseHealthy = await HealthService.checkDatabaseHealth();
    const isCacheHealthy = await HealthService.checkCacheHealth();

    if (isDatabaseHealthy && isCacheHealthy) {
      res.status(200).send('API is Healthy');
    } else {
      console.log('API is NOT Healthy, please call an admin');
      res.status(500).send('API is NOT Healthy, please call an admin');
    }
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).send('Health check failed');
  }
};