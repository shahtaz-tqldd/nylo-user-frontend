"use client";

import React, { useEffect, useState } from "react";
import {
  Heart,
  Share2,
  ShoppingCart,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Truck,
  Package,
  Tag,
  TrafficCone,
} from "lucide-react";

import Button from "@/components/buttons/primary-button";
import Title from "@/components/ui/title";
import { useProductDetailsQuery } from "@/features/products/productApiSlice";
import { ProductColor, ProductVariantSize } from "@/features/products/types";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setCurrentImage(0);
  }, [images]);

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={images[currentImage]}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute right-4 top-4 flex gap-2">
            <button className="rounded-full bg-white/85 p-2 backdrop-blur-sm transition-colors hover:bg-white">
              <Heart className="h-4 w-4 text-gray-500" />
            </button>
            <button className="rounded-full bg-white/85 p-2 backdrop-blur-sm transition-colors hover:bg-white">
              <Share2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                )
              }
              className="absolute left-4 top-1/2 rounded-full bg-white/90 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                )
              }
              className="absolute right-4 top-1/2 rounded-full bg-white/90 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                currentImage === index
                  ? "border-green-600"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColorId: string | null;
  onColorChange: (colorId: string) => void;
}

const ColorSelector = ({
  colors,
  selectedColorId,
  onColorChange,
}: ColorSelectorProps) => {
  const selectedColor = colors.find((color) => color.id === selectedColorId);

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">
        Color: {selectedColor?.name ?? "Select color"}
      </h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color.id)}
            title={color.name}
            className={cn(
              "flex items-center gap-2 rounded-lg py-1 pl-2 pr-2.5 text-sm transition-colors",
              selectedColorId === color.id
                ? `bg-primary/15 text-primary`
                : "bg-gray-100 hover:bg-gray-200",
            )}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color.color_code }}
            />
            <span>{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface SizeSelectorProps {
  sizes: ProductVariantSize[];
  selectedSizeId: string | null;
  onSizeChange: (sizeId: string) => void;
}

const SizeSelector = ({
  sizes,
  selectedSizeId,
  onSizeChange,
}: SizeSelectorProps) => {
  const selectedSize = sizes.find((size) => size.id === selectedSizeId);

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">
        Size: {selectedSize?.name ?? "Select size"}
      </h4>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSizeChange(size.id)}
            className={cn(
              "h-10 min-w-10 rounded-full px-3 text-sm font-medium transition-colors",
              selectedSizeId === size.id
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            {size.name}
          </button>
        ))}
      </div>
    </div>
  );
};

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  max: number;
}

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  max,
}: QuantitySelectorProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Quantity</h4>
      <div className="flex w-fit items-center rounded-lg border-2 border-primary/40 px-1">
        <button
          onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[44px] px-3 py-2 text-center font-medium">
          {quantity}
        </span>
        <button
          onClick={() => quantity < max && onQuantityChange(quantity + 1)}
          disabled={quantity >= max}
          className="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ProductFeatures = ({ features }: { features: string[] }) => {
  if (!features.length) {
    return null;
  }

  return (
    <div className="mt-9 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li
            key={`${feature}-${index}`}
            className="flex items-start gap-4 text-sm text-gray-700"
          >
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ShippingInfo = () => {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2">
      <div className="flex items-center gap-3">
        <RotateCcw className="h-5 w-5 text-green-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium opacity-80">7 Day Returns</span>
          <span className="text-xs opacity-60">Free returns within 7 days</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-orange-500" />
        <div className="flex flex-col">
          <span className="text-sm font-medium opacity-80">
            Quality Checked
          </span>
          <span className="text-xs opacity-60">
            Every variant is verified before shipping
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Truck className="h-5 w-5 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium opacity-80">Fast Delivery</span>
          <span className="text-xs opacity-60">
            Free delivery on qualifying orders
          </span>
        </div>
      </div>
    </div>
  );
};

interface ProductSpecificationsProps {
  specifications: Record<string, string>;
  className?: string;
}

const ProductSpecifications = ({
  specifications,
  className,
}: ProductSpecificationsProps) => {
  const entries = Object.entries(specifications);

  if (!entries.length) {
    return null;
  }

  return (
    <div className={cn("mt-8 md:mt-16", className)}>
      <h3 className="mb-6 text-2xl font-bold text-gray-900">Specifications</h3>
      <div className="grid grid-cols-1">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between border-b border-gray-200 py-3 last:border-b-0"
          >
            <span className="font-medium capitalize text-gray-700">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <span className="text-right font-semibold text-gray-900">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductDetailsSkeleton = () => {
  return (
    <div className="container pb-20 pt-24 md:pt-32">
      <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-gray-200" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 w-20 rounded-lg bg-gray-200" />
            ))}
          </div>
          <div className="hidden space-y-3 md:block">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-12 rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-14 w-4/5 rounded bg-gray-200" />
          </div>
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="flex items-end gap-3">
            <div className="h-10 w-28 rounded bg-gray-200" />
            <div className="h-6 w-20 rounded bg-gray-100" />
            <div className="h-6 w-24 rounded bg-gray-100" />
          </div>
          <div className="h-5 w-36 rounded bg-gray-100" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-11/12 rounded bg-gray-100" />
            <div className="h-4 w-3/4 rounded bg-gray-100" />
          </div>
          <div className="space-y-3">
            <div className="h-5 w-24 rounded bg-gray-200" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-9 w-28 rounded-lg bg-gray-100" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-5 w-20 rounded bg-gray-200" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-10 rounded-full bg-gray-100"
                />
              ))}
            </div>
          </div>
          <div className="h-12 w-36 rounded-lg bg-gray-100" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-14 rounded-full bg-gray-200" />
            <div className="h-14 rounded-full bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsPage = ({ productSlug }: { productSlug: string }) => {
  const { data, isLoading, isError } = useProductDetailsQuery(productSlug);
  const product = data?.data;

  const variants = product?.variants ?? [];
  const colors = variants.reduce<ProductColor[]>((uniqueColors, variant) => {
    if (!uniqueColors.some((color) => color.id === variant.color.id)) {
      uniqueColors.push(variant.color);
    }
    return uniqueColors;
  }, []);
  const sizes = variants.reduce<ProductVariantSize[]>(
    (uniqueSizes, variant) => {
      if (!uniqueSizes.some((size) => size.id === variant.size.id)) {
        uniqueSizes.push(variant.size);
      }
      return uniqueSizes;
    },
    [],
  );

  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) {
      return;
    }

    const firstVariant = product.variants?.find((variant) => variant.is_active);
    setSelectedColorId(
      firstVariant?.color.id ?? product.variants?.[0]?.color.id ?? null,
    );
    setSelectedSizeId(
      firstVariant?.size.id ?? product.variants?.[0]?.size.id ?? null,
    );
    setQuantity(1);
  }, [product]);

  const filteredVariants = variants.filter((variant) => {
    if (!variant.is_active) {
      return false;
    }

    if (selectedColorId && variant.color.id !== selectedColorId) {
      return false;
    }

    return true;
  });

  const availableSizes = selectedColorId
    ? sizes.filter((size) =>
        filteredVariants.some((variant) => variant.size.id === size.id),
      )
    : sizes;

  useEffect(() => {
    if (!availableSizes.length) {
      return;
    }

    if (!availableSizes.some((size) => size.id === selectedSizeId)) {
      setSelectedSizeId(availableSizes[0].id);
    }
  }, [availableSizes, selectedSizeId]);

  const selectedVariant =
    variants.find(
      (variant) =>
        variant.is_active &&
        variant.color.id === selectedColorId &&
        variant.size.id === selectedSizeId,
    ) ?? null;

  const stockCount = selectedVariant?.stock ?? product?.total_stock ?? 0;
  const comparePrice = Number(product?.compare_price ?? product?.price ?? 0);
  const price = Number(product?.price ?? 0);
  const savings = Math.max(comparePrice - price, 0);
  const savingsPercentage =
    comparePrice > 0 ? Math.round((savings / comparePrice) * 100) : 0;

  const images = Array.from(
    new Set(
      [selectedVariant?.image_url, product?.image_url].filter(
        (image): image is string => Boolean(image),
      ),
    ),
  );

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !product) {
    return <NoProductFound />;
  }

  return (
    <div className="container pb-20 pt-24 md:pt-32">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <div className="space-y-3 md:hidden">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{product.brand}</span>
              {product.category?.name && (
                <>
                  <span>•</span>
                  <span>{product.category.name}</span>
                </>
              )}
            </div>
            <h3 className="text-3xl font-bold leading-tight text-gray-900">
              {product.title}
            </h3>
          </div>

          <ImageGallery
            images={
              images.length
                ? images
                : ["https://placehold.co/800x800?text=Product"]
            }
            productName={product.title ?? "Product"}
          />

          <ProductSpecifications
            className="hidden md:block"
            specifications={product.specifications ?? {}}
          />
        </div>

        <div className="space-y-6">
          <div className="hidden space-y-3 md:block">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{product.brand}</span>
              {product.category?.name && (
                <>
                  <span>•</span>
                  <span>{product.category.name}</span>
                </>
              )}
              {product.gender && (
                <>
                  <span>•</span>
                  <span className="capitalize">{product.gender}</span>
                </>
              )}
            </div>
            <Title>{product.title}</Title>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
              <Package className="h-4 w-4" />
              <span>{stockCount > 0 ? `In Stock` : "Out of stock"}</span>
            </div>
            {selectedVariant?.sku && (
              <div className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700">
                SKU: {selectedVariant.sku}
              </div>
            )}
            {!selectedVariant?.sku && product.sku && (
              <div className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700">
                SKU: {product.sku}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-4xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
              {comparePrice > price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${comparePrice.toFixed(2)}
                  </span>
                  <span className="font-semibold text-orange-500">
                    Save {savingsPercentage}%
                  </span>
                </>
              )}
            </div>
            {savings > 0 && (
              <p className="text-sm text-gray-500">
                You save ${savings.toFixed(2)} on this product.
              </p>
            )}
          </div>

          <p className="leading-relaxed text-gray-700">{product.description}</p>

          {colors.length > 0 && (
            <ColorSelector
              colors={colors}
              selectedColorId={selectedColorId}
              onColorChange={setSelectedColorId}
            />
          )}

          {availableSizes.length > 0 && (
            <SizeSelector
              sizes={availableSizes}
              selectedSizeId={selectedSizeId}
              onSizeChange={setSelectedSizeId}
            />
          )}

          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            max={Math.max(1, Math.min(stockCount || 1, 10))}
          />

          <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
            <Button variant="accent" size="lg" disabled={stockCount < 1}>
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </div>
            </Button>
            <Button link="/checkout" size="lg" disabled={stockCount < 1}>
              Buy Now
            </Button>
          </div>

          <div className="py-2 px-3.5 rounded-2xl border border-gray-200 bg-gray-50/70 flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400">
              Selected variant
            </p>

            {selectedVariant ? (
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Color badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 pl-2 rounded-full border border-gray-200 bg-white">
                  <span
                    className="w-[18px] h-[18px] rounded-full flex-shrink-0 border border-black/10"
                    style={{ background: selectedVariant.color.color_code }}
                  />
                  <span className="text-[13px] font-medium text-gray-900">
                    {selectedVariant.color.name}
                  </span>
                </div>

                <span className="text-gray-300 text-sm">/</span>

                {/* Size badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white">
                  <span className="text-[11px] font-medium text-gray-400 tracking-wide">
                    SZ
                  </span>
                  <span className="text-[13px] font-medium text-gray-900">
                    {selectedVariant.size.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-gray-200">
                <span className="text-[13px] text-gray-400">Base product</span>
              </div>
            )}
          </div>

          {product.tags?.length ? (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <ShippingInfo />
          <ProductFeatures features={product.features ?? []} />
          <ProductSpecifications
            className="block md:hidden"
            specifications={product.specifications ?? {}}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

const NoProductFound = () => {
  return (
    <div className="container pb-24 pt-28 md:pt-36">
      <div className="mx-auto max-w-xl text-center">
        <div className="relative overflow-hidden">
          {/* Icon */}

          <TrafficCone
            size={80}
            strokeWidth={1}
            className="mx-auto opacity-75"
          />

          {/* Title */}
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mt-6">
            Product not found
          </h2>

          {/* Description */}
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            The product you’re looking for doesn’t exist or may have been
            removed. You can explore other products or return to the homepage.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Browse Products
            </a>

            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
