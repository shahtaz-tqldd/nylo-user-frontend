"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import { store } from "@/store";

const AuthBootstrap = ({ children }: { children: ReactNode }) => {
  useAuth();

  return <>{children}</>;
};

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>
        {children}
        <Toaster
          position="bottom-center"
          gutter={14}
          containerStyle={{ bottom: 24 }}
          toastOptions={{
            duration: 2800,
            style: {
              borderRadius: "18px",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              background: "rgba(255, 255, 255, 0.96)",
              color: "#0f172a",
              boxShadow:
                "0 18px 45px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.06)",
              backdropFilter: "blur(18px)",
              padding: "0px",
              minWidth: "320px",
            },
          }}
        />
      </AuthBootstrap>
    </Provider>
  );
}
