const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/serviceController');

// Route to get all services
router.get('/', ServiceController.getAllServices);

// Route to add a new service
router.post('/', ServiceController.addService);

// Route to update an existing service
router.put('/:id', ServiceController.updateService);

// Route to delete a service
router.delete('/:id', ServiceController.deleteService);

module.exports = router;
