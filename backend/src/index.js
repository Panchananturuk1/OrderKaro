require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const addressRoutes = require('./routes/addresses');
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');

// Import middleware
const { authenticateToken } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // HTTP request logger
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'OrderKaro API is up and running!',
    version: '1.0.0', 
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', authenticateToken, cartRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/addresses', authenticateToken, addressRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/search', searchRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Route not found' 
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    status: 'error', 
    message: err.message || 'Internal Server Error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`OrderKaro API server running on port ${PORT}`);
});

module.exports = app; // Export for testing 