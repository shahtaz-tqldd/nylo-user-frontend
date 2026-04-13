import Link from "next/link";
import Image from "next/image";
import NavigateButton from "@/components/buttons/navigate-button";

import { Cart } from "@/assets/algo-icons";

import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types";

interface TrendingProductCardProps {
  product: Product;
  index: number;
}

const TrendingProductCard = ({ product, index }: TrendingProductCardProps) => {
  // Mobile fallback (stacked)
  const isMobile = index === -1;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`
        cursor-pointer p-4 w-72 h-[380px] flex flex-col justify-between rounded-3xl shadow-xl bg-white 
        transition-transform duration-300 hover:-translate-y-2 

        ${isMobile ? "static mx-auto" : ""}
        ${
          !isMobile && index === 0 ? "absolute top-0 left-0 rotate-[-6deg]" : ""
        }
        ${
          !isMobile && index === 1
            ? "absolute top-20 left-48 z-10 rotate-0"
            : ""
        }
        ${
          !isMobile && index === 2
            ? "absolute top-40 left-96 rotate-[6deg] z-10"
            : ""
        }
      `}
    >
      <div>
        <div className="w-full h-52 relative mb-4">
          <Image
            src={product.image_url || "/placeholder.png"}
            alt={product.title || "Product Image"}
            fill
            className="object-contain rounded-xl bg-gray-100"
          />
        </div>
        <h5 className="font-semibold text-lg mb-1 line-clamp-2">
          {product.title}
        </h5>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {product?.category_name} for {product.gender}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-md font-bold">${product.price}</span>
        <NavigateButton
          // onClick={handleAddToCart}
          className={cn(
            "shrink-0 rounded-full transition-transform duration-300 group-hover:scale-[1.02]",
            "h-11 px-5 text-sm",
          )}
          icon={Cart}
        >
          View
        </NavigateButton>
      </div>
    </Link>
  );
};

export default TrendingProductCard;
