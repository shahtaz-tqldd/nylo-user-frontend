import { apiSlice } from "../api/apiSlice";
import type { ApiResponse } from "../api/types";
import type {
  ApplyCouponPayload,
  ApplyCouponResponse,
  CreateStripeCheckoutSessionPayload,
  CreateStripeCheckoutSessionResponse,
  OrderItem,
  UpdateOrderPayload
} from "./types";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createStripeCheckoutSession: builder.mutation<ApiResponse<CreateStripeCheckoutSessionResponse>, CreateStripeCheckoutSessionPayload>({
      query: (payload) => ({
        url: "/orders/checkout/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["orders"],
    }),

    orderList: builder.query<ApiResponse<OrderItem[]>, void>({
      query: () => ({
        url: "/orders/",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    updateOrder: builder.mutation<ApiResponse<OrderItem>, UpdateOrderPayload>({
      query: (payload) => ({
        url: "/orders/update/",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["orders"],
    }),

    applyCoupon: builder.mutation<ApiResponse<ApplyCouponResponse>, ApplyCouponPayload>({
      query: (payload) => ({
        url: "/coupons/apply/",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useOrderListQuery,
  useUpdateOrderMutation,
  useApplyCouponMutation,
  useCreateStripeCheckoutSessionMutation,
} = orderApiSlice;
