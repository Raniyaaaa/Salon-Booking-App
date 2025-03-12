const { Stylist }  = require("../models");


exports.getStylists = async (req, res) => {
  try {
    const stylists = await Stylist.findAll();
    res.status(200).json(stylists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stylists", error: error.message });
  }
};


exports.addStylist = async (req, res) => {
  try {
    const { name, specialization, imageUrl, availability, assignedService } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({ message: "Name and specialization are required." });
    }

    const newStylist = await Stylist.create({
      name,
      specialization: typeof specialization === "string" ? JSON.parse(specialization) : specialization, // Ensure JSON format
      imageUrl,
      availability: availability !== undefined ? availability : true,
    });

    res.status(201).json(newStylist);
  } catch (error) {
    res.status(500).json({ message: "Failed to add stylist", error: error.message });
  }
};


exports.updateStylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, imageUrl, availability } = req.body;

    const stylist = await Stylist.findByPk(id);
    if (!stylist) {
      return res.status(404).json({ message: "Stylist not found" });
    }

    console.log("stylist", stylist);

    await stylist.update({
      name: name || stylist.name,
      specialization: specialization ? (Array.isArray(specialization) ? specialization : JSON.parse(specialization)) : stylist.specialization,
      imageUrl: imageUrl || stylist.imageUrl,
      availability: availability !== undefined ? availability : stylist.availability,
    });

    res.status(200).json(stylist);
  } catch (error) {
    console.error("Error updating stylist:", error); 
    res.status(500).json({ message: "Failed to update stylist", error: error.message });
  }
};

exports.deleteStylist = async (req, res) => {
  try {
    const { id } = req.params;
    const stylist = await Stylist.findByPk(id);
    if (!stylist) {
      return res.status(404).json({ message: "Stylist not found" });
    }

    await stylist.destroy();
    res.status(200).json({ message: "Stylist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete stylist", error: error.message });
  }
};
