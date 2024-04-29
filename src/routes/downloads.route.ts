import { Router } from 'express';
const router = Router();

import { getDownloads, addDownload, resetDownloads  } from '../controllers/downloads.controller';

router.get('/getDownloads', getDownloads);
router.get('/reset', resetDownloads);
router.post('/addDownload', addDownload);



export default router;
