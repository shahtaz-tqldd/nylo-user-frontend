import type { Metadata } from "next";
import "@/assets/styles/global.css";
import "@/assets/styles/layout.css";
import AppProviders from "./providers";

export const metadata: Metadata = {
  title: "nylo | online shoe store",
  description:
    "nylo is a online shoe store for selling sneaker, modern and aesthetic shoes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/nylo.png" type="image/svg+xml" />
      </head>
      <body cz-shortcut-listen="false">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
