import express from 'express';
import { importCSV } from '../controllers/CSVImport';
import isAdmin from '../middlewares/auth/isAdmin';
const router = express.Router();

router.post('/import', isAdmin, importCSV);

export default router;
