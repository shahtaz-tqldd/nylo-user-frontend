"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import {
  getReadableTextColor,
  mixHex,
  normalizeHex,
} from "@/lib/theme";

const StoreThemeSync = () => {
  const { config } = useAppSelector((state) => state.store);

  useEffect(() => {
    const root = document.documentElement;
    const primary = normalizeHex(config.primary_color, "#a83838");
    const accent = normalizeHex(config.accent_color, "#140b0b");
    const primaryForeground = getReadableTextColor(primary);
    const accentForeground = getReadableTextColor(accent);

    root.style.setProperty("--theme-primary", primary);
    root.style.setProperty("--theme-primary-foreground", primaryForeground);
    root.style.setProperty("--theme-primary-soft", mixHex(primary, "#ffffff", 0.88));
    root.style.setProperty("--theme-primary-muted", mixHex(primary, "#ffffff", 0.94));
    root.style.setProperty("--theme-primary-deep", mixHex(primary, "#000000", 0.24));
    root.style.setProperty("--theme-accent", accent);
    root.style.setProperty("--theme-accent-foreground", accentForeground);
    root.style.setProperty("--theme-accent-soft", mixHex(accent, "#ffffff", 0.92));
    root.style.setProperty("--theme-accent-muted", mixHex(accent, "#ffffff", 0.97));
    root.style.setProperty("--theme-surface", mixHex(primary, "#ffffff", 0.975));
    root.style.setProperty("--theme-surface-strong", mixHex(accent, "#ffffff", 0.9));
  }, [config.accent_color, config.primary_color]);

  return null;
};

export default StoreThemeSync;
