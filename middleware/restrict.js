const bcrypt = require('bcryptjs');
const Users = require('../users/user-helper');
const jwt = require('jsonwebtoken');

const sessions = {};

function restrict() {
  const authError = {
    message: 'Invalid credentials'
  };

  return async (req, res, next) => {
    try {
      // gets our jwt when it's sent (don't forget to destructure the token)
      // now automatically sends our cookie with the token
      const { token } = req.cookies;

      if (!token) {
        return res.status(401).json({ message: 'not finding token' });
      }

      // checking the tokens signature to make sure it's legit
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log(process.env.JWT_SECRET);
        console.log(`our cookies`, req.cookies);
        if (err) {
          return res.status(401).json({ message: 'not finding other' });
        }

        req.token = decoded;
        console.log(decoded);
        next();
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { restrict, sessions };
