import express from 'express';
import {
  signUp,
  signIn,
  signOut,
  getUsers,
  getUser,
} from '../controllers/User';
const router = express.Router();

router.get('/', getUsers);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.get('/:id', getUser);

export default router;
