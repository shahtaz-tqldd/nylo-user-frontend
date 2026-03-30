"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import useAuth from "@/hooks/useAuth";
import { store } from "@/store";

const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  useAuth();

  return <>{children}</>;
};

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}
