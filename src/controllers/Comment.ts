import { checkMissingFields } from '../helpers/body';
import { IGetUserAuthInfoRequest } from '../helpers/type';
import Comment from '../models/Comment';
import Museum from '../models/Museum';
import User from '../models/User';
import { Response, Request } from 'express';

const addComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { text, museumId } = req.body;

  const museum = await Museum.findById(museumId);

  if (!museum) throw new Error('Museum not found');

  const user = await User.findById(req.user.id);

  if (!user) throw new Error('User not found');

  try {
    checkMissingFields([text, museumId]);
    const comment = await Comment.create({
      text,
      user: req.user.id,
      museum: museumId,
    });

    museum.comments.push(comment._id);

    await museum.save();

    user.comments.push(comment._id);

    await user.save();

    res.json({
      message: 'comment successfully created',
      data: {
        commentId: comment.id,
        userId: comment.user,
        text,
      },
    });
  } catch (err) {
    res.json({ message: err });
  }
};

const removeComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.body;

  const comment = await Comment.findById(id);

  if (!comment) throw new Error('Comment not found');

  if (!comment.user._id.equals(req.user.id)) {
    return res.status(422).json({
      message: 'You cannot delete a comment that belongs to other people',
    });
  }

  await Comment.findByIdAndRemove(id);

  return res.json({
    message: 'Comment successfully deleted',
  });
};

const getComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment)
    throw new Error(`Comment with the ID of ${commentId} doesn't exist`);

  await comment.populate('user');
  await comment.populate('museum');

  res.json({
    message: 'comment successfully retrieved',
    data: {
      commentId: comment.id,
      text: comment.text,
      user: comment.user,
      museum: comment.museum,
    },
  });
};

const getMuseumComments = async (req: Request, res: Response) => {
  const { museumId } = req.params;
  console.log(museumId);
  const museum = await Museum.findById(museumId);
  if (!museum)
    throw new Error(`Museum with the ID of ${museumId} doesn't exist`);

  res.json({
    data: {
      comments: museum.comments,
    },
  });
};

export { addComment, removeComment, getMuseumComments, getComment };
