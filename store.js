const { v4: uuidv4 } = require('uuid');

const users = [];   // { id, username, passwordHash, role }
const donors = [];  // { id, nombre, email, monto, fecha, createdBy }

module.exports = {
  users,
  donors,
  generateId: () => uuidv4(),
};st
