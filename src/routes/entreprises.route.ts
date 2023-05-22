import { Router } from 'express';

const router = Router();

import { addEntreprise, getEntreprises } from '../controllers/entreprises.controller';

router.get('/getEntreprises', getEntreprises);
router.get('/addEntreprise', addEntreprise);

export default router;
