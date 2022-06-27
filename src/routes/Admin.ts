import express from 'express';
import { loginAdmin } from '../controllers/Admin';
const router = express.Router();

router.post('/login', loginAdmin);

export default router