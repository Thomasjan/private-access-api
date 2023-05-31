import { Router } from 'express';

import TestRoute from './test.route';
import AuthRoute from './auth.route';
import UsersRoute from './users.route';
import EntreprisesRoute from './entreprises.route';
import RolesRoute from './roles.route';
import DownloadsRoute from './downloads.route';

const router = Router();

router.use('/test', TestRoute);
router.use('/auth', AuthRoute);
router.use('/users', UsersRoute);
router.use('/entreprises', EntreprisesRoute);
router.use('/roles', RolesRoute);
router.use('/downloads', DownloadsRoute);

export default router;
