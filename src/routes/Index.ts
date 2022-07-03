import express from 'express';
const router = express.Router();
import adminRoutes from './Admin';
import userRoutes from './User';
import csvRoutes from './CSVImport';

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/csv', csvRoutes);

export default router;
