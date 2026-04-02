"use client";

import React from "react";
import Image from "next/image";

import NavigateButton from "@/components/buttons/navigate-button";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { productName } from "@/lib/sanitize";
import { CartPlusIcon } from "@/assets/algo-icons";
import { Product } from "@/features/products/types";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md";
  isLanding?: boolean;
}
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=100";

const sizeStyles = {
  sm: {
    imageHeight: "h-[220px]",
    discountText: "text-xs",
    name: "scale-90 -ml-2",
    button: "scale-90 -mr-4",
    price: "text-base",
  },
  md: {
    imageHeight: "h-[320px]",
    discountText: "text-sm",
    name: "",
    button: "",
    price: "text-xl",
  },
};

const ProductCard = ({
  product,
  size = "md",
  isLanding = false,
}: ProductCardProps) => {
  const styles = sizeStyles[size];

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // do cart logic
  };

  const discount =
    ((parseInt(product?.compare_price) - parseInt(product?.price)) /
      parseInt(product?.compare_price)) *
      100 +
    "%";

  return (
    <Link href={`/products/${productName(product?.slug)}`} className="group">
      {/* Image + Discount Badge */}
      <div
        className={cn(
          "relative w-full mb-4 overflow-hidden rounded-2xl",
          isLanding ? "h-[240px]" : styles.imageHeight,
        )}
      >
        <Image
          src={product?.image_url || PLACEHOLDER_IMAGE}
          alt={product?.title}
          height={400}
          width={400}
          className="w-full h-full object-cover bg-gray-200 tr ease-in-out group-hover:scale-105 will-change-transform [transform:translateZ(0)]"
        />
        <DiscountBadge discount={discount} size={size} />
      </div>

      {/* Product Name */}
      <h4 className={styles.name}>{product?.title}</h4>

      {/* CTA + Price */}
      <div className="flbx mt-4">
        <h5 className={cn("font-semibold text-primary", styles.price)}>
          {product?.price}
        </h5>
        <NavigateButton
          onClick={handleAddToCart}
          className={styles.button}
          icon={CartPlusIcon}
        >
          Add to Cart
        </NavigateButton>
      </div>
    </Link>
  );
};

export default ProductCard;

const DiscountBadge = ({
  discount,
  size,
}: {
  discount: string | undefined;
  size: string;
}) => {
  return (
    <div
      className={cn(
        "bg-black text-white text-sm absolute bottom-2.5 right-3 rounded-full flex items-center",
        "py-2 px-4 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out",
        "w-[44px] group-hover:w-[82px]",
        size == "sm" ? "scale-90" : "scale-100",
      )}
    >
      <span className="transition-opacity duration-300 -translate-x-1.5 group-hover:translate-x-0 tr">
        {discount}{" "}
        <span className="opacity-0 group-hover:opacity-100 tr">Off</span>
      </span>
    </div>
  );
};
