const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User }  = require("../models");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user in the database
    const user = await User.create({ name, email, password: hashedPassword });

    // Send a response with the user data (excluding the password)
    res.status(201).json({
      message: 'User registered successfully, Please Login !! ',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token , user:user});
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};
