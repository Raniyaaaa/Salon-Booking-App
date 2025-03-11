const { User }  = require("../models");

exports.updateProfile = async (req, res) => {
  const { name, email, phoneNumber } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ name, email, phoneNumber });
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};
