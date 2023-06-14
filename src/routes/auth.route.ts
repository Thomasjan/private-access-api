import { Router } from 'express';

const router = Router();

import { login, getLogins, forgotPassword } from '../controllers/auth.controller';

router.get('/getLogins', getLogins);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);

export default router;
