const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./util/db'); // Sequelize database connection
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const stylistRoutes = require('./routes/stylistRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const stylistSlotRoutes = require('./routes/stylistSlotRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cronJobs = require('./cron/cronJobs'); // Optional: For cron jobs like reminders

// Initialize dotenv for environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Request Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

// API Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/services', serviceRoutes);
app.use('/stylists', stylistRoutes);
app.use('/booking', bookingRoutes);
app.use('/payment', paymentRoutes);
app.use('/review', reviewRoutes);
app.use('/notification', notificationRoutes);
app.use('/admin', adminRoutes);
app.use('/stylistslot', stylistSlotRoutes);


sequelize.sync()
  .then(() => {
    console.log('Database connected successfully');

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
