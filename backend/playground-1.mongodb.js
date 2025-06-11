// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

use('dmarket');

const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('password', 12);

db.getCollection('users').insertOne({
  name: "Admin",
  email: "admin@dmarket.com",
  password: hashedPassword,
  role: "admin",
  createdAt: new Date()
});