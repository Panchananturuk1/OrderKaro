// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Auth Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddressManagementScreen from '../screens/AddressManagementScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ headerShown: true }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderHistoryScreen} 
        options={{ headerShown: true }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: true }}
      />
    </Tab.Navigator>
  );
};

// Auth navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main application navigator
const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  // In a real app, you would get this from Redux
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate splash screen
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Check authentication status
    // This would come from your Redux store in a real app
  }, []);

  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ headerShown: true }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true }} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: true }} />
      <Stack.Screen name="AddressManagement" component={AddressManagementScreen} options={{ headerShown: true }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 