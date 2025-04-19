const express = require('express');
const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', (req, res) => {
  // In a real app, you would fetch user data from a database
  // For development, we'll return the user object from the request
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: 'Test User',
    phone: '9876543210',
    created_at: '2023-01-01T00:00:00Z'
  });
});

// PUT /api/users/profile - Update user profile
router.put('/profile', (req, res) => {
  const { name, phone } = req.body;
  
  // Basic validation
  if (!name && !phone) {
    return res.status(400).json({ message: 'No update data provided' });
  }
  
  // In a real app, you would update user data in a database
  // For development, we'll just return the updated user object
  const updatedUser = {
    id: req.user.id,
    email: req.user.email,
    name: name || 'Test User',
    phone: phone || '9876543210',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: new Date().toISOString()
  };
  
  res.json(updatedUser);
});

module.exports = router; 