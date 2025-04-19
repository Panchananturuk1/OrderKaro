// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome, Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { 
  CURRENCY_SYMBOL, 
  COLORS, 
  SCREEN_PADDING, 
  BORDER_RADIUS, 
  API_URL, 
  API_ENDPOINTS, 
  PRODUCT_CATEGORIES,
  APP_NAME 
} from '../utils/constants';
import { addToCart } from '../redux/slices/cartSlice';

// Define types
type RootStackParamList = {
  Cart: undefined;
  ProductDetail: { productId: string };
};

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
  fiber: string;
  sugar: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  image_url: string;
  unit: string;
  stock: number;
  category_id: string;
  rating?: number;
  reviews?: number;
  nutrition: Nutrition;
}

// Sample data for demo
const SAMPLE_PRODUCT: Product = {
  id: '1',
  name: 'Fresh Organic Apples',
  description: 'Delicious, crisp and sweet organic apples sourced directly from local farms. These apples are grown without pesticides or chemical fertilizers, ensuring you get the best quality produce for your family.',
  price: 120,
  sale_price: 99,
  image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
  unit: '1 kg',
  stock: 50,
  category_id: '1',
  rating: 4.5,
  reviews: 128,
  nutrition: {
    calories: '52 kcal',
    protein: '0.3g',
    carbs: '14g',
    fiber: '2.4g',
    sugar: '10g',
  },
};

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  
  const productId = route.params?.productId;
  
  useEffect(() => {
    if (productId) {
      fetchProductData(productId);
    } else {
      // If no product ID, use sample data
      setProduct(SAMPLE_PRODUCT);
      setIsLoading(false);
    }
  }, [productId]);
  
  const fetchProductData = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.PRODUCTS}/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details. Please check your connection and try again.');
      // Use sample data as fallback in development environment
      if (__DEV__) {
        setProduct(SAMPLE_PRODUCT);
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToCart = (): void => {
    if (!product) return;
    
    dispatch(addToCart({ product, quantity }));
    Alert.alert(
      'Added to Cart',
      `${quantity} ${product.name} added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };
  
  const handleShare = async (): Promise<void> => {
    if (!product) return;
    
    try {
      await Share.share({
        message: `Check out ${product.name} on ${APP_NAME}! Only for ${CURRENCY_SYMBOL}${product.sale_price || product.price} per ${product.unit}.`,
        title: product.name,
      });
    } catch (error) {
      console.error('Error sharing product:', error);
      Alert.alert('Share Failed', 'Unable to share this product at the moment.');
    }
  };
  
  const handleChangeQuantity = (value: number): void => {
    if (!product) return;
    
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    } else if (newQuantity > product.stock) {
      Alert.alert('Stock Limit', 'Maximum available stock reached');
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.RED} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchProductData(productId)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const discountPercentage = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100) 
    : 0;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={COLORS.BLACK} />
          </TouchableOpacity>
        </View>
        
        <Image 
          source={{ uri: product.image_url }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        
        {product.sale_price && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {discountPercentage}% OFF
            </Text>
          </View>
        )}
        
        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {product.sale_price 
                ? <Text style={styles.originalPrice}>{CURRENCY_SYMBOL}{product.price}</Text>
                : null
              }
              {CURRENCY_SYMBOL}{product.sale_price || product.price}
              {product.sale_price 
                ? <Text style={styles.discount}> {discountPercentage}% off</Text>
                : null
              }
              <Text style={styles.unit}> / {product.unit}</Text>
            </Text>
          </View>
          
          {/* Ratings Section */}
          {product.rating && (
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star}
                    name={star <= Math.floor(product.rating) ? "star" : star <= product.rating ? "star-half" : "star-outline"} 
                    size={16} 
                    color={COLORS.YELLOW}
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)} ({product.reviews} reviews)
              </Text>
            </View>
          )}
          
          <View style={styles.stockContainer}>
            <Ionicons 
              name={product.stock > 0 ? "checkmark-circle" : "close-circle"} 
              size={16} 
              color={product.stock > 0 ? COLORS.GREEN : COLORS.RED} 
            />
            <Text style={[
              styles.stockText,
              { color: product.stock > 0 ? COLORS.GREEN : COLORS.RED }
            ]}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Nutrition Facts (per 100g)</Text>
          <View style={styles.nutritionContainer}>
            {Object.entries(product.nutrition).map(([key, value]) => (
              <View key={key} style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <Text style={styles.nutritionValue}>{value}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.policyContainer}>
            <View style={styles.policyItem}>
              <Ionicons name="refresh-outline" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.policyText}>Easy Returns</Text>
            </View>
            <View style={styles.policyItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.policyText}>Quality Assured</Text>
            </View>
            <View style={styles.policyItem}>
              <Ionicons name="timer-outline" size={24} color={COLORS.PRIMARY} />
              <Text style={styles.policyText}>Fast Delivery</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footerContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
            onPress={() => handleChangeQuantity(-1)}
            disabled={quantity <= 1}
          >
            <Ionicons name="remove" size={20} color={quantity <= 1 ? COLORS.LIGHT_GRAY : COLORS.BLACK} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={[styles.quantityButton, quantity >= product.stock && styles.quantityButtonDisabled]}
            onPress={() => handleChangeQuantity(1)}
            disabled={quantity >= product.stock}
          >
            <Ionicons name="add" size={20} color={quantity >= product.stock ? COLORS.LIGHT_GRAY : COLORS.BLACK} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (product.stock === 0 || isLoading) && styles.disabledButton
          ]}
          disabled={product.stock === 0 || isLoading}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>
            {isLoading ? 'Loading...' : product.stock === 0 ? 'Out of Stock' : `Add to Cart - ${CURRENCY_SYMBOL}${product.sale_price || product.price}`}
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SCREEN_PADDING,
    backgroundColor: COLORS.WHITE,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS,
    marginTop: 16,
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SCREEN_PADDING,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.RED,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: SCREEN_PADDING,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginTop: 8,
  },
  unit: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.GRAY,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discount: {
    fontSize: 14,
    color: COLORS.GREEN,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockText: {
    fontSize: 14,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.LIGHTER_GRAY,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.GRAY,
    lineHeight: 22,
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nutritionItem: {
    width: '33%',
    marginBottom: 12,
  },
  nutritionLabel: {
    fontSize: 12,
    color: COLORS.LIGHT_GRAY,
    marginBottom: 2,
  },
  nutritionValue: {
    fontSize: 14,
    color: COLORS.BLACK,
    fontWeight: '500',
  },
  policyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  policyItem: {
    alignItems: 'center',
  },
  policyText: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 4,
  },
  footerContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHTER_GRAY,
    padding: SCREEN_PADDING,
    backgroundColor: COLORS.WHITE,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.LIGHTER_GRAY,
    borderRadius: BORDER_RADIUS,
    padding: 4,
    marginRight: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.LIGHTER_GRAY,
  },
  quantityButtonDisabled: {
    backgroundColor: COLORS.LIGHTER_GRAY,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
  },
  addToCartButton: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  addToCartText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;