import { Router } from 'express';

import TestRoute from './test.route';
import AuthRoute from './auth.route';
import UsersRoute from './users.route';
import EntreprisesRoute from './entreprises.route';
import RolesRoute from './roles.route';
import DownloadsRoute from './downloads.route';
import UploadsRoute from './uploads.route';
import Gestimum from './gestimum.route'
import PdfsRoute from './pdfs.route'
import ForamtionsRoute from './formations.route'
import LinkedinRoute from './linkedin.route'

const router = Router();

router.use('/test', TestRoute);
router.use('/auth', AuthRoute);
router.use('/users', UsersRoute);
router.use('/entreprises', EntreprisesRoute);
router.use('/roles', RolesRoute);
router.use('/downloads', DownloadsRoute);
router.use('/uploads', UploadsRoute);
router.use('/gestimum', Gestimum);
router.use('/pdfs', PdfsRoute);
router.use('/formations', ForamtionsRoute);
router.use('/linkedin', LinkedinRoute);

export default router;
