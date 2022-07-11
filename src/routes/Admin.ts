import express from 'express';
import { loginAdmin } from '../controllers/Admin';
import { signOut } from '../controllers/User';
const router = express.Router();

router.post('/login', loginAdmin);
router.get('/signout', signOut);

export default router;
