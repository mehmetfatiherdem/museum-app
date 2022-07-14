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

router.get('/', getMuseums);
router.post('/add-favorite', isLoggedIn, favMuseum);
router.post('/remove-favorite', isLoggedIn, removeFavMuseum);
router.get('/fav-museums', isLoggedIn, getFavMuseums);
router.get('/filter', filterMuseumsByCity);
router.get('/:id', getMuseum);

export default router;
