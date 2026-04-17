import { apiSlice } from "../api/apiSlice";
import type { ApiResponse } from "../api/types";
import type { StoreConfig } from "./types";

export const storeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    storeConfig: builder.query<ApiResponse<StoreConfig>, void>({
      query: () => ({
        url: "/shop/store-configuration/",
        method: "GET",
      }),
    }),
  }),
});

export const { useStoreConfigQuery } = storeApiSlice;
