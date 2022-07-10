import express from 'express';
import {
  signUp,
  signIn,
  signOut,
  favMuseum,
  removeFavMuseum,
} from '../controllers/User';
import isLoggedIn from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.post('/favorite', isLoggedIn, favMuseum);
router.post('/remove-favorite', isLoggedIn, removeFavMuseum);

export default router;
