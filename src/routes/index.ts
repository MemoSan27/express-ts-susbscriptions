import { Router } from 'express';
import homeRouter from './home.routes';

const router = Router();

router.use('/', homeRouter);

export default router;