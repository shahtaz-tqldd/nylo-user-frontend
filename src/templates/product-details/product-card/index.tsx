"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import NavigateButton from "@/components/buttons/navigate-button";
import { CartPlusIcon } from "@/assets/algo-icons";
import { cn } from "@/lib/utils";
import { productName } from "@/lib/sanitize";
import { Product } from "@/features/products/types";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md";
  isLanding?: boolean;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=100&w=350";

const sizeStyles = {
  sm: {
    imageHeight: "h-[220px]",
    title: "text-[15px]",
    meta: "text-[11px]",
    price: "text-base",
    comparePrice: "text-xs",
    button: "h-10 px-4 text-sm",
    cardPadding: "p-3.5",
  },
  md: {
    imageHeight: "h-[300px]",
    title: "text-base",
    meta: "text-xs",
    price: "text-xl",
    comparePrice: "text-sm",
    button: "h-11 px-5 text-sm",
    cardPadding: "p-4",
  },
};

const ProductCard = ({
  product,
  size = "md",
  isLanding = false,
}: ProductCardProps) => {
  const styles = sizeStyles[size];

  const productTitle = product.title ?? product.name ?? "Product";
  const productSlug = product.slug ?? productTitle;

  const imageSrc =
    product.image_url ||
    (typeof product.image === "string" ? product.image : product.image?.src) ||
    PLACEHOLDER_IMAGE;

  const numericPrice = (product.price ?? "").replace(/[^0-9.]/g, "");
  const comparePriceRaw =
    product.compare_price ??
    product.discountPrice?.replace(/[^0-9.]/g, "") ??
    numericPrice;

  const priceValue = parseFloat(numericPrice || "0");
  const compareValue = parseFloat(comparePriceRaw || "0");

  const hasDiscount = compareValue > priceValue && priceValue > 0;

  const discount =
    product.discount ??
    (hasDiscount
      ? `${Math.max(
          Math.round(((compareValue - priceValue) / compareValue) * 100),
          0,
        )}%`
      : undefined);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // do cart logic
  };

  return (
    <Link
      href={`/products/${productName(productSlug)}`}
      className="group block h-full"
    >
      <article
        className={cn(
          "h-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-xl",
        )}
      >
        {/* Image */}
        <div
          className={cn(
            "relative overflow-hidden bg-gray-100",
            isLanding ? "h-[240px]" : styles.imageHeight,
          )}
        >
          <Image
            src={imageSrc}
            alt={productTitle}
            height={500}
            width={500}
            className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />

          {discount ? <DiscountBadge discount={discount} size={size} /> : null}
        </div>

        {/* Content */}
        <div
          className={cn(
            "flex flex-col justify-between h-fit gap-3",
            styles.cardPadding,
          )}
        >
          {/* Meta */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-75">
                {product.category_name} for {product.gender}
              </span>
              <MetaChip text={product?.brand || ""} className="text-xs" />
            </div>

            {/* Title */}
            <h5
              className={cn(
                "!text-lg line-clamp-2 min-h-[2.8rem] font-medium",
                styles.title,
              )}
            >
              {productTitle}
            </h5>
          </div>
          {/* Bottom row */}
          <div className="flex items-end justify-between gap-3 pt-1">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <span
                  className={cn("font-semibold text-primary", styles.price)}
                >
                  {product.price}
                </span>

                {hasDiscount ? (
                  <span
                    className={cn(
                      "text-gray-400 line-through",
                      styles.comparePrice,
                    )}
                  >
                    {formatComparePrice(product.price, comparePriceRaw)}
                  </span>
                ) : null}
              </div>

              {hasDiscount ? (
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  You save {discount}
                </p>
              ) : null}
            </div>

            <NavigateButton
              onClick={handleAddToCart}
              className={cn(
                "shrink-0 rounded-full transition-transform duration-300 group-hover:scale-[1.02]",
                styles.button,
              )}
              icon={CartPlusIcon}
            >
              Add
            </NavigateButton>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;

const MetaChip = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-medium text-gray-600",
        className,
      )}
    >
      {text}
    </span>
  );
};

const DiscountBadge = ({
  discount,
  size,
}: {
  discount: string;
  size: "sm" | "md";
}) => {
  return (
    <div
      className={cn(
        "absolute right-3 top-3 rounded-full bg-black/90 px-3 py-1.5 text-white shadow-lg backdrop-blur-sm",
        size === "sm" ? "text-[11px]" : "text-xs",
      )}
    >
      <span className="font-semibold">{discount} OFF</span>
    </div>
  );
};

const formatComparePrice = (displayPrice: string, compareRaw: string) => {
  const currencySymbol = displayPrice.replace(/[0-9.,\s]/g, "") || "$";
  return `${currencySymbol}${compareRaw}`;
};

export const ProductCardSkeleton = ({
  size = "md",
}: {
  size?: "sm" | "md";
}) => {
  const styles = sizeStyles[size];

  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
      <div className={cn("w-full bg-gray-200", styles.imageHeight)} />
      <div className={cn("space-y-3", styles.cardPadding)}>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
        </div>
        <div className="h-5 w-4/5 rounded bg-gray-200" />
        <div className="h-5 w-2/3 rounded bg-gray-200" />
        <div className="flex items-end justify-between pt-2">
          <div className="space-y-2">
            <div className="h-6 w-24 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
          <div className="h-11 w-24 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
};
