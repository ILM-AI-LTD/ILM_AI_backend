const bcrypt = require('bcryptjs');

const hashPassword = (plainText) => bcrypt.hashSync(plainText, 8);
const comparePasswords = (plainText, hashed) => bcrypt.compareSync(plainText, hashed);

module.exports = { hashPassword, comparePasswords };
