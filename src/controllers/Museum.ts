import { Request, Response } from 'express';
import { checkMissingFields } from '../helpers/body';
import { IGetUserAuthInfoRequest } from '../helpers/type';
import Museum from '../models/Museum';
import User from '../models/User';

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

const filterMuseumsByCity = async (req: Request, res: Response) => {
  const { city } = req.query;
  const museums = await Museum.find({ city });
  if (museums.length === 0) throw new Error('There are no museums in the DB');
  res.json({
    data: {
      museums,
    },
  });
};

const favMuseum = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { museumId } = req.body;

  try {
    checkMissingFields([museumId]);

    const user = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');

    if (user.favoriteMuseums.includes(museumId)) {
      throw new Error('Museum already in favorites');
    }

    user.favoriteMuseums.push(museumId);
    await user.save();

    res.json({
      message: 'Museum added to favorites',
      data: {
        museumId,
      },
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const removeFavMuseum = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { museumId } = req.body;

  try {
    checkMissingFields([museumId]);

    const user = await User.findById(req.user.id);
    if (!user) throw new Error('User not found');

    if (!user.favoriteMuseums.includes(museumId)) {
      throw new Error('Museum not in favorites');
    }

    user.favoriteMuseums.splice(user.favoriteMuseums.indexOf(museumId), 1);
    await user.save();

    res.json({ message: 'Museum removed from favorites', data: { museumId } });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const getFavMuseums = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const user = await User.findById(req.user.id);

  if (!user) throw new Error('User not found');

  res.json({
    message: 'favorite museums retrieved successfully',
    data: {
      museums: user.favoriteMuseums,
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
};
