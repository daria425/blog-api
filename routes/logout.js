const log_out_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
};

module.exports = {
  log_out_get,
};
