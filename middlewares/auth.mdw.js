module.exports = (req, res, next) => {
  if (req.session.isAuthenticated === false)
    return res.redirect(`/user/login?retUrl=${req.originalUrl}`);

  next();
}
