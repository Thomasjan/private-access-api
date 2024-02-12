import { Router } from 'express';

const router = Router();

import { getGestimumClients } from '../controllers/gestimum.controller';

router.get('/getGestimumClients/:query', getGestimumClients);


export default router;
