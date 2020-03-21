const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knexConnection = require('../database/dbConfig');
const dbConfig = require('../database/dbConfig');
const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();
const cookieParser = require('cookie-parser');
server.use(cookieParser());

server.use(
  session({
    name: 'token', // overwrites default cookie name / hides stack better - if a bug surfaces in express-session hackers wont' know we are using this
    resave: false, // avoid recreating sessions if they haven't changed
    saveUninitialized: false, // GDPR laws against setting cookies automatically
    secret: 'keep it secret, keep it safe', // any string / encrypts our cookie
    cookie: {
      httpOnly: true, // keeps us more secure not allowing JS to read it
      maxAge: 1500000 // expires the cookie
    },
    store: new KnexSessionStore({
      knex: dbConfig, // configured instance of knex
      createtable: true // if session table doesn't exist, create it to store sessions
    })
  })
);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

module.exports = server;
