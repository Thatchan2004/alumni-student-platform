const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route files
const authRoutes = require('./routes/authRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
// Uncomment these when the respective route files exist
// const postRoutes = require('./routes/postRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const jobRoutes = require('./routes/jobRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
// Uncomment these when routes exist
// app.use('/api/posts', postRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/jobs', jobRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running'
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;
