import { Router } from 'express';

const router = Router();

import { getUsers } from '../controllers/users.controller';

router.get('/getUsers', getUsers);

export default router;
