const { donors, generateId } = require('../data/store');

function createDonor(req, res) {
  const { nombre, email, monto } = req.body;

  if (!nombre || !email || monto === undefined) {
    return res.status(400).json({ error: 'nombre, email y monto son obligatorios' });
  }

  const donor = {
    id: generateId(),
    nombre,
    email,
    monto,
    fecha: new Date().toISOString(),
    createdBy: req.user.username,
  };

  donors.push(donor);
  return res.status(201).json(donor);
}

function listDonors(req, res) {
  return res.json(donors);
}

function getDonor(req, res) {
  const donor = donors.find((d) => d.id === req.params.id);
  if (!donor) return res.status(404).json({ error: 'Donante no encontrado' });
  return res.json(donor);
}

function updateDonor(req, res) {
  const donor = donors.find((d) => d.id === req.params.id);
  if (!donor) return res.status(404).json({ error: 'Donante no encontrado' });

  const { nombre, email, monto } = req.body;
  if (nombre !== undefined) donor.nombre = nombre;
  if (email !== undefined) donor.email = email;
  if (monto !== undefined) donor.monto = monto;

  return res.json(donor);
}

function deleteDonor(req, res) {
  const index = donors.findIndex((d) => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Donante no encontrado' });

  donors.splice(index, 1);
  return res.status(204).send();
}

module.exports = { createDonor, listDonors, getDonor, updateDonor, deleteDonor };