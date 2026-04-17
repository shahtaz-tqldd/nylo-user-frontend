const expandHex = (value: string) =>
  value.length === 4
    ? `#${value
        .slice(1)
        .split("")
        .map((char) => `${char}${char}`)
        .join("")}`
    : value;

export const normalizeHex = (value: string | null | undefined, fallback: string) => {
  if (!value) return fallback;

  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.startsWith("#")
    ? trimmedValue
    : `#${trimmedValue}`;

  return /^#([\da-fA-F]{3}|[\da-fA-F]{6})$/.test(normalizedValue)
    ? expandHex(normalizedValue).toLowerCase()
    : fallback;
};

const hexToRgb = (value: string) => {
  const normalized = expandHex(value);
  const intValue = Number.parseInt(normalized.slice(1), 16);

  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0"),
    )
    .join("")}`;

export const mixHex = (base: string, target: string, weight: number) => {
  const normalizedWeight = Math.max(0, Math.min(1, weight));
  const baseRgb = hexToRgb(base);
  const targetRgb = hexToRgb(target);

  return rgbToHex(
    baseRgb.r + (targetRgb.r - baseRgb.r) * normalizedWeight,
    baseRgb.g + (targetRgb.g - baseRgb.g) * normalizedWeight,
    baseRgb.b + (targetRgb.b - baseRgb.b) * normalizedWeight,
  );
};

export const getReadableTextColor = (background: string) => {
  const { r, g, b } = hexToRgb(background);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 150 ? "#111827" : "#ffffff";
};
