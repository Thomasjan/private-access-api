import { Router } from 'express';

const router = Router();

import { getGestimumClients } from '../controllers/gestimum.controller';

router.get('/getGestimumClients', getGestimumClients);


export default router;
