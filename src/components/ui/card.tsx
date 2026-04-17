import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps{
    children: React.ReactNode; 
    className?: string;
}

function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 12%, white), color-mix(in srgb, var(--theme-accent) 6%, white), color-mix(in srgb, var(--theme-primary) 4%, transparent))",
      }}
      className={cn(
        "rounded-xl p-8 pt-6",
        className
      )}
      {...props}
    >
        {children}
    </div>
  )
}

export { Card }
