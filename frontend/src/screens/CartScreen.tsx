// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
// import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import { CURRENCY_SYMBOL, COLORS } from '../utils/constants';

// Sample data for demo
const SAMPLE_CART_ITEMS = [
  {
    id: '1',
    product: {
      id: '1',
      name: 'Fresh Organic Apples',
      price: 120,
      sale_price: 99,
      image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
      unit: '1 kg',
      stock: 50,
    },
    quantity: 2,
  },
  {
    id: '3',
    product: {
      id: '3',
      name: 'Farm Fresh Milk',
      price: 60,
      sale_price: 55,
      image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
      unit: '500 ml',
      stock: 30,
    },
    quantity: 1,
  },
  {
    id: '5',
    product: {
      id: '5',
      name: 'Brown Eggs (6 pcs)',
      price: 70,
      sale_price: 65,
      image_url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03',
      unit: '6 pcs',
      stock: 15,
    },
    quantity: 1,
  },
];

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // In a real app, these would come from Redux
  // const { items, totalAmount, totalItems } = useSelector(state => state.cart);
  const [cartItems, setCartItems] = useState(SAMPLE_CART_ITEMS);
  
  // Calculate totals
  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.product.sale_price || item.product.price) * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleRemoveItem = (productId) => {
    // In a real app, dispatch the removeFromCart action
    // dispatch(removeFromCart(productId));
    
    // For demo, we'll just update the state
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };
  
  const handleUpdateQuantity = (productId, newQuantity) => {
    // Check if new quantity is valid
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    // Get product stock limit
    const item = cartItems.find(item => item.product.id === productId);
    if (item && newQuantity > item.product.stock) {
      Alert.alert('Maximum Stock Reached', `Sorry, we only have ${item.product.stock} units in stock.`);
      return;
    }
    
    // In a real app, dispatch the updateQuantity action
    // dispatch(updateQuantity({ productId, quantity: newQuantity }));
    
    // For demo, we'll just update the state
    setCartItems(
      cartItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // In a real app, dispatch the clearCart action
            // dispatch(clearCart());
            
            // For demo, we'll just update the state
            setCartItems([]);
          },
        },
      ]
    );
  };
  
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before proceeding to checkout.');
      return;
    }
    
    navigation.navigate('Checkout');
  };
  
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.product.image_url }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productUnit}>{item.product.unit}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {CURRENCY_SYMBOL}{item.product.sale_price || item.product.price}
          </Text>
          {item.product.sale_price && (
            <Text style={styles.originalPrice}>
              {CURRENCY_SYMBOL}{item.product.price}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
        >
          <FontAwesome name="minus" size={14} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
        >
          <FontAwesome name="plus" size={14} color="#333" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.product.id)}
      >
        <FontAwesome name="trash" size={18} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        
        {cartItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <FontAwesome name="trash" size={16} color="#999" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="shopping-cart" size={64} color="#ddd" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
          />
          
          <View style={styles.footer}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</Text>
                <Text style={styles.summaryValue}>{CURRENCY_SYMBOL}{totalAmount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>{CURRENCY_SYMBOL}40</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{CURRENCY_SYMBOL}{totalAmount + 40}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleProceedToCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <FontAwesome name="arrow-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productUnit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 2,
    marginRight: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen; 