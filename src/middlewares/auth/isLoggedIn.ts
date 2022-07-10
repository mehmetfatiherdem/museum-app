import jwt from 'jsonwebtoken';

const isLoggedIn = (req, res, next) => {
  const { token } = req.cookies;
  console.log(`cookie ==> ${JSON.stringify(req.cookies)}`);
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
