import { Router } from 'express';

const router = Router();

import { getGestimumClients, getGestimumContacts } from '../controllers/gestimum.controller';

router.get('/getGestimumClients/:query', getGestimumClients);
router.get('/getGestimumContacts/:code', getGestimumContacts);


export default router;
