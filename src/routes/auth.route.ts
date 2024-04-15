import { Router } from 'express';

const router = Router();

import { login, getLogins, forgotPassword, resetPassword, resetLogins } from '../controllers/auth.controller';

router.get('/getLogins', getLogins);
router.get('/resetLogins', resetLogins);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.get('/resetPassword/:email', resetPassword);

export default router;
