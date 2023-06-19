import { Router } from 'express';

const router = Router();

import { getSupportsPdfs, editPdf, addPdf, deletePdf, getAideVentePdfs, getFormationPdfs } from '../controllers/pdfs.controller';

router.get('/getSupportsPdfs', getSupportsPdfs);
router.get('/getAideVentePdfs', getAideVentePdfs);
router.get('/getFormationPdfs', getFormationPdfs);

router.put('/editPdf/:id', editPdf);
router.post('/addPdf', addPdf);
router.delete('/deletePdf/:id', deletePdf);




export default router;
