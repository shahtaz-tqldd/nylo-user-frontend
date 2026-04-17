"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Button from "@/components/buttons/primary-button";
import Link from "next/link";
import { productName } from "@/lib/sanitize";
import { formatTime } from "@/lib/date-time";

import Title from "@/components/ui/title";
import { OfferItem } from "@/features/products/types";

const getNextMidnight = (currentDate: Date) => {
  const nextMidnight = new Date(currentDate);
  nextMidnight.setHours(24, 0, 0, 0);
  return nextMidnight;
};

const getRemainingSeconds = (offerEndsAt?: string | null) => {
  const now = new Date();
  const fallbackEndTime = getNextMidnight(now);
  const targetDate = offerEndsAt ? new Date(offerEndsAt) : fallbackEndTime;
  const safeTargetDate =
    Number.isNaN(targetDate.getTime()) ? fallbackEndTime : targetDate;

  return Math.max(
    0,
    Math.floor((safeTargetDate.getTime() - now.getTime()) / 1000),
  );
};

const HotDeals = ({ products }: { products: OfferItem[] }) => {
  const [timers, setTimers] = useState<number[]>(
    products.map((item) => getRemainingSeconds(item.offer_ends_at)),
  );

  useEffect(() => {
    setTimers(products.map((item) => getRemainingSeconds(item.offer_ends_at)));

    const interval = setInterval(() => {
      setTimers(products.map((item) => getRemainingSeconds(item.offer_ends_at)));
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <Title className="text-center">Hot Deals</Title>
        <p className="text-center text-lg md:text-2xl mb-12 md:mb-16">
          Grab your chances before it's too late!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {products.map((item, index) => {
            const product = item.product;
            const price = Number(product.price ?? 0);
            const comparePrice = Number(product.compare_price ?? 0);
            const savings = comparePrice > price ? comparePrice - price : 0;
            const discountPercentage =
              comparePrice > price
                ? Math.round((savings / comparePrice) * 100)
                : 0;
            const productTitle = product.title || "Featured product";

            return (
              <div
                key={item.id}
                className={clsx(
                  "relative rounded-3xl overflow-hidden p-6 md:p-8",
                  "flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8",
                  "transition-all group",
                  index % 2 === 0 ? "bg-indigo-50" : "bg-teal-100/60",
                )}
              >
                {/* Image + Circles */}
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 shrink-0 mx-auto md:mx-0">
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    {/* Layered Circles - scaled for mobile */}
                    <div
                      className={clsx(
                        "absolute rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500",
                        index % 2 === 0 ? "bg-indigo-200" : "bg-green-200",
                        "w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60",
                      )}
                    ></div>
                    <div
                      className={clsx(
                        "absolute rounded-full opacity-60 group-hover:scale-115 transition-transform duration-500 delay-100",
                        index % 2 === 0 ? "bg-indigo-300" : "bg-green-300",
                        "w-32 h-32 sm:w-44 sm:h-44 md:w-48 md:h-48",
                      )}
                    ></div>
                    <div
                      className={clsx(
                        "absolute rounded-full opacity-80 group-hover:scale-105 transition-transform duration-500 delay-200",
                        index % 2 === 0 ? "bg-indigo-400" : "bg-green-400",
                        "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32",
                      )}
                    ></div>
                  </div>

                  <Image
                    src={product.image_url || "/placeholder.png"}
                    alt={productTitle}
                    width={400}
                    height={400}
                    className="relative z-10 h-full w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 relative z-10 text-center md:text-left">
                  <span className="text-sm bg-yellow-200 text-yellow-900 font-medium px-3 py-1.5 rounded-full">
                    {discountPercentage > 0
                      ? `Save ${discountPercentage}%`
                      : "Featured offer"}
                  </span>

                  <h4 className="my-3 md:my-4 text-xl md:text-2xl font-semibold">
                    {productTitle}
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-4 mb-6">
                    <span
                      className="text-3xl font-bold text-secondary"
                    >
                      ${price.toFixed(2)}
                    </span>
                    {comparePrice > price ? (
                      <span className="line-through text-gray-500">
                        ${comparePrice.toFixed(2)}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-gray-600 text-lg mb-4">
                    Offer ends in:{" "}
                    <span className="font-mono text-xl text-red-500">
                      {formatTime(timers[index])}
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.slug || productName(productTitle)}`}
                  >
                    <Button size="xs" className="mx-auto md:mx-0">
                      Buy Now
                    </Button>
                  </Link>
                </div>

                {/* Background Rings */}
                <div
                  className="
                    absolute z-0 
                    -top-40 -right-40 sm:-top-48 sm:-right-48 
                    h-72 w-72 sm:h-96 sm:w-96 md:h-100 md:w-100
                    center border-2 border-white/20 rounded-full
                  "
                >
                  <div className="absolute h-56 w-56 sm:h-72 sm:w-72 center border-2 border-white/40 rounded-full">
                    <div className="absolute h-40 w-40 sm:h-60 sm:w-60 center border-3 border-white/60 rounded-full">
                      <div className="absolute h-24 w-24 sm:h-36 sm:w-36 border-3 border-white/80 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HotDeals;
