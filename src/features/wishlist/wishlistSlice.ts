import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Product } from "@/types/product";
import type { WishlistItem } from "./types/wishlist";

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export const selectWishlistItems = (state: {
  wishlist: WishlistState;
}) => state.wishlist.items;

export default wishlistSlice.reducer;