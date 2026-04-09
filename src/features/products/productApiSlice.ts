import { apiSlice } from "../api/apiSlice";
import { ApiResponse } from "../api/types";
import type {
  Product,
  ProductListQueryParams,
  ProductSettings,
  AddToCartPayload,
  AddToFavouritePayload,
  CartItem,
  FavouriteItem,
} from "./types";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    productList: builder.query<ApiResponse<Product[]>, ProductListQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) {
          searchParams.set("page", String(params.page));
        }
        if (params?.page_size) {
          searchParams.set("page_size", String(params.page_size));
        }
        if (params?.search?.trim()) {
          searchParams.set("search", params.search.trim());
        }
        if (params?.min_price !== undefined) {
          searchParams.set("min_price", String(params.min_price));
        }
        if (params?.max_price !== undefined) {
          searchParams.set("max_price", String(params.max_price));
        }
        if (params?.category_id) {
          searchParams.set("category_id", params.category_id);
        }
        params?.gender?.forEach((value) => searchParams.append("gender", value));
        params?.size_ids?.forEach((value) =>
          searchParams.append("size_ids", value),
        );
        params?.color_ids?.forEach((value) =>
          searchParams.append("color_ids", value),
        );

        return {
          url: `/products/list/${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
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

    productDetails: builder.query<ApiResponse<Product>, string>({
      query: (productSlug) => {
        return {
          url: `/products/${productSlug}/`,
          method: "GET",
        };
      },
    }),

    // cart
    addToCart: builder.mutation<ApiResponse<Product>, AddToCartPayload>({
      query: (payload) => {
        return {
          url: `/products/user/add-to-cart/`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: ["products"],
    }),

    cartItemList: builder.query<ApiResponse<CartItem[]>, void>({
      query: () => {
        return {
          url: `/products/user/cart-item-list/`,
          method: "GET",
        };
      },
      providesTags: ["products"],
    }),

    // favourite
    addToFavourite: builder.mutation<ApiResponse<Product>, AddToFavouritePayload>({
      query: (payload) => {
        return {
          url: `/products/user/add-to-favourite/`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: ["products"],
    }),

    favouriteItemList: builder.query<ApiResponse<FavouriteItem[]>, void>({
      query: () => {
        return {
          url: `/products/user/favourite-item-list/`,
          method: "GET",
        };
      },
      providesTags: ["products"],
    }),
  }),
});

export const {
  useProductListQuery,
  useProductSettingsQuery,
  useProductDetailsQuery,
  useCartItemListQuery,
  useAddToCartMutation,
  useAddToFavouriteMutation,
  useFavouriteItemListQuery
} = productApiSlice;
