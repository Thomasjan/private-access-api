import { Router } from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = Router();

import { getUploads, addUpload  } from '../controllers/uploads.controller';

router.get('/getUploads', getUploads);
router.post('/addUpload',upload.single('file'), addUpload);


export default router;
