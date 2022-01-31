exports.isAdmin = () => {
  return (req, res, next) => {
    const currentUser = res.locals.decoded.user;
    const role = currentUser.role.name || null;

    if (role !== 'admin') {
      res.status(422).json({ message: 'Not Authorized to perform this operation' });
    } else {
      next();
    }
  };
};
