import express from 'express';
import isAdmin from '../middlewares/auth/isAdmin';
const router = express.Router();
import addProviderToUser from '../migrations/add_provider_to_user';

router.get('/add_provider_to_user', isAdmin, addProviderToUser);

export default router;
