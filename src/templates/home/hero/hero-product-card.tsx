import React from "react";
import Link from "next/link";
import Button from "@/components/buttons/primary-button";
import type { Product } from "@/features/products/types";

interface HeroProductCardProps {
  className: string;
  product: Product | undefined;
}

const HeroProductCard = ({ className, product }: HeroProductCardProps) => {
  if (!product) return null;

  return (
    <div
      className={`
        bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-lg 
        w-64 sm:w-72 tr
        ${className}
      `}
    >
      <p className="text-xs">
        {product.category_name} for {product.gender}
      </p>
      <h5 className="font-bold text-lg text-gray-800 mb-2">{product.title}</h5>

      {/* Price */}
      <div className="text-2xl font-extrabold text-gray-900 mb-4">
        ${product.price}
      </div>

      {/* Color Options */}
      <div className="flex gap-2 mb-5">
        <div className="w-5 h-5 rounded-full bg-red-500 border-3 border-white" />
        <div className="w-5 h-5 rounded-full bg-green-500 border-3 border-white" />
        <div className="w-5 h-5 rounded-full bg-blue-500 border-3 border-white" />
      </div>

      {/* Button */}
      <div>
        <Link href={`/products/${product.slug}`}>
          <Button size="xs">See Product</Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroProductCard;
