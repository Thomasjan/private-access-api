import { Router } from 'express';

import TestRoute from './test.route';
import AuthRoute from './auth.route';
import UsersRoute from './users.route';
import EntreprisesRoute from './entreprises.route';
import RolesRoute from './roles.route';
import DownloadsRoute from './downloads.route';
import UploadsRoute from './uploads.route';
import Gestimum from './gestimum.route'

const router = Router();

router.use('/test', TestRoute);
router.use('/auth', AuthRoute);
router.use('/users', UsersRoute);
router.use('/entreprises', EntreprisesRoute);
router.use('/roles', RolesRoute);
router.use('/downloads', DownloadsRoute);
router.use('/uploads', UploadsRoute);
router.use('/gestimum', Gestimum);

export default router;
