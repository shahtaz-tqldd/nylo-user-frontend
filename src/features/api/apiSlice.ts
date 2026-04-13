import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { userLoggedIn, userLoggedOut } from "@/features/auth/authSlice";
import { getTokens } from "@/hooks/useToken";
import type { ApiResponse, AuthResponseData } from "@/features/auth/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_BASE_URL ?? "";
const MAX_RETRY_COUNT = 3;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const { accessToken, refreshToken, rememberMe } = getTokens();
  let retryCount = 0;

  while (
    (!accessToken || (result.error && result.error.status === 401)) &&
    retryCount < MAX_RETRY_COUNT
  ) {
    retryCount++;
    try {
      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh/",
            method: "POST",
            body: { refreshToken },
            credentials: "include",
          },
          api,
          extraOptions,
        );

        const refreshData = refreshResult.data as ApiResponse<AuthResponseData>;

        if (refreshData?.success) {
          api.dispatch(
            userLoggedIn({
              accessToken:
                refreshData?.data?.accessToken ??
                refreshData?.data?.access_token ??
                "",
              refreshToken:
                refreshData?.data?.refreshToken ??
                refreshData?.data?.refresh_token ??
                "",
              rememberMe,
            }),
          );

          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
          break;
        } else {
          api.dispatch(userLoggedOut());
          // api.dispatch(apiSlice.util.resetApiState());
          break;
        }
      } else {
        api.dispatch(userLoggedOut());
        // api.dispatch(apiSlice.util.resetApiState());
        break;
      }
    } catch (error) {
      console.error("Refresh token failed:", error);
      api.dispatch(userLoggedOut());
      // api.dispatch(apiSlice.util.resetApiState());
      break;
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["auth", "my-profile", "products", "orders", "collection-list"],
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: false,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});

// Export utility functions for cache management
export const {
  util: { resetApiState },
} = apiSlice;
