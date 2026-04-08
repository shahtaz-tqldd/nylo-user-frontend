"use client"
import React from "react";

import LinkButton from "@/components/buttons/link-button";
import ProductCrad from "@/templates/product-details/product-card";

import Title from "@/components/ui/title";
import { useProductListQuery } from "@/features/products/productApiSlice";

const NewArrivals = () => {
  const { data } = useProductListQuery({ page_size: 5 });

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <Title>New Arrivals</Title>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-12">
          {data?.data?.map((product, index) => (
            <ProductCrad product={product} key={index} size="sm" isLanding />
          ))}
        </div>
        <div className="text-center mt-16">
          <LinkButton link="/shop">View More</LinkButton>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
