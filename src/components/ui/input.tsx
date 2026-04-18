"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

function Input({
  className,
  type = "text",
  label,
  icon,
  iconPosition = "left",
  id,
  ...props
}: InputProps) {
  const inputId = id || React.useId();

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-black/20 flex w-full min-w-0 rounded-md border bg-white px-3 py-3 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-primary focus-visible:ring-[1px]",
            "aria-invalid:ring-red-500/20",
            icon && iconPosition === "left" ? "pl-10" : "",
            icon && iconPosition === "right" ? "pr-10" : "",
            className,
          )}
          {...props}
        />

        {icon && iconPosition === "right" && (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}

type FloatingInputProps = {
  label: string;
  type?: string;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  autoComplete?: string;
  className?: string;
};

function FloatingInput({
  label,
  type = "text",
  error,
  value,
  onChange,
  onBlur,
  name,
  autoComplete = "off",
  className = "",
}: FloatingInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder=" "
          className={`peer w-full rounded-xl border bg-white px-4 pt-5 pb-3 text-sm text-slate-900 outline-none transition-all duration-200
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/5"
            }
            ${isPassword ? "pr-12" : ""}
          `}
        />

        <label
          htmlFor={name}
          className={`
    absolute left-4 top-0 z-10 origin-[0] bg-white px-1 py-1 text-sm text-slate-500 pointer-events-none
    transform transition-all duration-200

    scale-90 -translate-y-1/2

    peer-placeholder-shown:top-1/2
    peer-placeholder-shown:-translate-y-1/2
    peer-placeholder-shown:scale-100

    peer-focus:top-0
    peer-focus:-translate-y-1/2
    peer-focus:scale-90
    peer-focus:text-primary
  `}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary transition hover:text-green-950"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export { Input, FloatingInput };
