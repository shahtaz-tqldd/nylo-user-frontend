import React, { useState, useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RangeSlider } from "@/components/ui/slider";
import Button from "@/components/buttons/primary-button";
import { FilterState } from "../types";
import { ProductSettings } from "@/features/products/types";

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
  const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);
  const [lastAppliedFilters, setLastAppliedFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Check if current filters are different from default
  const hasActiveFilters = useMemo(() => {
    return (
      filters.genders.length > 0 ||
      filters.sizes.length > 0 ||
      filters.colors.length > 0 ||
      filters.collections.length > 0 ||
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
    (gender: string, checked: boolean) => {
      const newGenders = checked
        ? [...filters.genders, gender]
        : filters.genders.filter((item) => item !== gender);

      updateFilters({ ...filters, genders: newGenders });
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
    (sizeId: string) => {
      const newSizes = filters.sizes.includes(sizeId)
        ? filters.sizes.filter((size) => size !== sizeId)
        : [...filters.sizes, sizeId];

      updateFilters({ ...filters, sizes: newSizes });
    },
    [filters, updateFilters],
  );

  // Handle color selection
  const handleColorToggle = useCallback(
    (colorId: string) => {
      const newColors = filters.colors.includes(colorId)
        ? filters.colors.filter((color) => color !== colorId)
        : [...filters.colors, colorId];

      updateFilters({ ...filters, colors: newColors });
    },
    [filters, updateFilters],
  );

  const handleCollectionToggle = useCallback(
    (collectionId: string, checked: boolean) => {
      const newCollections = checked
        ? [...filters.collections, collectionId]
        : filters.collections.filter((collection) => collection !== collectionId);

      updateFilters({ ...filters, collections: newCollections });
    },
    [filters, updateFilters],
  );

  // Apply filters
  const handleApplyFilters = useCallback(() => {
    setLastAppliedFilters(filters);
    setHasUnappliedChanges(false);
    onApplyFilters?.(filters);
  }, [filters, onApplyFilters]);

  const selectedSizeLabels = useMemo(() => {
    return settings?.sizes
      ?.filter((size) => filters.sizes.includes(size.id))
      .map((size) => size.name) ?? [];
  }, [filters.sizes, settings?.sizes]);

  const selectedColorLabels = useMemo(() => {
    return settings?.colors
      ?.filter((color) => filters.colors.includes(color.id))
      .map((color) => color.name) ?? [];
  }, [filters.colors, settings?.colors]);

  const selectedCollectionLabels = useMemo(() => {
    return settings?.collections
      ?.filter((collection) => filters.collections.includes(collection.id))
      .map((collection) => collection.title) ?? [];
  }, [filters.collections, settings?.collections]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flbx">
          <h4 className="mb-3">Gender</h4>
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
                checked={filters.genders.includes(gender.value)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(gender.value, !!checked)
                }
              />
              <span
                className={
                  filters.genders.includes(gender.value) ? "font-medium" : ""
                }
              >
                {gender.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Price Range</h4>
        <RangeSlider
          min={0}
          max={1000}
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
            Selected: {selectedSizeLabels.join(", ")}
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Color</h4>
        <div className="flex flex-wrap gap-2">
          {settings?.colors?.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorToggle(color.id)}
              title={color.name}
              className={`flx gap-2 py-1 pl-2 pr-2.5 rounded-lg ${
                filters.colors.includes(color.id)
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
            Selected: {selectedColorLabels.join(", ")}
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-3 font-medium text-gray-900">Collections</h4>
        <div className="space-y-3">
          {settings?.collections?.map((collection) => (
            <label
              key={collection.id}
              htmlFor={collection.id}
              className="flex items-center gap-3 cursor-pointer text-sm hover:text-gray-900 transition-colors"
            >
              <Checkbox
                id={collection.id}
                checked={filters.collections.includes(collection.id)}
                onCheckedChange={(checked) =>
                  handleCollectionToggle(collection.id, !!checked)
                }
              />
              <span
                className={
                  filters.collections.includes(collection.id)
                    ? "font-medium"
                    : ""
                }
              >
                {collection.title}
              </span>
            </label>
          ))}
        </div>
        {filters.collections.length > 0 && (
          <div className="text-sm text-gray-600 font-medium mt-4">
            Selected: {selectedCollectionLabels.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
