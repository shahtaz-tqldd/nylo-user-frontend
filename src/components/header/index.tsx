"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cart } from "@/assets/algo-icons";
import IconButton from "@/components/buttons/icon-button";
import Image from "next/image";
import { User } from "lucide-react";
import { NAV_LINKS } from "./data";
import { useRouter } from "next/navigation";
import CartDrawer from "./cart-drawer";
import AuthDialog from "./auth-dialog";
import { useAppSelector } from "@/hooks/redux";

const Header = () => {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all border-b  duration-300 ${
        scrolled
          ? "bg-white/75 backdrop-blur-md border-b-primary/20"
          : "bg-transparent border-b-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flx gap-1">
          <span className="text-3xl font-black text-primary">nyLo</span>
          <Image
            src="/logo.png"
            height={200}
            width={200}
            className="h-10 w-10 object-contain"
            alt="logo"
          />
        </Link>

        {/* Navigation */}
        <div className="flx gap-8">
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-black font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flx">
            <IconButton icon={Cart} onClick={() => setCartOpen(true)} />
            {!isAuthenticated ? (
              <AuthDialog />
            ) : (
              <IconButton
                icon={User}
                size={20}
                onClick={() => router.push("/my-profile")}
              />
            )}
          </div>
        </div>
      </div>
      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </header>
  );
};

export default Header;
