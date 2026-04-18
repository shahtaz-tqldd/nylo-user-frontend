import { apiSlice } from "../api/apiSlice";
import type { ApiResponse } from "../api/types";
import type {
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
  }),
});

export const {
  useCreateStripeCheckoutSessionMutation,
  useOrderListQuery,
  useUpdateOrderMutation
} = orderApiSlice;
