"use client";
import React from "react";
import MyProfileLayout from "../profile-layout";
import ProductCard, {
  ProductCardSkeleton,
} from "@/templates/product-details/product-card";
import { FolderOpen } from "lucide-react";
import { useFavouriteItemListQuery } from "@/features/products/productApiSlice";

const FavouritePage = () => {
  const { data, isLoading } = useFavouriteItemListQuery();
  return (
    <MyProfileLayout>
      <div>
        <h3>Favourite</h3>
      </div>
      {isLoading && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={`loading-${index}`} size="sm" />
          ))}
        </section>
      )}
      {!isLoading && data?.data?.length === 0 && (
        <div className="center py-24 flex flex-col gap-2">
          <FolderOpen className="opacity-50" size={32} strokeWidth={1} />
          <p>No products are added to favourite list</p>
        </div>
      )}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10 mt-8">
        {data?.data?.map((product, index) =>
          product?.product ? (
            <ProductCard product={product.product} key={index} size="sm" />
          ) : null,
        )}
      </section>
    </MyProfileLayout>
  );
};

export default FavouritePage;
