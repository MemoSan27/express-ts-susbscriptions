import { Router, Request, Response } from 'express';

const homeRouter: Router = Router();

homeRouter.route('/')
    .get((req: Request, res: Response): void => {
        res.send('Welcome to subscriptions system!');
});

export { homeRouter };