import { Router } from 'express';

import TestRoute from './test.route';

const router = Router();

router.use('/test', TestRoute);

export default router;
