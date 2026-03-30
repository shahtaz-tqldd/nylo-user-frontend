import type { StoredTokens } from "@/features/auth/types";
import { getAuthCookie, removeAuthCookie } from "./useCookie";

const isBrowser = typeof window !== "undefined";

export const getTokens = (): StoredTokens => {
  if (!isBrowser) {
    return {
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
    };
  }

  const { accessToken: cookieAccessToken, refreshToken: cookieRefreshToken } =
    getAuthCookie();

  const sessionAccessToken = sessionStorage.getItem("nylo_access");
  const sessionRefreshToken = sessionStorage.getItem("nylo_refresh");

  if (cookieRefreshToken) {
    return {
      accessToken: cookieAccessToken,
      refreshToken: cookieRefreshToken,
      rememberMe: true,
    };
  } else {
    return {
      accessToken: sessionAccessToken,
      refreshToken: sessionRefreshToken,
      rememberMe: false,
    };
  }
};

export const clearTokens = () => {
  if (!isBrowser) {
    return;
  }

  sessionStorage.removeItem("nylo_access");
  sessionStorage.removeItem("nylo_refresh");
  removeAuthCookie();
};

export const setSessionToken = (accessToken: string, refreshToken: string) => {
  if (!isBrowser) {
    return;
  }

  sessionStorage.setItem("nylo_access", accessToken);
  sessionStorage.setItem("nylo_refresh", refreshToken);
};
