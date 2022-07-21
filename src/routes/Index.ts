import express from 'express';
const router = express.Router();
import adminRoutes from './Admin';
import userRoutes from './User';
import csvRoutes from './CSVImport';
import globalRoutes from './Global';

router.use('/admins', adminRoutes);
router.use('/users', userRoutes);
router.use('/csv', csvRoutes);
router.use('/global', globalRoutes);

export default router;
