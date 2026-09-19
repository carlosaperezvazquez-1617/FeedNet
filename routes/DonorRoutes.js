const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createDonor,
  listDonors,
  getDonor,
  updateDonor,
  deleteDonor,
} = require('../controllers/donorController');

const router = express.Router();

router.use(authenticate); // todas las rutas de donantes requieren token

router.get('/', listDonors);
router.get('/:id', getDonor);
router.post('/', createDonor);
router.put('/:id', authorize('administrador'), updateDonor);
router.delete('/:id', authorize('administrador'), deleteDonor);

module.exports = router;