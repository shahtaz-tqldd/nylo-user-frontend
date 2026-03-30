"use client";

import React from "react";
import Image from "next/image";

import Button from "@/components/buttons/primary-button";
import LinkButton from "@/components/buttons/link-button";
import HeroProductCard from "./hero-product-card";

import Link from "next/link";
import { DEMO_PRODUCTS } from "@/templates/product-details/demo-data";
import type { ProductProps } from "@/templates/product-details/types";
import Title from "@/components/ui/title";

const Hero = () => {
  const product_data: ProductProps | undefined = DEMO_PRODUCTS?.find(
    (p) => p.is_hero_product
  );

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#DFF2EB] via-[#B9E5E8] to-[#DFF2EB]">
      <div
        className="
          container mx-auto px-6
          pt-24 md:pt-36 pb-16
          flex flex-col md:flex-row md:flex-nowrap 
          items-center md:items-start
          gap-12 md:gap-20
          relative z-10
        "
      >
        {/* Left: Text */}
        <div className="space-y-6 md:space-y-8 max-w-xl text-center md:text-left">
          <Title variant="xl">
            Unlace the Ordinary,{" "}
            <span className="text-emerald-500">Lace Up the Hype.</span>
          </Title>

          <p className="text-lg sm:text-xl text-gray-700 max-w-md mx-auto md:mx-0">
            Curated kicks crafted to turn heads. From daily hustle to weekend
            chill — wear what feels like you.
          </p>

          <div className="flex justify-center items-center md:justify-start gap-6 mt-10">
            <Link href="/shop">
              <Button>Shop Now</Button>
            </Link>
            <LinkButton className="h-fit">Explore Collection</LinkButton>
          </div>
        </div>

        {/* Right: Shoe + Card */}
        <div className="mx-auto relative group flex flex-col items-center">
          {/* Desktop floating card */}
          <div className="hidden md:block">
            <HeroProductCard
              className="
                absolute top-8 right-4 
                -translate-x-40 
                group-hover:-translate-x-44 
                group-hover:-translate-y-2
              "
              product={product_data}
            />
          </div>

          {/* Mobile static card */}
          <div className="md:hidden mb-6">
            <HeroProductCard
              className="static w-64 mx-auto"
              product={product_data}
            />
          </div>

          <Image
            src={product_data?.image || "/placeholder.png"}
            alt={product_data?.name || "Product image"}
            className="
              h-[280px] w-[280px]
              sm:h-[350px] sm:w-[350px]
              md:h-[500px] md:w-[500px]
              object-contain 
              drop-shadow-[0_30px_20px_rgba(0,0,0,0.3)]
              md:drop-shadow-[0_50px_25px_rgba(0,0,0,0.5)]
              pointer-events-none
              transition-transform duration-500
              md:group-hover:rotate-[5deg] 
              md:group-hover:translate-x-8 
              md:group-hover:translate-y-6
            "
            priority
          />
        </div>
      </div>

      {/* Background Rings */}
      <div
        className="
          absolute z-0 
          -top-[18rem] -right-[18rem] 
          sm:-top-[22rem] sm:-right-[22rem]
          md:-top-[28rem] md:-right-[28rem]
          h-[36rem] w-[36rem]
          sm:h-[46rem] sm:w-[46rem]
          md:h-[56rem] md:w-[56rem]
          center border-2 border-white/25 rounded-full
        "
      >
        <div className="absolute h-[28rem] w-[28rem] sm:h-[36rem] sm:w-[36rem] md:h-[44rem] md:w-[44rem] center border-2 border-white/30 rounded-full">
          <div className="absolute h-[20rem] w-[20rem] sm:h-[26rem] sm:w-[26rem] md:h-[32rem] md:w-[32rem] center border-2 border-white/35 rounded-full">
            <div className="absolute h-[12rem] w-[12rem] sm:h-[15rem] sm:w-[15rem] md:h-[20rem] md:w-[20rem] center border-3 border-white/40 rounded-full">
              <div className="absolute h-[6rem] w-[6rem] sm:h-[8rem] sm:w-[8rem] md:h-[10rem] md:w-[10rem] border-3 border-white/45 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
