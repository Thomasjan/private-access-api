import { Router } from 'express';

const router = Router();

import { getDownloads, addDownload  } from '../controllers/downloads.controller';

router.get('/getDownloads', getDownloads);
router.post('/addDownload', addDownload);


export default router;
