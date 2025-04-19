// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Types and Constants
import { RootState } from '../redux/store';
import { COLORS, CURRENCY_SYMBOL } from '../utils/constants';
import { RootStackParamList } from '../navigation/AppNavigation';

// Define props and navigation types
type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Get products from redux store
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Render each product item
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          {CURRENCY_SYMBOL} {item.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.GRAY} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.GRAY} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      ) : error ? (
        <View style={styles.centeredContent}>
          <Text style={styles.errorText}>
            An error occurred while searching products.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // Retry search
              setIsSearching(true);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isSearching && filteredProducts.length === 0 ? (
        <View style={styles.centeredContent}>
          <Ionicons name="search-outline" size={50} color={COLORS.GRAY} />
          <Text style={styles.noResultsText}>
            No products found for "{debouncedQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centeredContent}>
              <Ionicons name="search-outline" size={50} color={COLORS.GRAY} />
              <Text style={styles.searchPromptText}>
                Search for products by name or description
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  productList: {
    padding: 5,
  },
  productItem: {
    flex: 1,
    margin: 5,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.DANGER,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  searchPromptText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
});

export default SearchScreen; 