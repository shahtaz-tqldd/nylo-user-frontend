"use client";

import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSearchParams } from "next/navigation";
import Filter from "./filter";
import Header from "./header";
import { FilterState } from "./types";
import {
  useProductListQuery,
  useProductSettingsQuery,
} from "@/features/products/productApiSlice";
import { Product } from "@/features/products/types";
import ProductCard, {
  ProductCardSkeleton,
} from "../product-details/product-card";

const defaultFilters: FilterState = {
  genders: [],
  priceRange: [40, 800],
  sizes: [],
  colors: [],
  collections: [],
};

const PAGE_SIZE = 10;

const ShopPage = () => {
  const searchParams = useSearchParams();
  const initialFilters = {};
  const requestedCollectionSlug = searchParams.get("collection");
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const syncedCollectionSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const isPriceFilterActive = useMemo(
    () =>
      appliedFilters.priceRange[0] !== defaultFilters.priceRange[0] ||
      appliedFilters.priceRange[1] !== defaultFilters.priceRange[1],
    [appliedFilters.priceRange],
  );

  const productQueryArgs = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      search: debouncedSearchQuery || undefined,
      category_id: selectedCategoryId || undefined,
      gender: appliedFilters.genders.length
        ? appliedFilters.genders
        : undefined,
      size_ids: appliedFilters.sizes.length ? appliedFilters.sizes : undefined,
      color_ids: appliedFilters.colors.length
        ? appliedFilters.colors
        : undefined,
      collection_ids: appliedFilters.collections.length
        ? appliedFilters.collections
        : undefined,
      min_price: isPriceFilterActive ? appliedFilters.priceRange[0] : undefined,
      max_price: isPriceFilterActive ? appliedFilters.priceRange[1] : undefined,
    }),
    [
      appliedFilters,
      debouncedSearchQuery,
      isPriceFilterActive,
      page,
      selectedCategoryId,
    ],
  );

  const hasActiveFilters = useMemo(() => {
    return (
      appliedFilters.genders.length > 0 ||
      appliedFilters.sizes.length > 0 ||
      appliedFilters.colors.length > 0 ||
      appliedFilters.collections.length > 0 ||
      appliedFilters.priceRange[0] !== defaultFilters.priceRange[0] ||
      appliedFilters.priceRange[1] !== defaultFilters.priceRange[1] ||
      searchQuery.trim() !== "" ||
      Boolean(selectedCategoryId)
    );
  }, [appliedFilters, searchQuery, selectedCategoryId]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setPage(1);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedCategoryId(undefined);
    setPage(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleCategorySelect = useCallback((categoryId?: string) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  }, []);

  const { data, isLoading, isFetching } = useProductListQuery(productQueryArgs);
  const { data: settings, isLoading: isLoadingSettings } =
    useProductSettingsQuery();

  useEffect(() => {
    if (!requestedCollectionSlug) {
      syncedCollectionSlugRef.current = null;
      return;
    }

    if (!settings?.data?.collections?.length) {
      return;
    }

    if (syncedCollectionSlugRef.current === requestedCollectionSlug) {
      return;
    }

    const matchedCollection = settings.data.collections.find(
      (collection) => collection.slug === requestedCollectionSlug,
    );

    if (!matchedCollection) {
      return;
    }

    const nextCollectionIds = [matchedCollection.id];
    const nextFilters = {
      ...defaultFilters,
      ...filters,
      collections: nextCollectionIds,
    };

    syncedCollectionSlugRef.current = requestedCollectionSlug;
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setSelectedCategoryId(undefined);
    setPage(1);
  }, [filters, requestedCollectionSlug, settings]);

  useEffect(() => {
    setProducts([]);
  }, [appliedFilters, debouncedSearchQuery, selectedCategoryId]);

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    setProducts((currentProducts) =>
      page === 1 ? data.data : [...currentProducts, ...data.data],
    );
  }, [data, page]);

  const currentPage = data?.meta?.page ?? page;
  const currentPageSize = data?.meta?.page_size ?? PAGE_SIZE;
  const totalProducts = data?.meta?.total ?? 0;
  const hasMoreProducts =
    totalProducts > 0 && currentPage * currentPageSize < totalProducts;
  const isInitialLoading =
    isLoading ||
    isLoadingSettings ||
    (isFetching && page === 1 && products.length === 0);
  const isLoadingMore = isFetching && page > 1;

  useEffect(() => {
    const currentSentinel = sentinelRef.current;

    if (!currentSentinel || !hasMoreProducts || isFetching) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setPage((currentPage) => currentPage + 1);
        }
      },
      {
        rootMargin: "200px 0px",
      },
    );

    observer.observe(currentSentinel);

    return () => observer.disconnect();
  }, [hasMoreProducts, isFetching]);

  const handleRemoveFilter = useCallback((nextFilters: FilterState) => {
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
  }, []);

  return (
    <main className="flex gap-12 container pt-28 pb-20">
      <aside className="max-w-[300px] w-full md:block hidden sticky top-24 h-fit">
        <Filter
          settings={
            settings?.data ?? {
              categories: [],
              sizes: [],
              colors: [],
              collections: [],
              genders: [],
            }
          }
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
          categories={settings?.data?.categories || []}
          sizes={settings?.data?.sizes || []}
          colors={settings?.data?.colors || []}
          collections={settings?.data?.collections || []}
          genders={settings?.data?.genders || []}
          defaultPriceRange={defaultFilters.priceRange}
          filters={appliedFilters}
          hasActiveFilters={hasActiveFilters}
          searchQuery={searchQuery}
          onClearFilters={handleClearAllFilters}
          onSearch={handleSearch}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
          onRemoveFilter={handleRemoveFilter}
        />
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {isInitialLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} size="sm" />
              ))
            : products.map((product) => (
                <ProductCard product={product} key={product.slug} size="sm" />
              ))}
        </section>
        {!isInitialLoading && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-200 px-6 py-16 text-center text-gray-500">
            No products matched the current search and filters.
          </div>
        )}
        <div ref={sentinelRef} className="h-1" />
        {isLoadingMore && (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={`loading-${index}`} size="sm" />
            ))}
          </section>
        )}
      </section>
    </main>
  );
};

export default ShopPage;
