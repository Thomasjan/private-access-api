import { Router } from 'express';

const router = Router();

import { getUsers, getUser, addUser } from '../controllers/users.controller';

router.get('/getUsers', getUsers);
router.get('/getUser/:id', getUser);
router.post('/adduser', addUser);

export default router;
