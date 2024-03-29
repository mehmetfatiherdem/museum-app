import express from 'express';
const router = express.Router();
import adminRoutes from './Admin';
import userRoutes from './User';
import csvRoutes from './CSVImport';
import museumRoutes from './Museum';
import commentRoutes from './Comment';
import authRoutes from './Auth';
import migrationRoutes from './Migration';

router.use('/admins', adminRoutes);
router.use('/users', userRoutes);
router.use('/csv', csvRoutes);
router.use('/museums', museumRoutes);
router.use('/comments', commentRoutes);
router.use('/auth', authRoutes);
router.use('/migrations', migrationRoutes);

export default router;
