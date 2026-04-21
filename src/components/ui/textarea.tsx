import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-24 w-full rounded-md border border-black/20 bg-white px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

type FloatingTextareaProps = {
  label: string;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name: string;
  rows?: number;
  className?: string;
};

function FloatingTextarea({
  label,
  error,
  value,
  onChange,
  onBlur,
  name,
  rows = 6,
  className = "",
}: FloatingTextareaProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          placeholder=" "
          className={`peer w-full rounded-xl border bg-white px-4 pt-6 pb-3 text-sm text-slate-900 outline-none transition-all duration-200
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/5"
            }
          `}
        />

        <label
          htmlFor={name}
          className="absolute left-4 top-0 z-10 origin-[0] bg-white px-1 py-1 text-sm text-slate-500 pointer-events-none
            transform transition-all duration-200 scale-90 -translate-y-1/2
            peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-90 peer-focus:text-primary"
        >
          {label}
        </label>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export { Textarea, FloatingTextarea };
