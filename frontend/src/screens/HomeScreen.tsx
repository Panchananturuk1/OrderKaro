// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
// import { fetchCategories, fetchFeaturedProducts } from '../redux/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import { PRODUCT_CATEGORIES, COLORS, SCREEN_PADDING, BORDER_RADIUS } from '../utils/constants';
import { logout } from '../redux/slices/authSlice';

const { width } = Dimensions.get('window');

// Temporary sample data for demo
export const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Organic Apples',
    price: 120,
    sale_price: 99,
    image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
    unit: '1 kg',
    stock: 50,
  },
  {
    id: '2',
    name: 'Whole Wheat Bread',
    price: 45,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    unit: '400 g',
    stock: 20,
  },
  {
    id: '3',
    name: 'Farm Fresh Milk',
    price: 60,
    sale_price: 55,
    image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150',
    unit: '500 ml',
    stock: 30,
  },
  {
    id: '4',
    name: 'Organic Tomatoes',
    price: 40,
    image_url: 'https://images.unsplash.com/photo-1524593166156-312f362cada0',
    unit: '500 g',
    stock: 40,
  },
  {
    id: '5',
    name: 'Brown Eggs (6 pcs)',
    price: 70,
    sale_price: 65,
    image_url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03',
    unit: '6 pcs',
    stock: 15,
  },
  {
    id: '6',
    name: 'Ripe Bananas',
    price: 50,
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e',
    unit: '1 dozen',
    stock: 25,
  },
];

// Dummy banner data
const banners = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000',
    title: 'Fresh Vegetables',
    subtitle: 'Up to 30% off on all vegetables'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?q=80&w=1000',
    title: 'Exotic Fruits',
    subtitle: 'Freshly imported from around the world'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1626200926828-044a7dee7926?q=80&w=1000',
    title: 'Daily Essentials',
    subtitle: 'Fast delivery within 2 hours'
  },
];

// Popular products data
const popularProducts = [
  {
    id: '1',
    name: 'Fresh Organic Apples',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
    price: 120,
    salePrice: 99,
    unit: '1 kg',
    rating: 4.7,
  },
  {
    id: '2',
    name: 'Farm Fresh Eggs',
    image: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05',
    price: 80,
    unit: '12 pcs',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Whole Wheat Bread',
    image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef',
    price: 45,
    unit: '500 g',
    rating: 4.5,
  },
  {
    id: '4',
    name: 'Avocado',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
    price: 90,
    salePrice: 75,
    unit: '1 pc',
    rating: 4.9,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // In a real app, these would come from Redux
  // const { categories, featuredProducts, isLoading } = useSelector(state => state.products);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Load initial data
    loadData();
  }, []);

  const loadData = async () => {
    // In a real app, dispatch actions to fetch data
    // dispatch(fetchCategories());
    // dispatch(fetchFeaturedProducts());
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleSearch = () => {
    navigation.navigate('ProductList', { search: searchQuery });
  };

  // Auto-scroll for banners
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollViewRef.current && banners.length > 1) {
        const nextSlide = (activeSlide + 1) % banners.length;
        // FlatList doesn't have scrollTo directly, use scrollToOffset instead
        scrollViewRef.current.scrollToOffset({
          offset: nextSlide * width,
          animated: true
        });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [activeSlide]);

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    if (slideIndex !== activeSlide) {
      setActiveSlide(slideIndex);
    }
  };

  const navigateToProductList = (categoryId, categoryName) => {
    navigation.navigate('ProductList', { categoryId, categoryName });
  };

  const navigateToProductDetail = (productId) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };
  
  const handleLogout = () => {
    setShowProfileMenu(false);
    dispatch(logout());
  };

  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  const renderBanner = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.bannerContainer}
      activeOpacity={0.9}
      onPress={() => navigateToProductList(index + 1, item.title)}
    >
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => navigateToProductList(item.id, item.name)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPopularProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigateToProductDetail(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productUnit}>{item.unit}</Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>
            ₹{item.salePrice || item.price}
          </Text>
          {item.salePrice && (
            <Text style={styles.productOriginalPrice}>₹{item.price}</Text>
          )}
        </View>
        <View style={styles.productRatingRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating} ★</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={18} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={22} color={COLORS.PRIMARY} />
          <Text style={styles.locationText} numberOfLines={1}>
            Home • 123 Main Street, City
          </Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.BLACK} />
        </View>
        
        <View>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => setShowProfileMenu(!showProfileMenu)}
          >
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Profile dropdown modal */}
      <Modal
        transparent={true}
        visible={showProfileMenu}
        animationType="fade"
        onRequestClose={closeProfileMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeProfileMenu}
        >
          <View style={[styles.profileMenu, {position: 'absolute', top: 70, right: 15}]}>
            <TouchableOpacity 
              style={styles.profileMenuItem}
              onPress={() => {
                closeProfileMenu();
                navigateToProfile();
              }}
            >
              <Ionicons name="person-outline" size={20} color={COLORS.BLACK} />
              <Text style={styles.profileMenuItemText}>My Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutMenuItem}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.WHITE} />
              <Text style={styles.logoutMenuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.GRAY} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for groceries, vegetables, fruits..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.GRAY} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Banner Slider */}
        <View style={styles.bannerSliderContainer}>
          <FlatList
            ref={scrollViewRef}
            data={banners}
            renderItem={renderBanner}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
          
          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { opacity: index === activeSlide ? 1 : 0.5 }
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* Categories */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={PRODUCT_CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>
        
        {/* Quick links */}
        <View style={styles.quickLinksContainer}>
          <TouchableOpacity style={styles.quickLinkItem}>
            <View style={[styles.quickLinkIcon, { backgroundColor: '#FFE0B2' }]}>
              <Ionicons name="flash" size={18} color="#FF9800" />
            </View>
            <Text style={styles.quickLinkText}>Express Delivery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickLinkItem}>
            <View style={[styles.quickLinkIcon, { backgroundColor: '#BBDEFB' }]}>
              <Ionicons name="wallet" size={18} color="#2196F3" />
            </View>
            <Text style={styles.quickLinkText}>Best Offers</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickLinkItem}>
            <View style={[styles.quickLinkIcon, { backgroundColor: '#DCEDC8' }]}>
              <Ionicons name="repeat" size={18} color="#8BC34A" />
            </View>
            <Text style={styles.quickLinkText}>Subscribe & Save</Text>
          </TouchableOpacity>
        </View>
        
        {/* Popular Products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularProducts}
            renderItem={renderPopularProduct}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          />
        </View>
        
        {/* Today's Deals */}
        <View style={styles.dealsContainer}>
          <Text style={styles.dealsTitle}>TODAY'S SPECIAL DEALS</Text>
          <View style={styles.dealRow}>
            <TouchableOpacity style={styles.dealCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5' }} 
                style={styles.dealImage} 
              />
              <View style={styles.dealBadge}>
                <Text style={styles.dealBadgeText}>40% OFF</Text>
              </View>
              <View style={styles.dealInfo}>
                <Text style={styles.dealName}>Dairy Products</Text>
                <Text style={styles.dealDescription}>Fresh from the farm</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dealCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf' }} 
                style={styles.dealImage} 
              />
              <View style={styles.dealBadge}>
                <Text style={styles.dealBadgeText}>BUY 1 GET 1</Text>
              </View>
              <View style={styles.dealInfo}>
                <Text style={styles.dealName}>Breakfast Items</Text>
                <Text style={styles.dealDescription}>Start your day right</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Space at the bottom */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.BLACK,
    marginLeft: 4,
    marginRight: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchBarContainer: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 12,
    backgroundColor: COLORS.WHITE,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY + '30',
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    height: '100%',
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: SCREEN_PADDING,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingRight: SCREEN_PADDING,
  },
  categoryItem: {
    width: 80,
    marginRight: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.DARK_GRAY,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: SCREEN_PADDING,
    padding: 12,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickLinkItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickLinkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickLinkText: {
    fontSize: 12,
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  productsContainer: {
    paddingRight: SCREEN_PADDING,
  },
  productCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.BLACK,
    marginBottom: 2,
  },
  productUnit: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginBottom: 4,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  productOriginalPrice: {
    fontSize: 14,
    color: COLORS.GRAY,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  productRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    backgroundColor: COLORS.GREEN,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  addButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealsContainer: {
    marginTop: 24,
    marginHorizontal: SCREEN_PADDING,
  },
  dealsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.DARK_GRAY,
    marginBottom: 12,
  },
  dealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dealCard: {
    width: (width - (SCREEN_PADDING * 2) - 12) / 2,
    height: 180,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  dealBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.RED,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  dealBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  dealInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  dealDescription: {
    fontSize: 12,
    color: COLORS.WHITE,
    opacity: 0.8,
  },
  bottomSpace: {
    height: 100,
  },
  bannerSliderContainer: {
    height: 180,
    position: 'relative',
  },
  bannerContainer: {
    width: width,
    height: 180,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileMenu: {
    width: 160,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHTER_GRAY,
  },
  profileMenuItemText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  logoutMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.RED,
  },
  logoutMenuItemText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.WHITE,
  },
});

export default HomeScreen;