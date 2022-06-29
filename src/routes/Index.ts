import express from 'express';
const router = express.Router();
import adminRoutes from './Admin';
import userRoutes from './User';

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);

export default router;
