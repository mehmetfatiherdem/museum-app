import jwt from 'jsonwebtoken';

const isAdmin = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  const user = jwt.verify(token, process.env.JWT_SECRET);

  if (user.role === 'admin') {
    return next();
  }
  return res.clearCookie('token').status(403).json({
    message: 'You do not have a permission to perform this action',
  });
};

export default isAdmin;
