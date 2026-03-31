import { userDetailsFetched } from "./authSlice";
import type {
  ApiResponse,
  AuthResponseData,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "./types";
import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponseData>, LoginPayload>({
      query: (data) => {
        return {
          url: `/auth/login/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth", "my-profile"],
    }),

    registration: builder.mutation<ApiResponse<AuthResponseData>, RegisterPayload>({
      query: (data) => {
        return {
          url: `/auth/register/`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),

    forgotPassword: builder.mutation<ApiResponse<unknown>, unknown>({
      query: (payload) => {
        return {
          url: `/auth/forget-password`,
          method: "POST",
          body: payload,
        };
      },
    }),

    resetPassword: builder.mutation<ApiResponse<unknown>, { bodyData: unknown; userId: string; token: string }>({
      query: (payload) => {
        const { bodyData, userId, token } = payload;
        return {
          url: `/auth/forget-password/${userId}/${token}`,
          method: "POST",
          body: bodyData,
        };
      },
    }),

    me: builder.query<ApiResponse<AuthUser>, void>({
      query: () => {
        return {
          url: `/auth/me/`,
          method: "GET",
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userDetailsFetched(data.data));
        } catch {
          dispatch(userDetailsFetched(null));
        }
      },
      providesTags: ["my-profile"],
    }),

    changePassword: builder.mutation<ApiResponse<unknown>, unknown>({
      query: (payload) => {
        return {
          url: `/auth/reset-password`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    updateProfile: builder.mutation<ApiResponse<unknown>, unknown>({
      query: (payload) => {
        return {
          url: `/auth/me/update/`,
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["my-profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useMeQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation
} = authApiSlice;
