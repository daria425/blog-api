const jwt = require("jsonwebtoken");

const refresh_post = (req, res, next) => {
  console.log("token refreshing");
  console.log(req.cookies.jwt);
  if (req.cookies?.jwt) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY,
        (err, decoded) => {
          const user = req.user || decoded;
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const accessToken = jwt.sign(
              { user: user },
              process.env.SECRET_KEY,
              {
                expiresIn: "10m",
              }
            );
            resolve({ accessToken, user });
          }
        }
      );
    });
  }
};

module.exports = { refresh_post };
