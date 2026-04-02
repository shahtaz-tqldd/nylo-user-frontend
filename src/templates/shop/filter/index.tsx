import React, { useState, useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RangeSlider } from "@/components/ui/slider";
import Button from "@/components/buttons/primary-button";
import { FilterState } from "../types";
import { DEMO_COLORS, DEMO_SIZES } from "@/templates/product-details/demo-data";
import { ProductSettings } from "@/features/products/types";

const sizes = DEMO_SIZES;
const colors = DEMO_COLORS;

export interface FilterProps {
  settings: ProductSettings;
  onFiltersChange?: (filters: FilterState) => void;
  onApplyFilters?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  defaultFilters: FilterState;
}

const Filter: React.FC<FilterProps> = ({
  settings,
  onFiltersChange,
  onApplyFilters,
  filters,
  setFilters,
  defaultFilters,
  initialFilters,
}) => {
  console.log(settings);
  // Track if filters have been modified from initial state
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);
  const [lastAppliedFilters, setLastAppliedFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Check if current filters are different from default
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.sizes.length > 0 ||
      filters.colors.length > 0 ||
      filters.priceRange[0] !== defaultFilters.priceRange[0] ||
      filters.priceRange[1] !== defaultFilters.priceRange[1]
    );
  }, [filters, defaultFilters]);

  // Check if current filters are different from last applied
  const filtersChanged = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(lastAppliedFilters);
  }, [filters, lastAppliedFilters]);

  // Update filters and notify parent
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      setHasUnappliedChanges(true);
      onFiltersChange?.(newFilters);
    },
    [onFiltersChange, setFilters],
  );

  // Handle category checkbox changes
  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      const newCategories = checked
        ? [...filters.categories, category]
        : filters.categories.filter((c) => c !== category);

      updateFilters({ ...filters, categories: newCategories });
    },
    [filters, updateFilters],
  );

  // Handle price range changes
  const handlePriceRangeChange = useCallback(
    (minVal: number, maxVal: number) => {
      updateFilters({ ...filters, priceRange: [minVal, maxVal] });
    },
    [filters, updateFilters],
  );

  // Handle size selection
  const handleSizeToggle = useCallback(
    (size: string) => {
      const newSizes = filters.sizes.includes(size)
        ? filters.sizes.filter((s) => s !== size)
        : [...filters.sizes, size];

      updateFilters({ ...filters, sizes: newSizes });
    },
    [filters, updateFilters],
  );

  // Handle color selection
  const handleColorToggle = useCallback(
    (colorName: string) => {
      const newColors = filters.colors.includes(colorName)
        ? filters.colors.filter((c) => c !== colorName)
        : [...filters.colors, colorName];

      updateFilters({ ...filters, colors: newColors });
    },
    [filters, updateFilters],
  );

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    setLastAppliedFilters(filters);
    setHasUnappliedChanges(false);
    onApplyFilters?.(filters);
  }, [filters, onApplyFilters]);

  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <div className="flbx">
          <h4 className="mb-3">Category</h4>
          {hasUnappliedChanges && (
            <Button
              size="xs"
              variant="rubix"
              className="px-4"
              onClick={handleApplyFilters}
              disabled={!filtersChanged}
            >
              Apply Filter
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {settings?.genders?.map((gender) => (
            <label
              key={gender.value}
              htmlFor={gender.value}
              className="flex items-center gap-3 cursor-pointer text-sm hover:text-gray-900 transition-colors"
            >
              <Checkbox
                id={gender.value}
                checked={filters.categories.includes(gender.value)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(gender.value, !!checked)
                }
              />
              <span
                className={
                  filters.categories.includes(gender.value) ? "font-medium" : ""
                }
              >
                {gender.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 font-medium text-gray-900">Price Range</h4>
        <RangeSlider
          min={0}
          max={100}
          minVal={filters.priceRange[0]}
          maxVal={filters.priceRange[1]}
          onChange={handlePriceRangeChange}
          step={1}
          formatLabel={(value) => `$${value}`}
          className="mb-3"
        />
        <div className="text-sm text-gray-600 font-medium mt-8">
          ${filters.priceRange[0]}.00 - ${filters.priceRange[1]}.00
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="mb-3 font-medium text-gray-900">Size</h4>
        <div className="flex flex-wrap gap-2">
          {settings?.sizes?.map((size) => (
            <button
              key={size.id}
              onClick={() => handleSizeToggle(size.id)}
              className={`h-9 w-9 rounded-full text-sm font-medium tr ${
                filters.sizes.includes(size.id)
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {size?.name}
            </button>
          ))}
        </div>
        {filters.sizes.length > 0 && (
          <div className="text-sm text-gray-600 font-medium mt-4">
            Selected: {filters.sizes.join(", ")}
          </div>
        )}
      </div>

      {/* Color */}
      <div>
        <h4 className="mb-3 font-medium text-gray-900">Color</h4>
        <div className="flex flex-wrap gap-2">
          {settings?.colors?.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorToggle(color.name)}
              title={color.name}
              className={`flx gap-2 py-1 pl-2 pr-2.5 rounded-lg ${
                filters.colors.includes(color?.name)
                  ? "bg-primary/15 text-primary"
                  : "bg-gray-100 hover:bg-gray-200 tr"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: color?.color_code,
                }}
              ></span>
              <span className="text-sm">{color.name}</span>
            </button>
          ))}
        </div>
        {filters.colors.length > 0 && (
          <div className="text-sm text-gray-600 font-medium mt-4">
            Selected: {filters.colors.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
