const log_out_get = (req, res, next) => {
  res.clearCookie("user", { path: "/" }); // clear the session cookie
  req.logout(function (err) {
    // logout of passport
    req.session.destroy(function (err) {
      // destroy the session
      res.sendStatus(200); // send to the client
    });
  });
};

module.exports = {
  log_out_get,
};
