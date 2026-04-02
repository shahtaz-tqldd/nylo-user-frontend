"use client";

import React, { useMemo, useState, useCallback } from "react";
import Filter from "./filter";
import Header from "./header";
import Display from "./display";
import { FilterState } from "./types";
import {
  useProductListQuery,
  useProductSettingsQuery,
} from "@/features/products/productApiSlice";

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [20, 80],
  sizes: [],
  colors: [],
};

const ShopPage = () => {
  const initialFilters = {};

  // Initialize filters with defaults and any provided initial values
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Applied filters state (what's actually being used for filtering)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Search and category states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Check if current filters are different from default
  const hasActiveFilters = useMemo(() => {
    return (
      appliedFilters.categories.length > 0 ||
      appliedFilters.sizes.length > 0 ||
      appliedFilters.colors.length > 0 ||
      appliedFilters.priceRange[0] !== defaultFilters.priceRange[0] ||
      appliedFilters.priceRange[1] !== defaultFilters.priceRange[1] ||
      searchQuery.trim() !== "" ||
      selectedCategory !== "All"
    );
  }, [appliedFilters, searchQuery, selectedCategory]);

  // Handle filter changes (called on every filter interaction)
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    // This is called when filters are modified but not yet applied
    console.log("Filters changed:", newFilters);
  }, []);

  // Handle filter application (called when Apply button is clicked)
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    console.log("Filters applied:", newFilters);
    // Here you would typically fetch/filter your products
  }, []);

  // Handle clearing all filters
  const handleClearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSearchQuery("");
    setSelectedCategory("All");
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    console.log("Search query:", query);
    // Apply search immediately or debounce as needed
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    console.log("Category selected:", category);
    // Apply category filter immediately
  }, []);

  const { data, isLoading } = useProductListQuery();
  const { data: settings } = useProductSettingsQuery();

  return (
    <main className="flex gap-12 container pt-28 pb-20">
      <aside className="max-w-[300px] w-full md:block hidden sticky top-24 h-fit">
        <Filter
          settings={settings?.data || []}
          filters={filters}
          setFilters={setFilters}
          defaultFilters={defaultFilters}
          initialFilters={initialFilters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
        />
      </aside>
      <section className="flex-1 space-y-8">
        <Header
          filters={appliedFilters}
          hasActiveFilters={hasActiveFilters}
          setFilters={setFilters}
          onClearFilters={handleClearAllFilters}
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
        />
        <Display
          products={data?.data || []}
          filters={appliedFilters}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          isLoading={isLoading}
        />
      </section>
    </main>
  );
};

export default ShopPage;
