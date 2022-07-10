import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const token = req.cookies._t;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (isVerified) req.user = isVerified;
  } catch (err) {
    return res
      .clearCookie('token')
      .status(422)
      .json({ error: 'Invalid token' });
  }

  next();
};

export default authenticate;
