const express = require('express');
const router = express.Router();

// Sample product data for development
const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Organic Apples',
    description: 'Delicious, crisp and sweet organic apples sourced directly from local farms. These apples are grown without pesticides or chemical fertilizers, ensuring you get the best quality produce for your family.',
    price: 120,
    sale_price: 99,
    image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
    unit: '1 kg',
    stock: 50,
    category_id: '1',
    rating: 4.5,
    reviews: 128,
    nutrition: {
      calories: '52 kcal',
      protein: '0.3g',
      carbs: '14g',
      fiber: '2.4g',
      sugar: '10g',
    },
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    price: 45,
    description: 'Freshly baked whole wheat bread made from stone-ground whole wheat flour. High in fiber and perfect for a healthy breakfast.',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    unit: '400 g',
    stock: 20,
    category_id: '2',
    rating: 4.2,
    reviews: 89,
    nutrition: {
      calories: '247 kcal',
      protein: '11g',
      carbs: '41g',
      fiber: '7g',
      sugar: '6g',
    },
  },
  {
    id: '3',
    name: 'Farm Fresh Milk',
    price: 60,
    sale_price: 55,
    description: 'Pure and fresh milk sourced from grass-fed cows. Pasteurized to remove harmful bacteria while preserving nutrients.',
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    unit: '500 ml',
    stock: 30,
    category_id: '2',
    rating: 4.7,
    reviews: 156,
    nutrition: {
      calories: '71 kcal',
      protein: '3.7g',
      carbs: '5g',
      fiber: '0g',
      sugar: '5g',
    },
  },
  {
    id: '4',
    name: 'Organic Tomatoes',
    price: 40,
    description: 'Plump, juicy organic tomatoes rich in lycopene and antioxidants. Perfect for salads, sauces, or cooking.',
    image_url: 'https://images.unsplash.com/photo-1524593166156-312f362cada0',
    unit: '500 g',
    stock: 40,
    category_id: '1',
    rating: 4.3,
    reviews: 102,
    nutrition: {
      calories: '18 kcal',
      protein: '0.9g',
      carbs: '3.9g',
      fiber: '1.2g',
      sugar: '2.6g',
    },
  },
  {
    id: '5',
    name: 'Brown Eggs (6 pcs)',
    price: 70,
    sale_price: 65,
    description: 'Farm fresh brown eggs from free-range hens. Higher in omega-3 fatty acids and vitamin E than conventional eggs.',
    image_url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03',
    unit: '6 pcs',
    stock: 15,
    category_id: '2',
    rating: 4.8,
    reviews: 78,
    nutrition: {
      calories: '70 kcal',
      protein: '6g',
      carbs: '0.6g',
      fiber: '0g',
      sugar: '0.6g',
    },
  },
  {
    id: '6',
    name: 'Ripe Bananas',
    price: 50,
    description: 'Sweet and energy-packed ripe bananas. Great source of potassium and vitamin B6.',
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    unit: '1 dozen',
    stock: 25,
    category_id: '1',
    rating: 4.1,
    reviews: 112,
    nutrition: {
      calories: '89 kcal',
      protein: '1.1g',
      carbs: '22.8g',
      fiber: '2.6g',
      sugar: '12.2g',
    },
  },
];

// GET all products
router.get('/', (req, res) => {
  // Get query params for filtering
  const { category, search, sort } = req.query;
  
  let filteredProducts = [...SAMPLE_PRODUCTS];
  
  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category_id === category);
  }
  
  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      product.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort products
  if (sort) {
    switch (sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        break;
      case 'newest':
        // For demo, just reverse the order
        filteredProducts.reverse();
        break;
      default:
        // No sorting
        break;
    }
  }
  
  res.json(filteredProducts);
});

// GET featured products (products with sale_price)
router.get('/featured', (req, res) => {
  const featuredProducts = SAMPLE_PRODUCTS.filter(product => product.sale_price);
  res.json(featuredProducts);
});

// GET a specific product by ID
router.get('/:id', (req, res) => {
  const product = SAMPLE_PRODUCTS.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

module.exports = router;
// Export sample products for use in other routes
module.exports.SAMPLE_PRODUCTS = SAMPLE_PRODUCTS; 