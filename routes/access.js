const jwt = require("jsonwebtoken");
const get_access = (req, res, next) => {
  const authUser = req.body.user;
  jwt.sign({ user: authUser }, process.env.SECRET_KEY, (err, token) => {
    res.json({ token });
  });
};

module.exports = {
  get_access,
};
// router.post("/login", (req, res, next) => {
//     const authUser = res.locals.me;
//     jwt.sign({ user: authUser }, "svintus", (err, token) => {
//       res.json({ token });
//     });
//   });

//router.post("/posts", verifyToken, (req, res, next) => {
// jwt.verify(req.token, "svintus", (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       res.send({ message: "new message", authData });
//     }
//   });
// });

// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers["authorization"];

//     if (typeof bearerHeader !== "undefined") {
//       const bearer = bearerHeader.split(" ");
//       const token = bearer[1];
//       req.token = token;
//       next();
//     } else {
//       res.sendStatus(403);
//     }
//   }
