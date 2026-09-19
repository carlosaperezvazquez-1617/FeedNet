const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, generateId } = require('../data/store');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

async function register(req, res) {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ error: 'El usuario ya existe' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: generateId(),
    username,
    passwordHash,
    role: role === 'administrador' ? 'administrador' : 'usuario',
  };

  users.push(newUser);
  return res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role });
}

async function login(req, res) {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.json({ token });
}

module.exports = { register, login };