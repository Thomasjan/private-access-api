import { Router } from 'express';

const router = Router();

import { getFormations, addFormation, editFormation, deleteFormation } from '../controllers/formations.controller';

router.get('/getFormations', getFormations);

router.post('/addFormation', addFormation);
router.put('/editFormation/:id', editFormation);
router.delete('/deleteFormation/:id', deleteFormation);





export default router;
