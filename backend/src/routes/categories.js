const express = require('express');
const router = express.Router();

// Sample categories data for development
const CATEGORIES = [
  { id: '1', name: 'Fruits & Vegetables', icon: 'leaf' },
  { id: '2', name: 'Dairy & Breakfast', icon: 'cafe' },
  { id: '3', name: 'Staples', icon: 'basket' },
  { id: '4', name: 'Snacks & Beverages', icon: 'fast-food' },
  { id: '5', name: 'Cleaning & Household', icon: 'home' },
  { id: '6', name: 'Beauty & Hygiene', icon: 'fitness' },
];

// GET all categories
router.get('/', (req, res) => {
  res.json(CATEGORIES);
});

// GET category by ID
router.get('/:id', (req, res) => {
  const category = CATEGORIES.find(c => c.id === req.params.id);
  
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
  res.json(category);
});

module.exports = router; 