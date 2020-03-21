// import bcrypt for hashing passwords
const bcrypt = require('bcryptjs');

const db = require('../database/dbConfig');

async function add(user) {
  //hashes the password, second param is time complexity
  user.password = await bcrypt.hash(user.password, 12);

  const [id] = await db('users').insert(user);
  return findById(id);
}

function find() {
  return db('users').select('id', 'username');
}

function findBy(filter) {
  return db('users')
    .select('id', 'username', 'password')
    .where(filter)
    .first();
}

function findById(id) {
  return db('users')
    .select('id', 'username')
    .where({ id })
    .first();
}

module.exports = {
  add,
  find,
  findBy,
  findById
};
