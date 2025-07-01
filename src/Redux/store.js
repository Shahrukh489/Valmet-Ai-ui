// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Create the Redux store
const store = configureStore({
  reducer: {
    // Include your shopping cart reducer in the store
    cart: cartReducer,
    // You can include other reducers here if you have them
    // For example:
    // otherFeature: otherFeatureReducer,
  },
});

export default store;
