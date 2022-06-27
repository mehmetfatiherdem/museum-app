import express from 'express';
const router = express.Router();
import adminRoutes from './Admin';

router.use('/admin', adminRoutes);

export default router;
