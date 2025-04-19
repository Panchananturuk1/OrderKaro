const express = require('express');
const router = express.Router();

// Sample cart data for development
const CARTS = {
  'dev-user-id': {
    items: [
      {
        id: '1', // Cart item ID
        product_id: '1',
        quantity: 2,
        added_at: '2023-11-20T10:00:00Z'
      },
      {
        id: '2',
        product_id: '3',
        quantity: 1,
        added_at: '2023-11-20T10:10:00Z'
      }
    ]
  }
};

// GET /api/cart - Get user's cart
router.get('/', (req, res) => {
  // Get user ID from the authenticated request
  const userId = req.user.id;
  
  // Get user's cart or return empty cart if not found
  const cart = CARTS[userId] || { items: [] };
  
  res.json(cart);
});

// POST /api/cart - Add item to cart
router.post('/', (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;
  
  // Basic validation
  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Product ID and valid quantity are required' });
  }
  
  // Get or initialize user's cart
  if (!CARTS[userId]) {
    CARTS[userId] = { items: [] };
  }
  
  // Check if product already exists in cart
  const existingItemIndex = CARTS[userId].items.findIndex(item => item.product_id === product_id);
  
  if (existingItemIndex !== -1) {
    // Update existing item quantity
    CARTS[userId].items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    CARTS[userId].items.push({
      id: Date.now().toString(), // Generate a simple ID
      product_id,
      quantity,
      added_at: new Date().toISOString()
    });
  }
  
  res.status(201).json(CARTS[userId]);
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  const { quantity } = req.body;
  
  // Basic validation
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }
  
  // Check if user has a cart
  if (!CARTS[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  // Find the cart item
  const itemIndex = CARTS[userId].items.findIndex(item => item.id === cartItemId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Cart item not found' });
  }
  
  // Update the quantity
  CARTS[userId].items[itemIndex].quantity = quantity;
  
  res.json(CARTS[userId]);
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', (req, res) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;
  
  // Check if user has a cart
  if (!CARTS[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  // Remove the item from cart
  CARTS[userId].items = CARTS[userId].items.filter(item => item.id !== cartItemId);
  
  res.json(CARTS[userId]);
});

// DELETE /api/cart - Clear cart
router.delete('/', (req, res) => {
  const userId = req.user.id;
  
  // Initialize or clear the cart
  CARTS[userId] = { items: [] };
  
  res.json(CARTS[userId]);
});

module.exports = router; 