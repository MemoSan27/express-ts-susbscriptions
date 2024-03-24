import { Request, Response } from 'express';

export const mockController = (req: Request, res: Response, description: string) => {
    res.send(description);
};