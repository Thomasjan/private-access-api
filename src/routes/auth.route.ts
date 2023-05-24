import { Router } from 'express';

const router = Router();

import { login, getLogins } from '../controllers/auth.controller';

router.get('/getLogins', getLogins);
router.post('/login', login);

export default router;
