import { Router } from 'express';

const router = Router();

import {
  testController,
} from '../controllers/test.controller';

router.get('/', testController);

export default router;
