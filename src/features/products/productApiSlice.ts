
import { apiSlice } from "../api/apiSlice";
import { ApiResponse } from "../api/types";
import type { Product, ProductSettings } from "./types";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    productList: builder.query<ApiResponse<Product>, void>({
      query: () => {
        return {
          url: `/products/list/`,
          method: "GET",
        };
      },
      providesTags: ["products"],
    }),

    productSettings: builder.query<ApiResponse<ProductSettings>, void>({
      query: () => {
        return {
          url: `/products/settings/`,
          method: "GET",
        };
      },
    }),


  }),
});

export const {
  useProductListQuery,
  useProductSettingsQuery
} = productApiSlice;
