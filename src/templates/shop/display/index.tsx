import { DEMO_PRODUCTS } from "@/templates/product-details/demo-data";
import ProductCard from "@/templates/product-details/product-card";
import React from "react";
import { FilterState } from "../types";
import { Product } from "@/features/products/types";

interface DisplayProps {
  products: Product[];
  filters: FilterState;
  searchQuery: string;
  selectedCategory: string;
  isLoading?: boolean;
}

const Display: React.FC<DisplayProps> = ({
  products,
  filters,
  searchQuery,
  selectedCategory,
  isLoading = false,
}) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
      {products?.map((product, index) => (
        <ProductCard product={product} key={index} size="sm" />
      ))}
    </section>
  );
};

export default Display;
