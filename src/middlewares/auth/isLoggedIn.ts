import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../../helpers/type';

const isLoggedIn = (req: IGetUserAuthInfoRequest, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user) req.user = user;
    return next();
  } catch (err) {
    return res
      .clearCookie('token')
      .status(422)
      .json({ error: 'Invalid token' });
  }

  next();
};

export default isLoggedIn;
