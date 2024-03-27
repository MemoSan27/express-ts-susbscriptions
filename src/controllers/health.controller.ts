import { Request, Response } from 'express';
import * as HealthService from '../services/health.service';
import colors from 'colors';

export const checkHealthController = async(
  req: Request, 
  res: Response
  ): Promise<void> => {
    try {
         const isDatabaseHealthy = await HealthService.checkDatabaseHealth();
        
        if (isDatabaseHealthy) {
            res.status(200).send('API is Healthy');
          } else {
            console.log(colors.bgRed.bold('API is NOT Healthy, please call an admin'));
            res.status(500).send('API is NOT Healthy, please call an admin');
          }
        } catch (error) {
          console.error('Health check failed:', error);
          res.status(500).send('Health check failed');
        }
  }