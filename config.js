module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'clave-secreta-de-desarrollo-cambiar-en-prod',
  JWT_EXPIRES_IN: '2h',
};