import express from 'express';
import {
  addComment,
  getComment,
  removeComment,
  updateComment,
} from '../controllers/Comment';
import isLoggedIn from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.post('/add', isLoggedIn, addComment);
router.patch('/update', isLoggedIn, updateComment);
router.delete('/remove', isLoggedIn, removeComment);
router.get('/:commentId', getComment);

export default router;
