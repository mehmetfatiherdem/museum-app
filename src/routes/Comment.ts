import express from 'express';
import {
  addComment,
  getComment,
  getMuseumComments,
  removeComment,
} from '../controllers/Comment';
import isLoggedIn from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.post('/add-comment', isLoggedIn, addComment);
router.delete('/remove-comment', isLoggedIn, removeComment);
router.get('/comment/:id', getComment);
router.get('/museum/:museumId/comments', getMuseumComments);

export default router;