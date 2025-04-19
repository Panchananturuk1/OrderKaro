const express = require('express');
const router = express.Router();

// Reference to sample products data from products route
const productsRoute = require('./products');
const SAMPLE_PRODUCTS = productsRoute.SAMPLE_PRODUCTS || [];

// GET /api/search - Search products
router.get('/', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  
  // Simple search implementation
  const searchQuery = query.toLowerCase();
  const results = SAMPLE_PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(searchQuery) || 
    product.description.toLowerCase().includes(searchQuery)
  );
  
  res.json(results);
});

module.exports = router; 