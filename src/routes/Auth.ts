import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../helpers/type';
const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'openid', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req: IGetUserAuthInfoRequest, res) {
    const { id } = req.user;

    const cookieAge = 24 * 3600; // Default cookie expiry time is 1 day

    const token = jwt.sign(
      {
        id: id,
        role: 'normal',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: cookieAge,
      }
    );
    res.cookie('token', token, {
      maxAge: cookieAge * 1000,
      httpOnly: true,
    });

    res.redirect('/');
  }
);

export default router;
