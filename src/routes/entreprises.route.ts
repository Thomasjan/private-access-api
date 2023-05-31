import { Router } from 'express';

const router = Router();

import { addEntreprise, getEntreprises, updateEntreprise, deleteEntreprise } from '../controllers/entreprises.controller';

router.get('/getEntreprises', getEntreprises);
// router.get('/getEntreprise/:id', getEntreprise);
router.post('/addEntreprise', addEntreprise);
router.put('/updateEntreprise/:id', updateEntreprise);
router.delete('/deleteEntreprise/:id', deleteEntreprise);

export default router;
