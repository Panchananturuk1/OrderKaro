// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
// import { fetchProducts, setFilter, clearFilters } from '../redux/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import { PRODUCT_CATEGORIES, COLORS } from '../utils/constants';

// Sample data for demo
import { SAMPLE_PRODUCTS } from './HomeScreen';

const sortOptions = [
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest First' },
];

const ProductListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // In a real app, these would come from Redux
  // const { products, isLoading, error, filters } = useSelector(state => state.products);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    // Get categoryId from route params if available
    const categoryId = route.params?.categoryId;
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    
    // Get search query from route params if available
    const search = route.params?.search;
    if (search) {
      setSearchQuery(search);
    }
    
    // Load products
    fetchProductsData();
  }, [route.params]);
  
  useEffect(() => {
    // Update filters and fetch products whenever filters change
    if (selectedCategory || searchQuery || selectedSort) {
      fetchProductsData();
    }
  }, [selectedCategory, searchQuery, selectedSort]);
  
  const fetchProductsData = async () => {
    // In a real app, dispatch the fetchProducts action
    // dispatch(fetchProducts());
    
    // For demo, we'll just use the sample data
    console.log('Fetching products with filters:', {
      category: selectedCategory,
      search: searchQuery,
      sort: selectedSort,
    });
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProductsData();
    setIsRefreshing(false);
  };
  
  const handleSearch = () => {
    fetchProductsData();
  };
  
  const handleCategoryPress = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };
  
  const handleSortPress = (sortId) => {
    if (selectedSort === sortId) {
      setSelectedSort(null);
    } else {
      setSelectedSort(sortId);
    }
  };
  
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSort(null);
    setSearchQuery('');
    // In a real app, dispatch the clearFilters action
    // dispatch(clearFilters());
    fetchProductsData();
  };
  
  // Filter products based on selected category and search query
  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    let matchesCategory = true;
    let matchesSearch = true;
    
    if (selectedCategory) {
      // In a real app, you'd compare with product.category_id
      // For demo, we'll just filter randomly based on product.id
      matchesCategory = parseInt(product.id) % PRODUCT_CATEGORIES.length === (selectedCategory - 1);
    }
    
    if (searchQuery) {
      matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return matchesCategory && matchesSearch;
  });
  
  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!selectedSort) return 0;
    
    const priceA = a.sale_price || a.price;
    const priceB = b.sale_price || b.price;
    
    if (selectedSort === 'price_asc') {
      return priceA - priceB;
    } else if (selectedSort === 'price_desc') {
      return priceB - priceA;
    } else if (selectedSort === 'newest') {
      // In a real app, you'd compare createdAt dates
      // For demo, we'll just sort by id in reverse
      return parseInt(b.id) - parseInt(a.id);
    }
    
    return 0;
  });
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Products</Text>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <FontAwesome name="sliders" size={22} color="#333" />
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
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <FontAwesome name="times-circle" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {PRODUCT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={`category-${category.id}`}
                  style={[
                    styles.filterChip,
                    selectedCategory === category.id && styles.filterChipSelected,
                  ]}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategory === category.id && styles.filterChipTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sortOptions.map((sort) => (
                <TouchableOpacity
                  key={`sort-${sort.id}`}
                  style={[
                    styles.filterChip,
                    selectedSort === sort.id && styles.filterChipSelected,
                  ]}
                  onPress={() => handleSortPress(sort.id)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedSort === sort.id && styles.filterChipTextSelected,
                    ]}
                  >
                    {sort.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {sortedProducts.length} Products Found
        </Text>
      </View>
      
      {/* For demo we're using our filtered data, in a real app we'd use products from Redux */}
      {false ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : sortedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="search" size={60} color="#ddd" />
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>Try changing your search or filters</Text>
        </View>
      ) : (
        <FlatList
          data={sortedProducts}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard product={item} horizontal={true} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 4,
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
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 16,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 16,
  },
  filterChipSelected: {
    backgroundColor: '#4CAF50',
  },
  filterChipText: {
    color: '#333',
    fontSize: 12,
  },
  filterChipTextSelected: {
    color: '#fff',
  },
  clearFiltersButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearFiltersText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  productList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productItem: {
    marginBottom: 16,
  },
});

export default ProductListScreen; 