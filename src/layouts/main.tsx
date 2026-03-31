"use client";

import React from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ChatAssistance from "@/components/chat-assistance";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      {children}
      <Footer />
      <ChatAssistance />
    </React.Fragment>
  );
};

export default Layout;
