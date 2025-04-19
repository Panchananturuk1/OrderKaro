import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SCREEN_PADDING, BORDER_RADIUS, CURRENCY_SYMBOL } from '../utils/constants';

// Sample order data
const SAMPLE_ORDERS = [
  {
    id: 'ORD1234567',
    date: '15 Oct 2023',
    time: '10:45 AM',
    total: 456.50,
    items: 4,
    status: 'Delivered',
    deliveredAt: '15 Oct 2023, 11:30 AM',
    restaurant: {
      name: 'Fresh Grocery Store',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000',
    },
  },
  {
    id: 'ORD9876543',
    date: '12 Oct 2023',
    time: '8:20 PM',
    total: 325.75,
    items: 3,
    status: 'Delivered',
    deliveredAt: '12 Oct 2023, 9:10 PM',
    restaurant: {
      name: 'Organic Fruits Mart',
      image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?q=80&w=1000',
    },
  },
  {
    id: 'ORD5432167',
    date: '8 Oct 2023',
    time: '1:15 PM',
    total: 620.00,
    items: 6,
    status: 'Cancelled',
    cancellationReason: 'Customer requested cancellation',
    restaurant: {
      name: 'Daily Essentials',
      image: 'https://images.unsplash.com/photo-1626200926828-044a7dee7926?q=80&w=1000',
    },
  },
  {
    id: 'ORD7654321',
    date: '1 Oct 2023',
    time: '11:30 AM',
    total: 245.25,
    items: 2,
    status: 'Delivered',
    deliveredAt: '1 Oct 2023, 12:10 PM',
    restaurant: {
      name: 'Farm Fresh Market',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000',
    },
  },
];

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  // Simulating API call to fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOrders(SAMPLE_ORDERS);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getFilteredOrders = () => {
    if (activeTab === 'All') {
      return orders;
    }
    return orders.filter(order => order.status === activeTab);
  };

  const navigateToOrderDetails = (orderId) => {
    // In a real app, navigate to order details screen
    console.log('Navigate to order details for order:', orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return COLORS.GREEN;
      case 'Cancelled':
        return COLORS.RED;
      case 'Processing':
        return COLORS.ORANGE;
      default:
        return COLORS.PRIMARY;
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigateToOrderDetails(item.id)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.restaurantInfo}>
          <Image source={{ uri: item.restaurant.image }} style={styles.restaurantImage} />
          <View>
            <Text style={styles.restaurantName}>{item.restaurant.name}</Text>
            <Text style={styles.orderDate}>{item.date} • {item.time}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderDivider} />
      
      <View style={styles.orderDetails}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoLabel}>Order ID</Text>
          <Text style={styles.orderInfoValue}>{item.id}</Text>
        </View>
        
        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoLabel}>Items</Text>
          <Text style={styles.orderInfoValue}>{item.items} items</Text>
        </View>
        
        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoLabel}>Total Amount</Text>
          <Text style={styles.orderInfoValue}>{CURRENCY_SYMBOL}{item.total.toFixed(2)}</Text>
        </View>
      </View>
      
      {item.status === 'Delivered' && (
        <View style={styles.deliveryInfo}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.GREEN} />
          <Text style={styles.deliveryInfoText}>Delivered on {item.deliveredAt}</Text>
        </View>
      )}
      
      {item.status === 'Cancelled' && (
        <View style={styles.deliveryInfo}>
          <Ionicons name="close-circle" size={16} color={COLORS.RED} />
          <Text style={styles.deliveryInfoText}>{item.cancellationReason}</Text>
        </View>
      )}
      
      <View style={styles.orderActions}>
        <TouchableOpacity style={styles.orderAction}>
          <Ionicons name="receipt-outline" size={16} color={COLORS.PRIMARY} />
          <Text style={styles.orderActionText}>View Details</Text>
        </TouchableOpacity>
        
        {item.status === 'Delivered' && (
          <TouchableOpacity style={styles.orderAction}>
            <Ionicons name="repeat" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.orderActionText}>Reorder</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.orderAction}>
          <Ionicons name="help-circle-outline" size={16} color={COLORS.PRIMARY} />
          <Text style={styles.orderActionText}>Help</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={80} color={COLORS.LIGHT_GRAY} />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyMessage}>
        Looks like you haven't placed any orders yet. Browse our products and place your first order!
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholderView} />
      </View>
      
      <View style={styles.tabContainer}>
        {['All', 'Delivered', 'Cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  placeholderView: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY + '50',
    backgroundColor: COLORS.WHITE,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY + '10',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  ordersList: {
    padding: SCREEN_PADDING,
    backgroundColor: COLORS.LIGHT_GRAY + '10',
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDivider: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GRAY + '50',
    marginVertical: 12,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderInfoLabel: {
    fontSize: 13,
    color: COLORS.GRAY,
  },
  orderInfoValue: {
    fontSize: 13,
    color: COLORS.BLACK,
    fontWeight: '500',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY + '30',
  },
  deliveryInfoText: {
    fontSize: 12,
    color: COLORS.DARK_GRAY,
    marginLeft: 6,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.LIGHT_GRAY + '20',
    borderRadius: 4,
  },
  orderActionText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
  },
  browseButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrdersScreen; 