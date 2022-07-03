import express from 'express';
import { importCSV } from '../controllers/CSVImport';
const router = express.Router();

router.get('/import', importCSV);

export default router;
