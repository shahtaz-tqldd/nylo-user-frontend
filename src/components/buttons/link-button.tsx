import React, { ReactNode } from "react";
import Link from "next/link";

interface LinkButtonProps {
  children: ReactNode;
  link?: string;
  className?: string;
}

export default function LinkButton({
  children,
  link = "/",
  className = "",
}: LinkButtonProps) {
  return (
    <Link
      href={link}
      className={`
        relative inline-block text-secondary font-semibold text-lg
        after:content-[''] after:absolute after:left-0 after:bottom-0
        after:w-full after:h-[2px] after:bg-current
        after:scale-x-0 after:origin-left
        after:transition-transform after:duration-300
        hover:after:scale-x-100
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
