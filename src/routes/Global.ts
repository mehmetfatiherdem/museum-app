import express from 'express';
import { getMuseums, getMuseum } from '../controllers/Global';
const router = express.Router();

router.get('/museums', getMuseums);
router.get('/museum', getMuseum);

export default router;
