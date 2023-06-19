import { Router } from 'express';

const router = Router();

import { getLinkedinPosts } from '../controllers/linkedin.controller';

router.get('/getLinkedinPosts', getLinkedinPosts);

export default router;
