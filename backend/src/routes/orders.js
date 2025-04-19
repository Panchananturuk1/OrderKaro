const express = require('express');
const router = express.Router();

// Sample data for development
const ORDERS = [];

// GET /api/orders - Get user's orders
router.get('/', (req, res) => {
  const userId = req.user.id;
  
  // Filter orders for this user
  const userOrders = ORDERS.filter(order => order.user_id === userId);
  
  res.json(userOrders);
});

// POST /api/orders - Create a new order
router.post('/', (req, res) => {
  const { items, shipping_address, payment_method } = req.body;
  
  // Basic validation
  if (!items || !items.length || !shipping_address || !payment_method) {
    return res.status(400).json({ message: 'Items, shipping address, and payment method are required' });
  }
  
  // Create a new order
  const newOrder = {
    id: Date.now().toString(),
    user_id: req.user.id,
    items,
    shipping_address,
    payment_method,
    status: 'pending',
    total_amount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add to orders
  ORDERS.push(newOrder);
  
  res.status(201).json(newOrder);
});

// GET /api/orders/:id - Get a specific order
router.get('/:id', (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;
  
  // Find the order
  const order = ORDERS.find(order => order.id === orderId && order.user_id === userId);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

// PUT /api/orders/:id/cancel - Cancel an order
router.put('/:id/cancel', (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;
  
  // Find the order
  const orderIndex = ORDERS.findIndex(order => order.id === orderId && order.user_id === userId);
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  // Check if order can be cancelled
  if (ORDERS[orderIndex].status !== 'pending' && ORDERS[orderIndex].status !== 'processing') {
    return res.status(400).json({ message: 'Order cannot be cancelled' });
  }
  
  // Update order status
  ORDERS[orderIndex].status = 'cancelled';
  ORDERS[orderIndex].updated_at = new Date().toISOString();
  
  res.json(ORDERS[orderIndex]);
});

module.exports = router; 