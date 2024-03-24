import { Request, Response } from 'express';
import { checkHealth } from '../services/health.service';

export const healthCheckHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const isHealthy = await checkHealth();
        if (isHealthy) {
            res.json({ status: 'ok' });
        } else {
            res.status(500).json({ error: 'Health check error' });
        }
    } catch (error) {
        console.error('Error on health check:', error);
        res.status(500).json({ error: 'Error on health check controller' });
    }
};