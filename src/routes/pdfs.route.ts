import { Router } from 'express';

const router = Router();

import { getSupportsPdfs, editSupportPdf, addSupportPdf, deleteSupportPdf } from '../controllers/pdfs.controller';

router.get('/getSupportsPdfs', getSupportsPdfs);
router.put('/editSupportPdf/:id', editSupportPdf);
router.post('/addSupportPdf', addSupportPdf);
router.delete('/deleteSupportPdf/:id', deleteSupportPdf);


export default router;
