import express from 'express';
import {
  getMuseums,
  getMuseum,
  filterMuseumsByCity,
  favMuseum,
  removeFavMuseum,
  getFavMuseums,
} from '../controllers/Museum';
import isLoggedIn from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.get('/museums', getMuseums);
router.post('/favorite', isLoggedIn, favMuseum);
router.post('/remove-favorite', isLoggedIn, removeFavMuseum);
router.get('/fav-museums', isLoggedIn, getFavMuseums);
router.get('/museums/:city', filterMuseumsByCity);
router.get('/museum/:id', getMuseum);

export default router;
