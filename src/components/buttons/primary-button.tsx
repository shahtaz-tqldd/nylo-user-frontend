import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/assets/algo-icons";
import Link from "next/link";
import type { CSSProperties } from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "accent" | "rubix" | "alert";
  size?: "xs" | "sm" | "md" | "lg";
  link?: string | null;
  onClick?: () => void;
  disabled?: boolean;
  isArrow?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantClasses = {
  primary: "group/button hover:opacity-90",
  accent: "border-2 font-medium",
  rubix: "font-medium tr",
  alert: "bg-red-500/10 hover:bg-red-500/15 text-red-500 font-medium tr",
};

const sizeClasses = {
  xs: "py-2 pr-3.5 pl-6 text-sm",
  sm: "pl-10 pr-6 py-3 text-lg",
  md: "py-3 pr-5 pl-4",
  lg: "px-8 py-4 font-semibold",
};

const variantStyles: Record<ButtonProps["variant"], CSSProperties> = {
  primary: {
    backgroundColor: "var(--theme-primary)",
    color: "var(--theme-primary-foreground)",
  },
  accent: {
    color: "var(--theme-primary)",
    backgroundColor: "color-mix(in srgb, var(--theme-primary) 6%, white)",
    borderColor: "color-mix(in srgb, var(--theme-primary) 40%, white)",
  },
  rubix: {
    color: "var(--theme-primary)",
    backgroundColor: "color-mix(in srgb, var(--theme-primary) 10%, white)",
  },
  alert: {},
};

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "sm",
  link = null,
  isArrow = true,
  type = "button",
  ...props
}) => {
  const commonClasses = cn(
    "rounded-full inline-flex items-center justify-center overflow-hidden tr",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const commonStyle = variantStyles[variant];

  const textClasses = cn(
    variant === "primary" && isArrow
      ? "transition-all duration-300 transform group-hover/button:-translate-x-2"
      : ""
  );

  const arrowClasses = cn(
    "transition-all -ml-2 duration-300",
    isArrow
      ? "opacity-0 group-hover/button:opacity-100 group-hover/button:translate-x-1"
      : "hidden",
    size === "xs" ? "translate-x-[-2px]" : "translate-x-[-0.25rem]"
  );

  if (link) {
    return (
      <Link href={link} className={commonClasses} style={commonStyle}>
        <span className={textClasses}>{children}</span>
        {variant === "primary" && isArrow && (
          <ArrowRight
            className={arrowClasses}
            size={size === "xs" ? 4 : 5}
            color="currentColor"
          />
        )}
      </Link>
    );
  }

  return (
    <button type={type} className={commonClasses} style={commonStyle} {...props}>
      <span className={textClasses}>{children}</span>
      {variant === "primary" && isArrow && (
        <ArrowRight
          className={arrowClasses}
          size={size === "xs" ? 4 : 5}
          color="currentColor"
        />
      )}
    </button>
  );
};

export default Button;
