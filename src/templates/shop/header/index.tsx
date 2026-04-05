import React from "react";
import { SearchIcon } from "@/assets/algo-icons";
import { Settings2 } from "lucide-react";
import Button from "@/components/buttons/primary-button";
import { FilterState } from "../types";
import {
  ProductCategory,
  ProductColor,
  ProductGender,
  ProductSize,
} from "@/features/products/types";
interface HeaderProps {
  categories: ProductCategory[];
  sizes: ProductSize[];
  colors: ProductColor[];
  genders: ProductGender[];
  defaultPriceRange: [number, number];
  hasActiveFilters: boolean;
  filters: FilterState;
  onClearFilters?: () => void;
  onSearch?: (query: string) => void;
  searchQuery: string;
  onCategorySelect?: (categoryId?: string) => void;
  selectedCategoryId?: string;
  onRemoveFilter?: (filters: FilterState) => void;
}

const Header: React.FC<HeaderProps> = ({
  categories,
  sizes,
  colors,
  genders,
  defaultPriceRange,
  hasActiveFilters,
  filters,
  onClearFilters,
  onSearch,
  searchQuery,
  onCategorySelect,
  selectedCategoryId,
  onRemoveFilter,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const selectedSizeLabels = sizes
    .filter((size) => filters.sizes.includes(size.id))
    .map((size) => size.name)
    .join(", ");

  const selectedColorLabels = colors
    .filter((color) => filters.colors.includes(color.id))
    .map((color) => color.name)
    .join(", ");

  const selectedGenderLabels = genders
    .filter((gender) => filters.genders.includes(gender.value))
    .map((gender) => gender.label)
    .join(", ");

  return (
    <div className="space-y-6">
      <div className="flex md:flex-row flex-col gap-4 md:items-center items-start md:justify-between">
        <h3 className="text-2xl font-bold">Products</h3>
        <div className="flex justify-between md:justify-end items-center w-full gap-4">
          <div className="relative max-w-[340px] w-full flex-1">
            <SearchIcon size={5} className="absolute top-[13px] left-3" />
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search shoes"
              className="py-2 pl-10 pr-4 rounded-lg w-full bg-gray-50 border border-primary/20 focus:border-primary focus:outline-none tr"
            />
          </div>
          <button className="md:hidden flex bg-gray-100 text-primary h-11 w-11 rounded-full items-center justify-center">
            <Settings2 />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-8">
        <button
          onClick={() => onCategorySelect?.()}
          className={`py-2 px-5 rounded-full text-sm font-medium tr ${
            !selectedCategoryId
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            className={`py-2 px-5 rounded-full text-sm font-medium tr ${
              selectedCategoryId === category.id
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex md:justify-between flex-col md:flex-row gap-4 md:gap-0">
          <div className="flex md:flex-row flex-col md:items-center md:gap-6 gap-4 w-full">
            <div className="flex w-full md:w-fit items-center justify-between md:block">
              <h5 className="text-sm font-medium text-gray-700">
                Active Filters
              </h5>

              {/* Mobile Reset Button */}
              <Button
                size="xs"
                variant="alert"
                className="px-4 md:hidden"
                onClick={onClearFilters}
              >
                Reset Filter
              </Button>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <FilterChip
                  label="Search"
                  value={searchQuery}
                  onRemove={() => onSearch?.("")}
                />
              )}

              {selectedCategoryId && (
                <FilterChip
                  label="Category"
                  value={
                    categories.find((category) => category.id === selectedCategoryId)
                      ?.name ?? ""
                  }
                  onRemove={() => onCategorySelect?.()}
                  color="green"
                />
              )}

              {filters.genders.length > 0 && (
                <FilterChip
                  label="Gender"
                  value={selectedGenderLabels}
                  onRemove={() =>
                    onRemoveFilter?.({ ...filters, genders: [] })
                  }
                  color="green"
                />
              )}

              {(filters.priceRange[0] !== defaultPriceRange[0] ||
                filters.priceRange[1] !== defaultPriceRange[1]) && (
                <FilterChip
                  label="Price"
                  value={`$${filters.priceRange[0]} - $${filters.priceRange[1]}`}
                  onRemove={() =>
                    onRemoveFilter?.({
                      ...filters,
                      priceRange: defaultPriceRange,
                    })
                  }
                />
              )}

              {filters.sizes.length > 0 && (
                <FilterChip
                  label="Sizes"
                  value={selectedSizeLabels}
                  onRemove={() => onRemoveFilter?.({ ...filters, sizes: [] })}
                />
              )}

              {filters.colors.length > 0 && (
                <FilterChip
                  label="Colors"
                  value={selectedColorLabels}
                  onRemove={() => onRemoveFilter?.({ ...filters, colors: [] })}
                />
              )}
            </div>
          </div>

          {/* Desktop Reset Button */}
          <Button
            size="xs"
            variant="alert"
            className="pr-6 pl-[18px] hidden md:block h-fit text-nowrap"
            onClick={onClearFilters}
          >
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;

const FilterChip = ({
  label,
  value,
  onRemove,
  color,
}: {
  label: string;
  value: string;
  color?: string;
  onRemove: () => void;
}) => {
  const colorClasses =
    color === "green"
      ? "border-green-100 bg-green-50 text-green-800"
      : "border-gray-100 bg-gray-50 text-primary";

  return (
    <div
      className={`inline-flex items-center gap-1 py-1 pl-3 pr-2 rounded-full text-sm ${colorClasses}`}
    >
      <span>
        <span className="opacity-75">{label}:</span> {value}
      </span>
      <button
        onClick={onRemove}
        className="hover:bg-red-200 text-red-500 rounded-full h-5 w-5 center text-lg"
      >
        ×
      </button>
    </div>
  );
};
