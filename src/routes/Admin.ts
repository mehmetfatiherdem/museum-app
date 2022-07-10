import express from 'express';
import { loginAdmin, testAdminAuth } from '../controllers/Admin';
import isAdmin from '../middlewares/auth/isAdmin';
const router = express.Router();

router.post('/login', loginAdmin);
router.get('/test', isAdmin, testAdminAuth);

export default router;
