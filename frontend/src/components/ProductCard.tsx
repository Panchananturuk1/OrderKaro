// @ts-nocheck
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { CURRENCY_SYMBOL, COLORS } from '../utils/constants';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    image_url: string;
    unit: string;
    stock: number;
  };
  horizontal?: boolean;
}

const ProductCard = ({ product, horizontal = false }: ProductCardProps) => {
  const navigation = useNavigation();
  
  const handleProductPress = () => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };
  
  const handleAddToCart = () => {
    // Simplified cart handling without AsyncStorage
    console.log('Added to cart:', product.name);
    
    // Show a simple alert instead
    Alert.alert(
      'Added to Cart',
      `${product.name} has been added to your cart.`,
      [{ text: 'OK' }]
    );
  };
  
  if (horizontal) {
    return (
      <TouchableOpacity 
        style={styles.horizontalContainer}
        onPress={handleProductPress}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: product.image_url }} 
          style={styles.horizontalImage} 
          resizeMode="cover"
        />
        
        <View style={styles.horizontalContentContainer}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.unit}>{product.unit}</Text>
          
          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {CURRENCY_SYMBOL}{product.sale_price || product.price}
              </Text>
              {product.sale_price && (
                <Text style={styles.originalPrice}>
                  {CURRENCY_SYMBOL}{product.price}
                </Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddToCart}
            >
              <FontAwesome name="plus" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {product.sale_price && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleProductPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.image_url }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {product.sale_price && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((product.price - product.sale_price) / product.price) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.unit}>{product.unit}</Text>
        
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {CURRENCY_SYMBOL}{product.sale_price || product.price}
            </Text>
            {product.sale_price && (
              <Text style={styles.originalPrice}>
                {CURRENCY_SYMBOL}{product.price}
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <FontAwesome name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  horizontalContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  horizontalImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  contentContainer: {
    padding: 10,
  },
  horizontalContentContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'column',
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
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.RED,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ProductCard; 