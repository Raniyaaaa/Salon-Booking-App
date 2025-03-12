const { Service }  = require("../models");

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: 'Error fetching services', error });
  }
};

exports.addService = async (req, res) => {
  const { name, description, price, duration, imageUrl, category } = req.body;
  console.log("HJGKHH", req.body)
  try {
    const newService = await Service.create({
      name,
      description,
      price,
      duration,
      imageUrl, 
      category,
    });
    res.status(201).json(newService);
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ message: 'Error adding service', error });
  }
};

exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration, imageUrl, category } = req.body;
  try {
    const service = await Service.findByPk(id);
    if (service) {
      service.name = name;
      service.description = description;
      service.price = price;
      service.duration = duration;
      service.imageUrl = imageUrl;
      service.category = category;
      await service.save();
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: 'Error updating service', error });
  }
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findByPk(id);
    if (service) {
      await service.destroy();
      res.json({ message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: 'Error deleting service', error });
  }
};
