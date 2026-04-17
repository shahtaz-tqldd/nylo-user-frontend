import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fallbackStoreConfig,
  type StoreConfig,
  type StoreConfigState,
} from "./types";

const initialState: StoreConfigState = {
  config: fallbackStoreConfig,
  isLoading: true,
  hasRemoteConfig: false,
  errorMessage: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    storeConfigReceived: (state, action: PayloadAction<StoreConfig>) => {
      state.config = {
        ...fallbackStoreConfig,
        ...action.payload,
      };
      state.isLoading = false;
      state.hasRemoteConfig = true;
      state.errorMessage = null;
    },
    storeConfigFailed: (state, action: PayloadAction<string | null>) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
  },
});

export const { storeConfigReceived, storeConfigFailed } = storeSlice.actions;

export default storeSlice.reducer;
