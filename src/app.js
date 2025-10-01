const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config');
const routes = require('./routes');
const ErrorHandler = require('./utils/errorHandler');
const { requestLogger } = require('./middlewares/logger');
const corsOptions = require('./config/cors');

const app = express();

// CORS middleware (phải đặt trước các middleware khác)
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use(config.apiPrefix, routes);

// Error handling
app.use((err, req, res, next) => {
  ErrorHandler.handle(err, req, res, next);
});

// Database connection
connectDB();

module.exports = app; 
