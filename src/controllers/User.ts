import { Request, Response } from 'express';
import { checkMissingFields } from '../helpers/body';
import User from '../models/User';
import bcrypt from 'bcrypt';

const signUp = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;

  try {
    checkMissingFields([name, lastName, email, password]);

    const user = await User.create({
      name,
      lastName,
      email,
      password,
      favoriteMuseums: [],
    });

    res.json(user.serializedForLogin());
  } catch (err) {
    res.json({ message: err.message });
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password, rememberMe = false } = req.body;

  try {
    checkMissingFields([email, password]);
    const user = await User.findOne({ email });

    if (!user) throw new Error('No registered account found with this email');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('wrong password');

    console.log(
      `session cookie before rememberMe ===> ${req.session.cookie.maxAge}`
    );

    if (rememberMe) {
      const expirationDate = 1000 * 60 * 60 * 24 * 14;
      req.session.cookie.maxAge = expirationDate;
      console.log(
        `session cookie after rememberMe ===> ${req.session.cookie.maxAge}`
      );
    }

    console.log(`req.session sign in = ${JSON.stringify(req.session)}`);

    req.session.user = user;

    console.log(`user ===> ${req.session.user}`);

    res.json(user.serializedForLogin());
  } catch (err) {
    console.log(err);
  }
};

const signOut = async (req: Request, res: Response) => {
  console.log(`req.session before sign out = ${JSON.stringify(req.session)}`);
  console.log(
    `req.session.user before sign out  ===> ${JSON.stringify(req.session.user)}`
  );
  if (!req.session.user) {
    res.json({ message: 'you should sign in first' }).end();
  } else {
    req.session.destroy((err) => console.log(`err = ${err}`));
    console.log(`req.session after sign out = ${JSON.stringify(req.session)}`);
    res.json({ message: 'successfully signed out' });
  }
};

export { signUp, signIn, signOut };
