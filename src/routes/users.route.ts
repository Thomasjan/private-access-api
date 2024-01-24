import { Router } from 'express';

const router = Router();

import { getUsers, getUser, addUser, updatePassword, updateUser } from '../controllers/users.controller';

router.get('/getUsers', getUsers);
router.get('/getUser/:id', getUser);
router.post('/adduser', addUser);
router.put('/updateUser/:id', updateUser);

router.put('/updatePassword/:id', updatePassword);

export default router;
