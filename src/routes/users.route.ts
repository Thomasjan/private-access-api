import { Router } from 'express';

const router = Router();

import { getUsers, getUser, addUser, updatePassword } from '../controllers/users.controller';

router.get('/getUsers', getUsers);
router.get('/getUser/:id', getUser);
router.post('/adduser', addUser);

router.put('/updatePassword/:id', updatePassword);

export default router;
