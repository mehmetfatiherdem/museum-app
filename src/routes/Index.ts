import express from 'express';
const router = express.Router();
import adminRoutes from './Admin';
import userRoutes from './User';
import csvRoutes from './CSVImport';
import museumRoutes from './Museum';
import commentRoutes from './Comment';

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/csv', csvRoutes);
router.use('/museum', museumRoutes);
router.use('/comment', commentRoutes);

export default router;
