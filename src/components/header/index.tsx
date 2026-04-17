"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { config, isLoading, hasRemoteConfig } = useAppSelector(
    (state) => state.store,
  );

  const logoSrc = config.logo || "/logo.png";
  const showConfigLoading = isLoading && !hasRemoteConfig;

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
        <Link href="/" className="flx gap-3" aria-busy={showConfigLoading}>
          <Image
            src={logoSrc}
            height={40}
            width={40}
            className={`h-10 w-10 object-contain transition-opacity ${
              showConfigLoading ? "opacity-80" : "opacity-100"
            }`}
            alt={`${config.name} logo`}
          />
        </Link>

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
            <CartDrawer />

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
    </header>
  );
};

export default Header;
