"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
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
import {
  useAddToCartMutation,
  useAddToFavouriteMutation,
  useProductDetailsQuery,
} from "@/features/products/productApiSlice";
import {
  ProductColor,
  ProductBrand,
  ProductVariant,
  ProductVariantSize,
} from "@/features/products/types";
import { useAppSelector } from "@/hooks/redux";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  image: string;
  type: "product" | "variant";
  variant?: ProductVariant;
  label: string;
}

const getBrandName = (brand?: string | ProductBrand) => {
  if (!brand) {
    return "";
  }

  return typeof brand === "string" ? brand : brand.name;
};

interface ImageGalleryProps {
  items: GalleryItem[];
  productName: string;
  isFavourite: boolean;
  isFavouriteUpdating: boolean;
  onFavouriteToggle: () => void;
  activeImageId: string | null;
  onImageChange: (item: GalleryItem) => void;
}

const ImageGallery = ({
  items,
  productName,
  isFavourite,
  isFavouriteUpdating,
  onFavouriteToggle,
  activeImageId,
  onImageChange,
}: ImageGalleryProps) => {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeImageId),
  );
  const activeItem = items[activeIndex] ?? items[0];

  const handleSlide = (direction: "prev" | "next") => {
    if (!items.length) {
      return;
    }

    const nextIndex =
      direction === "prev"
        ? activeIndex === 0
          ? items.length - 1
          : activeIndex - 1
        : activeIndex === items.length - 1
          ? 0
          : activeIndex + 1;

    onImageChange(items[nextIndex]);
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-100 via-white to-gray-100">
        <div className="relative aspect-square overflow-hidden rounded-[22px] bg-white">
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="relative h-full min-w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.label || productName}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent px-5 pb-5 pt-16">
                  <div className="inline-flex rounded-full border border-white/20 bg-white/14 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                    {item.type === "variant" ? "Variant View" : "Product View"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={onFavouriteToggle}
              disabled={isFavouriteUpdating}
              aria-label={
                isFavourite
                  ? "Remove product from favourites"
                  : "Add product to favourites"
              }
              className={cn(
                "rounded-full bg-white/85 p-2 backdrop-blur-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60",
                isFavourite && "bg-red-600 text-white hover:bg-red-700 tr",
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isFavourite ? "fill-current text-current" : "text-gray-500",
                )}
              />
            </button>
            <button className="rounded-full bg-white/85 p-2 backdrop-blur-sm transition-colors hover:bg-white">
              <Share2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={() => handleSlide("prev")}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2.5 text-slate-700 shadow-lg backdrop-blur-sm transition hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleSlide("next")}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2.5 text-slate-700 shadow-lg backdrop-blur-sm transition hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {items.length > 1 && (
          <>
            <div className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {activeItem?.label ?? productName}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => onImageChange(item)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index === activeIndex
                        ? "w-7 bg-slate-900"
                        : "w-2 bg-slate-300 hover:bg-slate-400",
                    )}
                    aria-label={`Show ${item.label}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onImageChange(item)}
              className={cn(
                "group relative w-[88px] flex-shrink-0 overflow-hidden rounded-2xl border bg-white text-left transition-all",
                index === activeIndex
                  ? "border-slate-900"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const getVariantLabel = (variant: ProductVariant) => {
  const parts = [variant.color.name, variant.size.name].filter(Boolean);

  if (parts.length) {
    return parts.join(" / ");
  }

  return variant.sku || "Variant";
};

const buildGalleryItems = (
  productImage: string | null | undefined,
  variants: ProductVariant[],
) => {
  const items: GalleryItem[] = [];

  if (productImage) {
    items.push({
      id: "product-image",
      image: productImage,
      type: "product",
      label: "Main product image",
    });
  }

  variants.forEach((variant) => {
    if (!variant.image_url) {
      return;
    }

    items.push({
      id: `variant-${variant.id}`,
      image: variant.image_url,
      type: "variant",
      variant,
      label: getVariantLabel(variant),
    });
  });

  return items.length
    ? items
    : [
        {
          id: "product-fallback",
          image: "https://placehold.co/800x800?text=Product",
          type: "product" as const,
          label: "Product image",
        },
      ];
};

const getGalleryItemIdForVariant = (
  variant: ProductVariant | null,
  items: GalleryItem[],
) => {
  if (!variant) {
    return items[0]?.id ?? null;
  }

  const matchingItem = items.find(
    (item) => item.type === "variant" && item.variant?.id === variant.id,
  );

  return matchingItem?.id ?? items[0]?.id ?? null;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, isLoading, isError } = useProductDetailsQuery(productSlug);
  const [addToCart, { isLoading: isCartUpdating }] = useAddToCartMutation();
  const [addToFavourite, { isLoading: isFavouriteUpdating }] =
    useAddToFavouriteMutation();
  const product = data?.data;
  const requestedVariantId = searchParams.get("variant");

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
  const [variantCartState, setVariantCartState] = useState<
    Record<string, { isInCart: boolean; quantity: number }>
  >({});
  const [isFavourite, setIsFavourite] = useState(false);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);

  useEffect(() => {
    if (!product) {
      return;
    }

    const requestedVariant = requestedVariantId
      ? product.variants?.find(
          (variant) => variant.is_active && variant.id === requestedVariantId,
        )
      : null;
    const firstVariant =
      requestedVariant ??
      product.variants?.find((variant) => variant.is_active) ??
      product.variants?.[0];

    setSelectedColorId(
      firstVariant?.color.id ?? null,
    );
    setSelectedSizeId(
      firstVariant?.size.id ?? null,
    );
  }, [product, requestedVariantId]);

  useEffect(() => {
    setIsFavourite(Boolean(product?.added_to_favourite));
  }, [product?.added_to_favourite, product?.id]);

  useEffect(() => {
    const nextState = variants.reduce<
      Record<string, { isInCart: boolean; quantity: number }>
    >((acc, variant) => {
      acc[variant.id] = {
        isInCart: Boolean(variant.added_to_cart),
        quantity: Math.max(variant.cart_quantity ?? 0, 0),
      };
      return acc;
    }, {});

    setVariantCartState(nextState);
  }, [variants]);

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
  const galleryItems = buildGalleryItems(
    product?.image_url,
    variants.filter((variant) => variant.is_active),
  );

  const stockCount = selectedVariant?.stock ?? product?.total_stock ?? 0;
  const comparePrice = Number(product?.compare_price ?? product?.price ?? 0);
  const price = Number(product?.price ?? 0);
  const savings = Math.max(comparePrice - price, 0);
  const savingsPercentage =
    comparePrice > 0 ? Math.round((savings / comparePrice) * 100) : 0;

  const selectedProductId = product?.id ? String(product.id) : null;
  const selectedVariantId = selectedVariant?.id
    ? String(selectedVariant.id)
    : null;
  const selectedVariantState = selectedVariantId
    ? variantCartState[selectedVariantId]
    : undefined;
  const isSelectedVariantInCart = selectedVariant
    ? (selectedVariantState?.isInCart ?? Boolean(selectedVariant.added_to_cart))
    : Boolean(product?.added_to_cart);
  const selectedVariantCartQuantity = selectedVariant
    ? Math.max(
        selectedVariantState?.quantity ?? selectedVariant.cart_quantity ?? 0,
        0,
      )
    : 0;
  const maxSelectableQuantity = Math.max(1, Math.min(stockCount || 1, 10));
  const actionMessage =
    stockCount < 1
      ? "This product is currently out of stock."
      : selectedVariant || !variants.length
        ? null
        : "Select an available color and size first.";
  const canSubmitCartAction = !actionMessage && Boolean(selectedProductId);
  const hasCartQuantityChanged =
    isSelectedVariantInCart && selectedVariantCartQuantity > 0
      ? quantity !== selectedVariantCartQuantity
      : false;

  useEffect(() => {
    const nextQuantity =
      isSelectedVariantInCart && selectedVariantCartQuantity > 0
        ? selectedVariantCartQuantity
        : 1;

    setQuantity(Math.min(Math.max(nextQuantity, 1), maxSelectableQuantity));
  }, [
    isSelectedVariantInCart,
    maxSelectableQuantity,
    selectedVariant?.id,
    selectedVariantCartQuantity,
  ]);

  useEffect(() => {
    setActiveImageId(getGalleryItemIdForVariant(selectedVariant, galleryItems));
  }, [selectedVariant?.id, product?.id]);

  const showActionToast = ({
    title,
    description,
    type,
  }: {
    title: string;
    description: string;
    type: "success" | "error";
  }) => {
    toast.custom(
      (t) => (
        <div
          className={cn(
            "pointer-events-auto flex min-w-[320px] items-start gap-3 rounded-[18px] border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl transition-all",
            t.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            type === "success"
              ? "border-emerald-200 bg-gradient-to-br from-white via-emerald-50 to-emerald-100/80"
              : "border-rose-200 bg-gradient-to-br from-white via-rose-50 to-orange-50",
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
              type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-500 text-white",
            )}
          >
            {type === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <TrafficCone className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="mt-0.5 text-slate-600">{description}</p>
          </div>
        </div>
      ),
      { duration: type === "success" ? 2600 : 3400 },
    );
  };

  const handleCartAction = async (action: "add" | "remove") => {
    if (!canSubmitCartAction || !selectedProductId) {
      showActionToast({
        title: "Selection required",
        description: actionMessage ?? "Select an available option first.",
        type: "error",
      });
      return false;
    }

    try {
      const response = await addToCart({
        product_id: selectedProductId,
        variant_id: selectedVariantId ?? undefined,
        quantity:
          action === "add"
            ? quantity
            : Math.max(selectedVariantCartQuantity, quantity, 1),
        action,
      }).unwrap();

      if (selectedVariantId) {
        setVariantCartState((prev) => ({
          ...prev,
          [selectedVariantId]: {
            isInCart: action === "add",
            quantity: action === "add" ? quantity : 0,
          },
        }));
      }

      showActionToast({
        title:
          action === "add"
            ? isSelectedVariantInCart
              ? "Cart updated"
              : "Added to cart"
            : "Removed from cart",
        description:
          response.message ??
          (action === "add"
            ? "This variant is now ready for checkout."
            : "This product was removed from your cart."),
        type: "success",
      });
      return Boolean(response.success);
    } catch (error) {
      console.error(`Cart ${action} failed:`, error);
      showActionToast({
        title: isAuthenticated ? "Cart update failed" : "Sign in required",
        description: isAuthenticated
          ? `Unable to ${action === "add" ? "update" : "remove"} this item right now.`
          : "Please sign in to manage your cart.",
        type: "error",
      });
      return false;
    }
  };

  const handleFavouriteToggle = async () => {
    if (!selectedProductId) {
      return;
    }

    const action = isFavourite ? "remove" : "add";

    try {
      const response = await addToFavourite({
        product_id: selectedProductId,
        action,
      }).unwrap();

      setIsFavourite(action === "add");
      showActionToast({
        title:
          action === "add" ? "Saved to favourites" : "Removed from favourites",
        description:
          response.message ??
          (action === "add"
            ? "You can find this product in your favourites later."
            : "This product was removed from your favourites."),
        type: "success",
      });
    } catch (error) {
      console.error(`Favourite ${action} failed:`, error);
      showActionToast({
        title: isAuthenticated ? "Favourite update failed" : "Sign in required",
        description: isAuthenticated
          ? "Unable to update your favourites right now."
          : "Please sign in to manage your favourites.",
        type: "error",
      });
    }
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedColorId(variant.color.id);
    setSelectedSizeId(variant.size.id);
  };

  const handleGalleryImageChange = (item: GalleryItem) => {
    setActiveImageId(item.id);

    if (item.type === "variant" && item.variant) {
      handleVariantChange(item.variant);
    }
  };

  const handleAddToCartClick = async () => {
    await handleCartAction("add");
  };

  const handleBuyNowClick = async () => {
    if (!isSelectedVariantInCart || hasCartQuantityChanged) {
      const added = await handleCartAction("add");
      if (!added) {
        return;
      }
    }

    router.push("/checkout");
  };

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
              <span className="font-medium">{getBrandName(product.brand)}</span>
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
            items={galleryItems}
            productName={product.title ?? "Product"}
            isFavourite={isFavourite}
            isFavouriteUpdating={isFavouriteUpdating}
            onFavouriteToggle={handleFavouriteToggle}
            activeImageId={activeImageId}
            onImageChange={handleGalleryImageChange}
          />

          <ProductSpecifications
            className="hidden md:block"
            specifications={product.specifications ?? {}}
          />
        </div>

        <div className="space-y-6">
          <div className="hidden space-y-3 md:block">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{getBrandName(product.brand)}</span>
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
            max={maxSelectableQuantity}
          />

          <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
            <Button
              variant="accent"
              size="lg"
              disabled={!canSubmitCartAction || isCartUpdating}
              onClick={handleAddToCartClick}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                {isCartUpdating
                  ? "Updating..."
                  : isSelectedVariantInCart
                    ? "Update Cart"
                    : "Add to Cart"}
              </div>
            </Button>
            <Button
              size="lg"
              disabled={!canSubmitCartAction || isCartUpdating}
              onClick={handleBuyNowClick}
            >
              {isCartUpdating ? "Updating..." : "Buy Now"}
            </Button>
          </div>

          {actionMessage ? (
            <p className="text-sm text-red-500">{actionMessage}</p>
          ) : isSelectedVariantInCart ? (
            <p className="text-sm text-emerald-700">
              {selectedVariantCartQuantity} item
              {selectedVariantCartQuantity === 1 ? "" : "s"} of this variant in
              your cart.
            </p>
          ) : null}

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
