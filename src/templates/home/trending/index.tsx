import React from "react";
import NavigateButton from "@/components/buttons/navigate-button";
import TrendingProductCard from "./trending-product-card";
import Title from "@/components/ui/title";
import { Product } from "@/features/products/types";

const Trending = ({ products }: { products: Product[] }) => {
  return (
    <section className="container pt-16 md:pt-24 pb-20 md:pb-36">
      <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-12 md:gap-0">
        {/* Product Cards */}
        <div className="col-span-3 relative h-auto md:h-[500px] flex md:block justify-center gap-6 md:gap-0">
          {/* Mobile = stacked cards */}
          {/* Desktop = original absolute positioned layered cards */}
          <div className="relative w-full max-w-full hidden md:block h-[500px]">
            {products.map((product, index) => (
              <TrendingProductCard
                key={index}
                index={index}
                product={product}
              />
            ))}
          </div>

          {/* Mobile stacked version */}
          <div className="flex flex-col gap-6 md:hidden">
            {products.map((product, index) => (
              <TrendingProductCard
                key={"m-" + index}
                index={-1} // disable absolute layout
                product={product}
              />
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-2 space-y-6 md:space-y-8 text-center md:text-left">
          <p className="uppercase font-medium tracking-[2px]">
            pick the bestseller
          </p>
          <Title>
            Discover Our <span className="text-emerald-500">Trending</span>{" "}
            Shoes
          </Title>
          <p className="text-xl md:text-2xl max-w-md mx-auto md:mx-0">
            Our latest collection combines comfort and cutting-edge design. Step
            up your style game with these top picks.
          </p>
          <NavigateButton className="mt-8 md:mt-24 mx-auto md:mx-0">
            Explore More
          </NavigateButton>
        </div>
      </div>
    </section>
  );
};

export default Trending;
