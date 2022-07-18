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
  const { commentId } = req.body;

  let session = null;

  Comment.startSession()
    .then((_session) => {
      session = _session;
      return session.withTransaction(async () => {
        const comment = await Comment.findById(commentId);
        if (!comment)
          throw new Error(`Comment with the ID of ${commentId} doesn't exist`);

        console.log(`comment user = ${comment.user} user = ${req.user.id}`);

        if (!comment.user.equals(req.user.id))
          throw new Error('You cannot delete a comment you did not create');

        const museum = await Museum.findById(comment.museum);
        if (!museum)
          throw new Error(
            `Museum with the ID of ${comment.museum} doesn't exist`
          );

        const user = await User.findById(comment.user);
        if (!user)
          throw new Error(`User with the ID of ${comment.user} doesn't exist`);

        museum.comments.splice(museum.comments.indexOf(commentId), 1);
        user.comments.splice(user.comments.indexOf(commentId), 1);

        await museum.save({ session });
        await user.save({ session });
        await comment.remove({ session });

        return;
      });
    })
    .then(() => Comment.countDocuments())
    .then(() => session.endSession());

  return res.json({
    message: 'Comments successfully deleted',
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
      user: isType<IUser>(comment.user) ? comment.user.name : '',
      museum: isType<IMuseum>(comment.museum) ? comment.museum.name : '',
    },
  });
};

const updateComment = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { commentId, text } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment)
    throw new Error(`Comment with the ID of ${commentId} doesn't exist`);
  if (!comment.user.equals(req.user.id))
    throw new Error('You cannot update a comment you did not create');

  comment.text = text;

  await comment.save();

  res.json({
    message: 'comment successfully updated',
    data: {
      commentId: comment.id,
      text,
    },
  });
};

export { addComment, removeComment, getComment, updateComment };
