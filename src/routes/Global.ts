import express from 'express';
import {
  getMuseums,
  getMuseum,
  getMuseumComments,
  getComment,
  filterMuseumsByCity,
} from '../controllers/Global';
const router = express.Router();

router.get('/museums', getMuseums);
router.get('/museums/:city', filterMuseumsByCity);
router.get('/museum/:id', getMuseum);
router.get('/comment/:id', getComment);
router.get('/museum/:museumId/comments', getMuseumComments);

export default router;
