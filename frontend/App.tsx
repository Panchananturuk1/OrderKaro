// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import OrdersScreen from './src/screens/OrdersScreen';
// import CheckoutScreen from './src/screens/CheckoutScreen';

// Define types for route parameters
type StackParamList = {
  Login: undefined;
  Main: undefined;
  ProductList: { categoryId?: string; categoryName?: string };
  ProductDetail: { productId: string };
  Checkout: undefined;
};

type TabParamList = {
  Home: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

// Define the PlaceholderScreen with proper type
interface PlaceholderScreenProps {
  route: {
    name: string;
  };
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ route }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>{route.name} Screen</Text>
    <Text>Coming Soon!</Text>
  </View>
);

const Stack = createStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Cart') {
            iconName = 'shopping-cart';
          } else if (route.name === 'Orders') {
            iconName = 'list';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={PlaceholderScreen} />
      <Tab.Screen name="Profile" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

// Create a simple fallback component in case of errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Something went wrong</Text>
          <Text>Please reload the app</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // For demo purposes, we'll skip authentication and show the main app directly
  const isAuthenticated = true;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {!isAuthenticated ? (
                // Auth screens
                <Stack.Screen name="Login" component={LoginScreen} />
              ) : (
                // App screens
                <>
                  <Stack.Screen name="Main" component={MainTabs} />
                  <Stack.Screen 
                    name="ProductList" 
                    component={ProductListScreen}
                    options={{ headerShown: true, title: 'Products' }}
                  />
                  <Stack.Screen 
                    name="ProductDetail" 
                    component={ProductDetailScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="Checkout" 
                    component={PlaceholderScreen}
                    options={{ headerShown: true, title: 'Checkout' }}
                  />
                </>
              )}
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
}); 