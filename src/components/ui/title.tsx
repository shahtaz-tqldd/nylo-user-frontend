"use client";

import React from "react";
import clsx from "clsx";

interface TitleProps {
  children: React.ReactNode;
  variant?: "xl" | "lg" | "md" | "sm";
  className?: string;
}

export default function Title({
  children,
  variant = "lg",
  className,
}: TitleProps) {
  const sizeClasses = {
    xl: "text-5xl md:text-6xl font-extrabold",
    lg: "text-4xl md:text-5xl font-extrabold",
    md: "text-3xl md:text-4xl font-bold",
    sm: "text-xl md:text-2xl font-semibold",
  };

  return (
    <h2
      className={clsx(
        sizeClasses[variant],
        "leading-tight text-secondary/90",
        className,
      )}
    >
      {children}
    </h2>
  );
}
