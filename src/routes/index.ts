import { Router } from 'express';
import { homeRouter } from './home.routes';
import { customerRouter } from './customer.routes';
import { downloadRouter } from './download.routes';
import { gameRouter } from './game.routes';
import { memebershipRouter } from './membership.routes';

const router: Router = Router();

router.use('/', homeRouter);
router.use('/v1/customers', customerRouter);
router.use('/v1/downloads', downloadRouter);
router.use('/v1/games', gameRouter);
router.use('/v1/memberships', memebershipRouter);

export { router };