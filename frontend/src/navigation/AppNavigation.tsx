// @ts-nocheck
import React from 'react';
import { View, TouchableOpacity, Alert, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

// Redux
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import SearchScreen from '../screens/SearchScreen';
import DebugScreen from '../screens/DebugScreen';

// Constants
import { COLORS } from '../utils/constants';

// Types
import { RootState } from '../redux/store';

// Define navigation types
export type RootStackParamList = {
  BottomTabs: undefined;
  ProductDetail: { productId: string };
  ProductList: { categoryId?: string; categoryName?: string; search?: string };
  Search: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  Profile: undefined;
  Debug: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Orders: undefined;
  MoreOptions: undefined;
};

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  const cartItems = useSelector((state: RootState) => state.cart.totalItems);
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.GRAY,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: cartItems > 0 ? cartItems : null,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const AppNavigation = () => {
  // Get auth state from Redux
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated;
  const isLoading = auth?.isLoading;

  console.log("Auth state:", { isAuthenticated, isLoading });

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.WHITE,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: COLORS.BLACK,
        }}
      >
        {isLoading ? (
          // Show splash screen when checking auth
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            options={{ headerShown: false }} 
          />
        ) : !isAuthenticated ? (
          // Show auth screens when not authenticated
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            options={{ headerShown: false }} 
          />
        ) : (
          // Show main app screens when authenticated
          <>
            <Stack.Screen
              name="BottomTabs"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={({ route, navigation }) => ({
                title: '',
                headerLeft: () => (
                  <TouchableOpacity
                    style={{ marginLeft: 15 }}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="ProductList"
              component={ProductListScreen}
              options={({ route, navigation }) => ({
                title: route.params?.categoryName || 'Products',
                headerLeft: () => (
                  <TouchableOpacity
                    style={{ marginLeft: 15 }}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={({ navigation }) => ({
                title: 'Profile',
                headerLeft: () => (
                  <TouchableOpacity
                    style={{ marginLeft: 15 }}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <TouchableOpacity
                    style={{ 
                      marginRight: 15,
                      backgroundColor: COLORS.RED,
                      padding: 8,
                      borderRadius: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                    }}
                    onPress={() => {
                      // Add confirmation alert
                      Alert.alert(
                        'Logout',
                        'Are you sure you want to logout?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { 
                            text: 'Logout',
                            style: 'destructive',
                            onPress: () => {
                              console.log('Logging out from header button');
                              store.dispatch(logout());
                            }
                          }
                        ]
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="log-out-outline" size={22} color={COLORS.WHITE} />
                    <Text style={{ 
                      color: COLORS.WHITE, 
                      marginLeft: 6, 
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>Logout</Text>
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Debug"
              component={DebugScreen}
              options={({ navigation }) => ({
                title: 'Debug',
                headerLeft: () => (
                  <TouchableOpacity
                    style={{ marginLeft: 15 }}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                  </TouchableOpacity>
                ),
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation; 