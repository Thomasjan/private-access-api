import { Router } from 'express';
import multer from 'multer';
const upload = multer({ dest: 'src/database/uploads' });

const router = Router();

import { getUploads, addUpload  } from '../controllers/uploads.controller';

router.get('/getUploads', getUploads);
router.post('/addUpload',upload.fields([{name: 'file', maxCount: 1},{name: 'image', maxCount: 1} ]), addUpload);


export default router;
