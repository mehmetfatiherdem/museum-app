const authenticate = (req, res, next) => {
  if (!req.session.user) {
    console.log(`req.session sign out = ${JSON.stringify(req.session)}`);
    console.log(`req.session.user  ===> ${JSON.stringify(req.session.user)}`);
    res.json({ message: 'you should sign in first' });
  }
  next();
};

export { authenticate };
