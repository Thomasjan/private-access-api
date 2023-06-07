import { Router } from 'express';

const router = Router();

import { getGestimumUsers } from '../controllers/gestimum.controller';

router.get('/getGestimumUsers', getGestimumUsers);


export default router;
