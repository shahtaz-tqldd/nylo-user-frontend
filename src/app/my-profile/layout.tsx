"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/layouts/main";
import { useAppSelector } from "@/hooks/redux";

export default function MyProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <Layout>{children}</Layout>;
}
