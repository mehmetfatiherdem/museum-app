import express from 'express';
const router = express.Router();
import addProviderToUser from '../migrations/add_provider_to_user';

router.get('/add_provider_to_user', addProviderToUser);

export default router;
