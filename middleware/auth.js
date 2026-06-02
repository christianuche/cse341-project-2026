const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      error: "Unauthorized. Please log in to access this resource."
    });
  }
  next();
};

module.exports = { isAuthenticated };
