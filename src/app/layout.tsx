import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "@/assets/styles/global.css";
import "@/assets/styles/layout.css";
import AppProviders from "./providers";

const font = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={font.className} cz-shortcut-listen="false">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
