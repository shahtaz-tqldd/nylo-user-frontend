import type { PayloadAction } from "@reduxjs/toolkit";
import { setAuthCookie } from "@/hooks/useCookie";
import { clearTokens, getTokens, setSessionToken } from "@/hooks/useToken";
import { createSlice } from "@reduxjs/toolkit";
import type { AuthState, AuthTokens, AuthUser } from "./types";

const { accessToken } = getTokens();

const initialState: AuthState = {
  accessToken: accessToken || null,
  isAuthenticated: !!accessToken,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (
      state,
      action: PayloadAction<AuthTokens & { rememberMe: boolean }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      if (action.payload.rememberMe) {
        setAuthCookie({
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        });
      } else {
        setSessionToken(
          action.payload.accessToken,
          action.payload.refreshToken,
        );
      }
    },
    userDetailsFetched: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    userLoggedOut: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      clearTokens();
    },
  },
});

export const { userLoggedIn, userDetailsFetched, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;
