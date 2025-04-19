// @ts-nocheck
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
// import { fetchCategories, fetchFeaturedProducts } from '../redux/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import { PRODUCT_CATEGORIES, COLORS } from '../utils/constants';

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

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // In a real app, these would come from Redux
  // const { categories, featuredProducts, isLoading } = useSelector(state => state.products);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const renderCategoryItem = ({ item }) => {
    // Map Ionicons to FontAwesome icons
    const getIconName = (iconName) => {
      const iconMap = {
        'leaf': 'leaf',
        'cafe': 'coffee',
        'basket': 'shopping-basket',
        'fast-food': 'cutlery',
        'home': 'home',
        'fitness': 'heartbeat'
      };
      return iconMap[iconName] || 'tag';
    };

    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => navigation.navigate('ProductList', { categoryId: item.id })}
      >
        <View style={styles.categoryIcon}>
          <FontAwesome name={getIconName(item.icon)} size={24} color={COLORS.PRIMARY} />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderDealItem = ({ item }) => (
    <View style={styles.dealItem}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.dealImage}
        resizeMode="cover"
      />
      <View style={styles.dealBadge}>
        <Text style={styles.dealBadgeText}>
          {Math.round(((item.price - item.sale_price) / item.price) * 100)}% OFF
        </Text>
      </View>
      <View style={styles.dealContent}>
        <Text style={styles.dealTitle}>{item.name}</Text>
        <TouchableOpacity
          style={styles.dealButton}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
          <Text style={styles.dealButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={18} color="#333" />
          <Text style={styles.locationText}>Deliver to: Home</Text>
          <FontAwesome name="chevron-down" size={14} color="#333" />
        </View>
        
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <FontAwesome name="shopping-cart" size={22} color="#333" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>
      
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
              <Text style={styles.sectionLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={PRODUCT_CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        {/* Deals Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Deals</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={SAMPLE_PRODUCTS.filter(p => p.sale_price)}
            renderItem={renderDealItem}
            keyExtractor={item => `deal-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsList}
          />
        </View>
        
        {/* Popular Products Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGrid}>
            {SAMPLE_PRODUCTS.map(product => (
              <View key={`product-${product.id}`} style={styles.productItem}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    marginRight: 4,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  cartButton: {
    position: 'relative',
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionLink: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  categoriesList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  dealsList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  dealItem: {
    width: 280,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  dealBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dealBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dealContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
  },
  dealTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dealButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  dealButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  productItem: {
    width: '50%',
    padding: 8,
  },
});

export default HomeScreen;