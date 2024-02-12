import { Router } from 'express';

const router = Router();

import { getUsers, getUser, addUser, updatePassword, updateUser, deleteUser } from '../controllers/users.controller';

router.get('/getUsers', getUsers);
router.get('/getUser/:id', getUser);
router.post('/adduser', addUser);
router.put('/updateUser/:id', updateUser);

router.put('/updatePassword/:id', updatePassword);
router.delete('/deleteUser/:id', deleteUser);

export default router;
