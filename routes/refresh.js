const jwt = require("jsonwebtoken");

const refresh_post = (req, res, next) => {
  if (req.cookies?.jwt) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;

    // Verifying refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
      const user = req.user;
      if (err) {
        // Wrong Refesh Token
        return res.status(406).json({ message: "Unauthorized" });
      } else {
        // Correct token we send a new access token
        const accessToken = jwt.sign({ user: user }, process.env.SECRET_KEY, {
          expiresIn: "10m",
        });
        return res.json({ accessToken });
      }
    });
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
};

module.exports = { refresh_post };
