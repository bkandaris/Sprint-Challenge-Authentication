/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log(req.cookies);

  // gets our jwt when it's sent (don't forget to destructure the token)
  // now automatically sends our cookie with the token
  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'not finding token' });
  }

  // checking the tokens signature to make sure it's legit
  // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(401).json({ message: 'not finding other' });
  //   } else {
  //     req.token = decoded;
  //     next();
  //   }

  //   req.token = decoded;
  //   console.log(decoded);
  // });
  next();
};
