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

    legalContent: builder.query({
      query: () => ({
        url: `/shop/legal-content/`,
        method: "GET",
      })
    }),

    aboutPageContent: builder.query({
      query: () => ({
        url: `/shop/about-page/`,
        method: "GET",
      }),
    }),

    faqList: builder.query({
      query: () => ({
        url: `/shop/faqs/`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useStoreConfigQuery,
  useAboutPageContentQuery,
  useLegalContentQuery,
  useFaqListQuery
} = storeApiSlice;
