import { Router } from 'express';

const router = Router();

import { addEntreprise, getEntreprises } from '../controllers/entreprises.controller';

router.get('/getEntreprises', getEntreprises);
// router.get('/getEntreprise/:id', getEntreprise);
router.post('/addEntreprise', addEntreprise);

export default router;
