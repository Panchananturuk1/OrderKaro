import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    image_url: string;
    unit: string;
    stock: number;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: any; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Item already in cart, update quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        state.items.push({
          id: product.id,
          product,
          quantity,
        });
      }

      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.product.sale_price || item.product.price) * item.quantity,
        0
      );
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);

      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.product.sale_price || item.product.price) * item.quantity,
        0
      );
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.product.id === productId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter((item) => item.product.id !== productId);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
        }

        // Update totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce(
          (total, item) => total + (item.product.sale_price || item.product.price) * item.quantity,
          0
        );
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 