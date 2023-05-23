import { Router } from 'express';

const router = Router();

import { getUsers, getUser } from '../controllers/users.controller';

router.get('/getUsers', getUsers);
router.get('/getUser/:id', getUser);

export default router;
