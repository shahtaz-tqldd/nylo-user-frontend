"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Cart } from "@/assets/algo-icons";
import { Bell, Heart, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileSideMenu = ({ className = "" }: { className?: string }) => {
  const pathname = usePathname();

  const sideMenu = [
    {
      id: 1,
      title: "My Orders",
      link: "/my-profile",
      icon: ShoppingCart,
    },
    {
      id: 2,
      title: "Favourite",
      link: "/my-profile/favourite",
      icon: Heart,
    },
    {
      id: 3,
      title: "Notification",
      link: "/my-profile/notifications",
      icon: Bell,
    },
    {
      id: 4,
      title: "Profile Settings",
      link: "/my-profile/settings",
      icon: User,
    },
  ];

  return (
    <div
      className={cn("max-w-[220px] w-full", "space-y-5 flex flex-col", className)}
    >
      {sideMenu.map((item) => {
        const isActive = pathname === item.link;

        return (
          <Link
            href={item.link}
            key={item.id}
            className={`flx tr gap-3 ${
              isActive ? "font-semibold text-primary" : "opacity-50 hover:opacity-100"
            }`}
          >
            <item.icon size={16} />
            {item.title}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileSideMenu;
