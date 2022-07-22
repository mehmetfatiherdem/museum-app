import { checkMissingFields } from '../helpers/body';
import { IGetUserAuthInfoRequest } from '../helpers/type';
import Comment from '../models/Comment';
import Museum, { IMuseum } from '../models/Museum';
import User, { IUser } from '../models/User';
import { Response, Request } from 'express';
import isType from '../helpers/typeGuard';

const addComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { text, museumId } = req.body;

  const museum = await Museum.findById(museumId);

  if (!museum)
    return res
      .status(422)
      .json({ message: 'No museum found with the specified ID' });

  const user = await User.findById(req.user.id);

  if (!user)
    return res.status(422).json({
      message: 'No user found with the specified ID',
    });

  if (checkMissingFields([text, museumId]))
    return res
      .status(422)
      .json({ message: 'There are missing fields in the body!' });

  try {
    const comment = await Comment.create({
      text,
      user: req.user.id,
      museum: museumId,
    });

    museum.comments.push(comment._id);

    await museum.save();

    user.comments.push(comment._id);

    await user.save();

    return res.status(201).json({
      message: 'comment successfully created',
      data: {
        commentId: comment.id,
        userId: comment.user,
        text,
      },
    });
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
};

const removeComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { commentId } = req.body;

  let session = null;

  Comment.startSession()
    .then((_session) => {
      session = _session;
      return session.withTransaction(async () => {
        const comment = await Comment.findById(commentId);
        if (!comment)
          return res.status(422).json({
            message: 'No comment found with the specified ID',
          });

        if (!comment.user.equals(req.user.id))
          return res.status(401).json({
            message: 'You cannot delete a comment you did not create',
          });

        const museum = await Museum.findById(comment.museum);
        if (!museum)
          return res.status(422).json({
            message: 'No museum found with the specified ID',
          });

        const user = await User.findById(comment.user);
        if (!user)
          return res.status(422).json({
            message: 'No user found with the specified ID',
          });

        museum.comments.splice(museum.comments.indexOf(commentId), 1);
        user.comments.splice(user.comments.indexOf(commentId), 1);

        await museum.save({ session });
        await user.save({ session });
        await comment.remove({ session });

        return res.json({
          message: 'Comments successfully deleted',
        });
      });
    })
    .then(() => Comment.countDocuments())
    .then(() => session.endSession());
};

const getComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment)
    return res.status(422).json({
      message: 'No comment found with the specified ID',
    });

  await comment.populate('user');
  await comment.populate('museum');

  return res.json({
    message: 'comment successfully retrieved',
    data: {
      commentId: comment.id,
      text: comment.text,
      user: isType<IUser>(comment.user) ? comment.user.name : '',
      museum: isType<IMuseum>(comment.museum) ? comment.museum.name : '',
    },
  });
};

const updateComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { commentId, text } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment)
    return res.status(422).json({
      message: 'No comment found with the specified ID',
    });
  if (!comment.user.equals(req.user.id))
    return res.status(401).json({
      message: 'You cannot update a comment you did not create',
    });

  try {
    comment.text = text;

    await comment.save();

    return res.status(201).json({
      message: 'comment successfully updated',
      data: {
        commentId: comment.id,
        text,
      },
    });
  } catch (err) {
    return res.status(422).json({ message: err.message });
  }
};

export { addComment, removeComment, getComment, updateComment };
