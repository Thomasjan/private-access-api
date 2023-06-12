import { Router } from 'express';

const router = Router();

import { getSupportsPdfs, editSupportPdf, addSupportPdf } from '../controllers/pdfs.controller';

router.get('/getSupportsPdfs', getSupportsPdfs);
router.put('/editSupportPdf/:id', editSupportPdf);
router.post('/addSupportPdf', addSupportPdf);


export default router;
