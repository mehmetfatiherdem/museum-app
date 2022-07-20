import { Request, Response } from 'express';
import { checkMissingFields } from '../helpers/body';
import { IGetUserAuthInfoRequest } from '../helpers/type';
import Museum from '../models/Museum';
import User from '../models/User';

const getMuseums = async (req: Request, res: Response) => {
  const museums = await Museum.find();
  if (museums.length === 0)
    return res.status(422).json({ message: 'No museum found in the DB' });
  return res.json(museums);
};

const getMuseum = async (req: Request, res: Response) => {
  const { id } = req.params;
  const museum = await Museum.findById(id);
  if (!museum)
    return res
      .status(422)
      .json({ message: 'No museum found with the specified ID' });
  return res.json(museum);
};

const filterMuseumsByCity = async (req: Request, res: Response) => {
  const { city } = req.query;
  const museums = await Museum.find({ city });
  if (museums.length === 0)
    return res.status(422).json({ message: 'No museum found in the DB' });
  return res.json({
    data: {
      museums,
    },
  });
};

const favMuseum = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { museumId } = req.body;

  if (checkMissingFields([museumId]))
    return res
      .status(422)
      .json({ message: 'There are missing fields in the body!' });

  const user = await User.findById(req.user.id);
  if (!user)
    return res
      .status(422)
      .json({ message: 'No user found with the specified ID' });

  if (user.favoriteMuseums.includes(museumId)) {
    return res
      .status(422)
      .json({ message: 'Museum is already in the favorites' });
  }

  user.favoriteMuseums.push(museumId);
  await user.save();

  return res.json({
    message: 'Museum added to favorites',
    data: {
      museumId,
    },
  });
};

const removeFavMuseum = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { museumId } = req.body;

  if (checkMissingFields([museumId]))
    return res
      .status(422)
      .json({ message: 'There are missing fields in the body!' });

  const user = await User.findById(req.user.id);
  if (!user)
    return res
      .status(422)
      .json({ message: 'No museum found with the specified ID' });

  if (!user.favoriteMuseums.includes(museumId)) {
    return res.status(422).json({ message: 'Museum is not in the favorites' });
  }

  user.favoriteMuseums.splice(user.favoriteMuseums.indexOf(museumId), 1);
  await user.save();

  return res.json({
    message: 'Museum removed from favorites',
    data: { museumId },
  });
};

const getFavMuseums = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const user = await User.findById(req.user.id);

  if (!user)
    return res
      .status(422)
      .json({ message: 'No user found with the specified ID' });

  return res.json({
    message: 'favorite museums retrieved successfully',
    data: {
      museums: user.favoriteMuseums,
    },
  });
};

const getMuseumComments = async (req: Request, res: Response) => {
  const { id } = req.params;
  const museum = await Museum.findById(id);
  if (!museum)
    return res
      .status(422)
      .json({ message: 'No museum found with the specified ID' });

  await museum.populate('comments');

  return res.json({
    data: {
      comments: museum.comments,
    },
  });
};

export {
  getMuseums,
  getMuseum,
  filterMuseumsByCity,
  favMuseum,
  removeFavMuseum,
  getFavMuseums,
  getMuseumComments,
};
