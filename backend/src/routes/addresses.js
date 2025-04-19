const express = require('express');
const router = express.Router();

// Sample addresses data for development
const USER_ADDRESSES = {
  'dev-user-id': [
    {
      id: '1',
      name: 'Home',
      full_name: 'Test User',
      phone: '9876543210',
      address_line1: '123 Main Street',
      address_line2: 'Apartment 4B',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560001',
      country: 'India',
      is_default: true
    }
  ]
};

// GET /api/addresses - Get user's addresses
router.get('/', (req, res) => {
  const userId = req.user.id;
  
  // Get user's addresses or return empty array if not found
  const addresses = USER_ADDRESSES[userId] || [];
  
  res.json(addresses);
});

// POST /api/addresses - Add a new address
router.post('/', (req, res) => {
  const userId = req.user.id;
  const { name, full_name, phone, address_line1, city, state, postal_code, address_line2, is_default } = req.body;
  
  // Basic validation
  if (!name || !full_name || !phone || !address_line1 || !city || !state || !postal_code) {
    return res.status(400).json({ message: 'Required address fields are missing' });
  }
  
  // Initialize user's addresses if not exists
  if (!USER_ADDRESSES[userId]) {
    USER_ADDRESSES[userId] = [];
  }
  
  // Create new address
  const newAddress = {
    id: Date.now().toString(),
    name,
    full_name,
    phone,
    address_line1,
    address_line2: address_line2 || '',
    city,
    state,
    postal_code,
    country: 'India', // Default for now
    is_default: is_default || false
  };
  
  // If this is the first address or is_default is true, set all other addresses to not default
  if (is_default || USER_ADDRESSES[userId].length === 0) {
    USER_ADDRESSES[userId].forEach(address => {
      address.is_default = false;
    });
    newAddress.is_default = true;
  }
  
  // Add to addresses
  USER_ADDRESSES[userId].push(newAddress);
  
  res.status(201).json(newAddress);
});

// PUT /api/addresses/:id - Update an address
router.put('/:id', (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;
  
  // Check if user has addresses
  if (!USER_ADDRESSES[userId]) {
    return res.status(404).json({ message: 'No addresses found' });
  }
  
  // Find the address
  const addressIndex = USER_ADDRESSES[userId].findIndex(addr => addr.id === addressId);
  
  if (addressIndex === -1) {
    return res.status(404).json({ message: 'Address not found' });
  }
  
  // Update the address
  const updatedAddress = {
    ...USER_ADDRESSES[userId][addressIndex],
    ...req.body,
    id: addressId // Ensure ID doesn't change
  };
  
  // If setting as default, update other addresses
  if (updatedAddress.is_default) {
    USER_ADDRESSES[userId].forEach(address => {
      if (address.id !== addressId) {
        address.is_default = false;
      }
    });
  }
  
  USER_ADDRESSES[userId][addressIndex] = updatedAddress;
  
  res.json(updatedAddress);
});

// DELETE /api/addresses/:id - Delete an address
router.delete('/:id', (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;
  
  // Check if user has addresses
  if (!USER_ADDRESSES[userId]) {
    return res.status(404).json({ message: 'No addresses found' });
  }
  
  // Find the address
  const addressIndex = USER_ADDRESSES[userId].findIndex(addr => addr.id === addressId);
  
  if (addressIndex === -1) {
    return res.status(404).json({ message: 'Address not found' });
  }
  
  // Check if it's the default address
  const isDefault = USER_ADDRESSES[userId][addressIndex].is_default;
  
  // Remove the address
  USER_ADDRESSES[userId] = USER_ADDRESSES[userId].filter(addr => addr.id !== addressId);
  
  // If it was default and there are other addresses, make another one default
  if (isDefault && USER_ADDRESSES[userId].length > 0) {
    USER_ADDRESSES[userId][0].is_default = true;
  }
  
  res.json({ message: 'Address deleted successfully' });
});

module.exports = router; 