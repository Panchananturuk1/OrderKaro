-- Insert Categories
INSERT INTO public.categories (id, name, icon, image_url)
VALUES
  ('1a11c9dc-b35a-4b53-a5d5-3a721a4163ce', 'Fruits & Vegetables', 'leaf', 'https://images.unsplash.com/photo-1610348725531-843dff563e2c'),
  ('2b12c7ff-b55a-4b53-a5d5-4b842a1164df', 'Dairy & Breakfast', 'cafe', 'https://images.unsplash.com/photo-1544681280-d2bd526abddb'),
  ('3c13d8ee-c65a-4b53-a5d5-5c963b2165ef', 'Staples', 'basket', 'https://images.unsplash.com/photo-1608897013039-887f21d8c804'),
  ('4d14f9dd-d75a-4b53-a5d5-6d184c5166f0', 'Snacks & Beverages', 'fast-food', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba'),
  ('5e25e0cc-e85a-4b53-a5d5-7e3a7d5267a1', 'Cleaning & Household', 'home', 'https://images.unsplash.com/photo-1563453392212-326f5e854473'),
  ('6f36f1bb-f95a-4b53-a5d5-8f4b9e6368b2', 'Beauty & Hygiene', 'fitness', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348');

-- Insert Products
INSERT INTO public.products (id, name, description, price, sale_price, image_url, unit, stock, category_id, rating)
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-87c8-1a2b3c4d5e6f', 
    'Fresh Organic Apples', 
    'Delicious, crisp and sweet organic apples sourced directly from local farms. These apples are grown without pesticides or chemical fertilizers, ensuring you get the best quality produce for your family.',
    120.00,
    99.00,
    'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
    '1 kg',
    50,
    '1a11c9dc-b35a-4b53-a5d5-3a721a4163ce',
    4.5
  ),
  (
    'b2c3d4e5-f6a7-5b6c-98d9-2b3c4d5e6f7a', 
    'Fresh Banana', 
    'Farm-fresh bananas that are perfectly ripened. Rich in potassium and vitamins, these bananas make a perfect snack or addition to your breakfast.',
    60.00,
    NULL,
    'https://images.unsplash.com/photo-1603833665858-e61d17a86224',
    '1 dozen',
    100,
    '1a11c9dc-b35a-4b53-a5d5-3a721a4163ce',
    4.3
  ),
  (
    'c3d4e5f6-a7b8-6c7d-0e9f-3c4d5e6f7a8b', 
    'Organic Strawberries', 
    'Sweet and juicy organic strawberries. These vibrant red berries are perfect for desserts, smoothies, or just eating fresh.',
    180.00,
    150.00,
    'https://images.unsplash.com/photo-1518635017498-87f514b751ba',
    '250 g',
    30,
    '1a11c9dc-b35a-4b53-a5d5-3a721a4163ce',
    4.7
  ),
  (
    'd4e5f6a7-b8c9-7d8e-1f0a-4d5e6f7a8b9c', 
    'Fresh Milk', 
    'Farm-fresh whole milk. Pasteurized and packed with essential nutrients, this milk is a daily essential for a healthy diet.',
    70.00,
    65.00,
    'https://images.unsplash.com/photo-1563636619-e9143da7973b',
    '1 liter',
    80,
    '2b12c7ff-b55a-4b53-a5d5-4b842a1164df',
    4.4
  ),
  (
    'e5f6a7b8-c9d0-8e9f-2a1b-5e6f7a8b9c0d', 
    'Brown Eggs', 
    'Farm-fresh brown eggs from free-range chickens. These eggs are packed with protein and have a rich, delicious taste.',
    90.00,
    NULL,
    'https://images.unsplash.com/photo-1506976785307-8732e854ad03',
    '6 pieces',
    60,
    '2b12c7ff-b55a-4b53-a5d5-4b842a1164df',
    4.6
  ),
  (
    'f6a7b8c9-d0e1-9f0a-3b2c-6f7a8b9c0d1e', 
    'Whole Wheat Bread', 
    'Freshly baked whole wheat bread. Made with 100% whole wheat flour, this bread is nutritious and delicious.',
    45.00,
    40.00,
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    '400 g',
    40,
    '2b12c7ff-b55a-4b53-a5d5-4b842a1164df',
    4.2
  ),
  (
    'a7b8c9d0-e1f2-0a1b-4c3d-7a8b9c0d1e2f', 
    'Basmati Rice', 
    'Premium quality basmati rice. Known for its aromatic fragrance and long grains, this rice is perfect for biryani and pulao.',
    250.00,
    220.00,
    'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6',
    '5 kg',
    70,
    '3c13d8ee-c65a-4b53-a5d5-5c963b2165ef',
    4.8
  ),
  (
    'b8c9d0e1-f2a3-1b2c-5d4e-8b9c0d1e2f3a', 
    'Toor Dal', 
    'High-quality toor dal. This protein-rich lentil is a staple in Indian households and is perfect for making dal and soups.',
    130.00,
    NULL,
    'https://images.unsplash.com/photo-1565275602002-516ddb0035cc',
    '1 kg',
    90,
    '3c13d8ee-c65a-4b53-a5d5-5c963b2165ef',
    4.5
  ),
  (
    'c9d0e1f2-a3b4-2c3d-6e5f-9c0d1e2f3a4b', 
    'Chocolate Chip Cookies', 
    'Delicious chocolate chip cookies. These crunchy cookies with generous chunks of chocolate are perfect for snacking.',
    85.00,
    75.00,
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    '200 g',
    40,
    '4d14f9dd-d75a-4b53-a5d5-6d184c5166f0',
    4.3
  ),
  (
    'd0e1f2a3-b4c5-3d4e-7f6a-0d1e2f3a4b5c', 
    'Cola Drink', 
    'Refreshing cola drink. This fizzy beverage is perfect for quenching your thirst on a hot day.',
    35.00,
    30.00,
    'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    '500 ml',
    120,
    '4d14f9dd-d75a-4b53-a5d5-6d184c5166f0',
    4.0
  ),
  (
    'e1f2a3b4-c5d6-4e5f-8a7b-1e2f3a4b5c6d', 
    'Dish Washing Liquid', 
    'Effective dish washing liquid. This concentrated formula cuts through grease and leaves your dishes sparkling clean.',
    110.00,
    95.00,
    'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce',
    '750 ml',
    60,
    '5e25e0cc-e85a-4b53-a5d5-7e3a7d5267a1',
    4.4
  ),
  (
    'f2a3b4c5-d6e7-5f6a-9b0c-2f3a4b5c6d7e', 
    'Toilet Cleaner', 
    'Powerful toilet cleaner. This formula effectively removes stains and kills germs, leaving your toilet clean and fresh.',
    85.00,
    NULL,
    'https://images.unsplash.com/photo-1610557892879-f7e534b6a8b4',
    '500 ml',
    50,
    '5e25e0cc-e85a-4b53-a5d5-7e3a7d5267a1',
    4.2
  ),
  (
    'a3b4c5d6-e7f8-6a7b-0c1d-3a4b5c6d7e8f', 
    'Shampoo', 
    'Nourishing shampoo for all hair types. This gentle formula cleanses and moisturizes your hair, leaving it soft and manageable.',
    150.00,
    130.00,
    'https://images.unsplash.com/photo-1515683359900-6170e68a2a2b',
    '250 ml',
    70,
    '6f36f1bb-f95a-4b53-a5d5-8f4b9e6368b2',
    4.6
  ),
  (
    'b4c5d6e7-f8a9-7b8c-1d2e-4b5c6d7e8f9a', 
    'Toothpaste', 
    'Refreshing mint toothpaste. This fluoride formula fights cavities and keeps your breath fresh all day.',
    60.00,
    55.00,
    'https://images.unsplash.com/photo-1574866442784-089a6630887b',
    '100 g',
    90,
    '6f36f1bb-f95a-4b53-a5d5-8f4b9e6368b2',
    4.3
  );

-- Create a demo user (only for testing, real users will sign up through the app)
-- Note: In production, you would never insert users directly, they would be created through auth.sign_up
INSERT INTO auth.users (id, email, email_confirmed_at, phone, created_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, aud, confirmation_token, recovery_token)
VALUES (
  '9c6e1d4b-8f2a-4e6c-a9d2-3b5f7c8e1a9b',
  'demo@example.com',
  NOW(),
  NULL,
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Demo User"}',
  'authenticated',
  '',
  ''
) ON CONFLICT DO NOTHING;

-- Insert the user profile
INSERT INTO public.users (id, email, name, phone, avatar_url)
VALUES (
  '9c6e1d4b-8f2a-4e6c-a9d2-3b5f7c8e1a9b',
  'demo@example.com',
  'Demo User',
  '+1 (555) 123-4567',
  'https://randomuser.me/api/portraits/men/32.jpg'
) ON CONFLICT DO NOTHING;

-- Insert addresses for the demo user
INSERT INTO public.addresses (id, user_id, type, address, city, state, postal_code, is_default)
VALUES
  (
    'acd42c3e-8a5b-4c2d-9d8e-7f6a5b4c3d2e',
    '9c6e1d4b-8f2a-4e6c-a9d2-3b5f7c8e1a9b',
    'Home',
    '123 Main Street, Apt 4B',
    'New York',
    'NY',
    '10001',
    true
  ),
  (
    'bde53d4f-9b6c-5d3e-0e9f-8a7b6c5d4e3f',
    '9c6e1d4b-8f2a-4e6c-a9d2-3b5f7c8e1a9b',
    'Work',
    '456 Business Ave, Suite 100',
    'New York',
    'NY',
    '10002',
    false
  ); 