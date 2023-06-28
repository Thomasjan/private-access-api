import { Router } from 'express';

const router = Router();

import { getLinkedinPosts, refreshLinkedinToken } from '../controllers/linkedin.controller';

router.get('/getLinkedinPosts', getLinkedinPosts);
router.get('/refreshLinkedinToken', refreshLinkedinToken);

export default router;
