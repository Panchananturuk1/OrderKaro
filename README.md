# OrderKaro - Grocery Delivery App

OrderKaro is a full-stack mobile application built with React Native and Expo that allows users to browse, order, and get groceries delivered to their doorstep.

![OrderKaro App](https://i.imgur.com/example.png)

## Features

- **User Authentication**: Secure login and registration system
- **Product Browsing**: Browse products by categories with search functionality
- **Product Details**: View detailed product information including pricing, descriptions, and stock status
- **Shopping Cart**: Add items to cart, update quantities, and manage your shopping list
- **Order Management**: Track order status and view order history
- **User Profiles**: Manage delivery addresses and personal information

## Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **Redux Toolkit** - State management
- **React Navigation** - Navigation library
- **Axios** - HTTP client
- **React Native Vector Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication mechanism

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/OrderKaro.git
cd OrderKaro
```

2. Install dependencies for frontend
```bash
cd frontend
npm install --legacy-peer-deps
```

3. Install dependencies for backend
```bash
cd ../backend
npm install
```

4. Start the backend server
```bash
npm start
```

5. Start the frontend Expo development server
```bash
cd ../frontend
npm start
```

6. Run the app on your preferred platform
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

## Project Structure

```
OrderKaro/
├── backend/             # Backend Node.js/Express server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── middlewares/ # Express middlewares
│   │   └── app.js       # Express app setup
│   ├── package.json
│   └── README.md
├── frontend/            # React Native/Expo app
│   ├── assets/          # Images, fonts, etc.
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── navigation/  # Navigation configuration
│   │   ├── redux/       # Redux state management
│   │   ├── screens/     # App screens
│   │   ├── utils/       # Utilities and helpers
│   │   └── App.tsx      # Root component
│   ├── package.json
│   └── app.json         # Expo configuration
└── README.md            # Main project documentation
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `GET /api/products/category/:id` - Get products by category

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order details

## Screenshots

<div style="display: flex; justify-content: space-between;">
  <img src="https://i.imgur.com/example1.png" width="200" alt="Home Screen">
  <img src="https://i.imgur.com/example2.png" width="200" alt="Product Detail">
  <img src="https://i.imgur.com/example3.png" width="200" alt="Cart Screen">
</div>

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/) 