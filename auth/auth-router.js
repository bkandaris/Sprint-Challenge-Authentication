const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('../users/user-model');
const { sessions, restrict } = require('../middleware/restrict');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await Users.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: 'Username is already taken'
      });
    }

    res.status(201).json(await Users.add(req.body));
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log('req.body', req.body);
    // Does that body have anything?
    if (!username || !password) {
      return res.status(400).json({ message: 'BIG MISTAKE!' });
    }
    //Does the user exist
    const user = await Users.findBy({ username });
    if (!user) {
      return res.status(404).json({ message: 'Nope, didnt find that.' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }

    req.session.user = user;
    // creating payload object
    const payload = {
      userId: user.id,
      userRole: 'normal'
    };

    const options = {
      expiresIn: '1h'
    };
    // creating token for the user
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    // sends a Set-Cookie header with our
    res.cookie('token', token);

    res.json({
      message: `Welcome ${user.username}!`
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
