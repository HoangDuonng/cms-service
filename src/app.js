const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const ErrorHandler = require('./utils/errorHandler');
const { requestLogger } = require('./middlewares/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  ErrorHandler.handle(err, req, res, next);
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app; 
