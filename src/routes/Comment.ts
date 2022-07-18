import express from 'express';
import {
  addComment,
  getComment,
  removeComment,
} from '../controllers/Comment';
import isLoggedIn from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.post('/add', isLoggedIn, addComment);
router.delete('/remove', isLoggedIn, removeComment);
router.get('/:commentId', getComment);

export default router;