import { Request, Response } from 'express';
import Museum from '../models/Museum';

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

export { getMuseums, getMuseum };
