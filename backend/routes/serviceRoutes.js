const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController');

router.get('/', ServiceController.getAllServices);
router.post('/', ServiceController.addService);
router.put('/:id', ServiceController.updateService);
router.delete('/:id', ServiceController.deleteService);

module.exports = router;
