import express from 'express';
import {
  signUp,
  signIn,
  signOut,
  favMuseum,
  removeFavMuseum,
  addComment,
  removeComment,
  getFavMuseums,
} from '../controllers/User';
import isLoggedIn from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.post('/favorite', isLoggedIn, favMuseum);
router.post('/remove-favorite', isLoggedIn, removeFavMuseum);
router.get('/fav-museums', isLoggedIn, getFavMuseums);
router.post('/add-comment', isLoggedIn, addComment);
router.delete('/remove-comment', isLoggedIn, removeComment);

export default router;
