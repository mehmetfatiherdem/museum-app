import User from '../models/User';
import { Request, Response } from 'express';

const addProviderToUser = async (req: Request, res: Response) => {
  try {
    await User.updateMany({}, { $set: { provider: 'local', providerId: '' } });

    res.json({ message: 'Users updated' });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export default addProviderToUser;
