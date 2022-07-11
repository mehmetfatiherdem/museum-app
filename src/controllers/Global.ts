import { Request, Response } from 'express';
import Museum from '../models/Museum';
import Comment from '../models/Comment';

const getMuseums = async (req: Request, res: Response) => {
  const museums = await Museum.find();
  if (museums.length === 0) throw new Error('There are no museums in the DB');
  res.json(museums);
};

const getMuseum = async (req: Request, res: Response) => {
  const { id } = req.params;
  const museum = await Museum.findById(id);
  if (!museum) throw new Error(`Museum with the ID of ${id} doesn't exist`);
  res.json(museum);
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

const filterMuseumsByCity = async (req: Request, res: Response) => {
  const { city } = req.params;
  const museums = await Museum.find({ city });
  if (museums.length === 0) throw new Error('There are no museums in the DB');
  res.json({
    data: {
      museums,
    },
  });
};

export { getMuseums, getMuseum, getMuseumComments, getComment, filterMuseumsByCity };
