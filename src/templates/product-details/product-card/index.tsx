"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, Minus, Plus } from "lucide-react";
import { useDispatch } from "react-redux";

import { CartPlusIcon } from "@/assets/algo-icons";
import NavigateButton from "@/components/buttons/navigate-button";
import Button from "@/components/buttons/primary-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { openAuthDialog } from "@/features/auth/authSlice";
import { useAddToCartMutation } from "@/features/products/productApiSlice";
import { Product, ProductBrand } from "@/features/products/types";
import { useAppSelector } from "@/hooks/redux";
import { productName } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md";
  isLanding?: boolean;
}

type VariantCartState = Record<
  string,
  {
    isInCart: boolean;
    quantity: number;
  }
>;

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=100&w=350";

const sizeStyles = {
  sm: {
    imageHeight: "h-[220px]",
    title: "text-[15px]",
    meta: "text-[11px]",
    price: "text-base",
    comparePrice: "text-xs",
    button: "h-10 px-4 text-sm",
    cardPadding: "p-3.5",
  },
  md: {
    imageHeight: "h-[300px]",
    title: "text-base",
    meta: "text-xs",
    price: "text-xl",
    comparePrice: "text-sm",
    button: "h-11 px-5 text-sm",
    cardPadding: "p-4",
  },
};

const ProductCard = ({
  product,
  size = "md",
  isLanding = false,
}: ProductCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [addToCart, { isLoading: isCartUpdating }] = useAddToCartMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [hasManualQuantityChange, setHasManualQuantityChange] = useState(false);
  const [variantCartState, setVariantCartState] = useState<VariantCartState>(
    {},
  );
  const styles = sizeStyles[size];

  const productTitle = product.title ?? product.name ?? "Product";
  const productSlug = product.slug ?? productTitle;
  const productId = getProductId(product);
  const variants = product.variant_options ?? [];

  const imageSrc =
    product.image_url ||
    (typeof product.image === "string" ? product.image : product.image?.src) ||
    PLACEHOLDER_IMAGE;

  const numericPrice = (product.price ?? "").replace(/[^0-9.]/g, "");
  const comparePriceRaw =
    product.compare_price ??
    product.discountPrice?.replace(/[^0-9.]/g, "") ??
    numericPrice;

  const priceValue = parseFloat(numericPrice || "0");
  const compareValue = parseFloat(comparePriceRaw || "0");

  const hasDiscount = compareValue > priceValue && priceValue > 0;

  const discount =
    product.discount ??
    (hasDiscount
      ? `${Math.max(
          Math.round(((compareValue - priceValue) / compareValue) * 100),
          0,
        )}%`
      : undefined);

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    variants[0] ??
    null;
  const selectedVariantKey = selectedVariant?.id ?? null;
  const selectedVariantState = selectedVariantKey
    ? variantCartState[selectedVariantKey]
    : undefined;
  const selectedVariantInCart = Boolean(
    selectedVariantState?.isInCart ?? selectedVariant?.added_to_cart,
  );
  const selectedVariantCartQuantity = Math.max(
    selectedVariantState?.quantity ?? selectedVariant?.cart_quantity ?? 0,
    0,
  );
  const hasQuantityChanged = selectedVariantInCart
    ? hasManualQuantityChange && quantity !== selectedVariantCartQuantity
    : false;
  const brandName = getBrandName(product.brand);
  const visibleVariants = variants.slice(0, 4);
  const remainingVariants = Math.max(
    variants.length - visibleVariants.length,
    0,
  );

  useEffect(() => {
    const nextState = variants.reduce<VariantCartState>((acc, variant) => {
      acc[variant.id] = {
        isInCart: Boolean(variant.added_to_cart),
        quantity: Math.max(variant.cart_quantity ?? 0, 0),
      };
      return acc;
    }, {});

    setVariantCartState(nextState);
  }, [variants]);

  useEffect(() => {
    if (!variants.length) {
      setSelectedVariantId(null);
      return;
    }

    if (
      !selectedVariantId ||
      !variants.some((variant) => variant.id === selectedVariantId)
    ) {
      setSelectedVariantId(variants[0].id);
    }
  }, [selectedVariantId, variants]);

  useEffect(() => {
    if (!selectedVariant) {
      setQuantity(1);
      setHasManualQuantityChange(false);
      return;
    }

    const nextQuantity =
      selectedVariantInCart && selectedVariantCartQuantity > 0
        ? selectedVariantCartQuantity
        : 1;

    setQuantity(nextQuantity);
    setHasManualQuantityChange(false);
  }, [selectedVariantKey, selectedVariantCartQuantity, selectedVariantInCart]);

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedVariantId && variants.length) {
      setSelectedVariantId(variants[0].id);
    }

    setIsModalOpen(true);
  };

  const handleViewProduct = (variantId?: string | null) => {
    const href = getProductHref(
      productSlug,
      variantId ?? selectedVariant?.id ?? null,
    );
    setIsModalOpen(false);
    router.push(href);
  };

  const handleCartAction = async (action: "add" | "remove") => {
    if (!selectedVariant) {
      toast.error("Select a variant first.");
      return;
    }

    if (!productId) {
      toast.error("Product id is missing in this list response.");
      return;
    }

    if (!isAuthenticated) {
      dispatch(openAuthDialog());
      return;
    }

    try {
      const response = await addToCart({
        product_id: productId,
        variant_id: selectedVariant.id,
        quantity:
          action === "add"
            ? quantity
            : Math.max(selectedVariantCartQuantity, quantity, 1),
        action,
      }).unwrap();

      setVariantCartState((prev) => ({
        ...prev,
        [selectedVariant.id]: {
          isInCart: action === "add",
          quantity: action === "add" ? quantity : 0,
        },
      }));
      setHasManualQuantityChange(false);

      toast.success(
        response.message ??
          (action === "add"
            ? selectedVariantInCart
              ? "Cart updated."
              : "Variant added to cart."
            : "Variant removed from cart."),
      );
    } catch (error) {
      console.error(`Cart ${action} failed:`, error);
      toast.error(
        isAuthenticated
          ? "Unable to update this cart item right now."
          : "Please sign in to manage your cart.",
      );
    }
  };

  const handlePrimaryAction = async () => {
    if (!selectedVariant) {
      toast.error("Select a variant first.");
      return;
    }

    if (selectedVariantInCart && !hasQuantityChanged) {
      if (!isAuthenticated) {
        dispatch(openAuthDialog());
        return;
      }

      setIsModalOpen(false);
      router.push("/checkout");
      return;
    }

    await handleCartAction("add");
  };

  const primaryActionLabel = !selectedVariant
    ? "Add to Cart"
    : selectedVariantInCart
      ? hasQuantityChanged
        ? "Update Cart"
        : "Checkout"
      : "Add to Cart";

  return (
    <>
      <Link
        href={`/products/${productName(productSlug)}`}
        className="group block h-full"
      >
        <article
          className={cn(
            "h-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-xl",
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden bg-gray-100",
              isLanding ? "h-[240px]" : styles.imageHeight,
            )}
          >
            <Image
              src={imageSrc}
              alt={productTitle}
              height={500}
              width={500}
              className="h-full w-full object-contain transition-transform duration-500 will-change-transform group-hover:scale-105"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />

            {discount ? (
              <DiscountBadge discount={discount} size={size} />
            ) : null}
          </div>

          <div
            className={cn(
              "flex h-fit flex-col justify-between gap-3",
              styles.cardPadding,
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-75">
                  {product.category_name} for {product.gender}
                </span>
                <MetaChip text={brandName} className="text-xs" />
              </div>

              <h5
                className={cn(
                  "!text-lg line-clamp-2 min-h-[2.8rem] font-medium",
                  styles.title,
                )}
              >
                {productTitle}
              </h5>

              {variants.length ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {visibleVariants.map((variant, index) => (
                        <span
                          key={variant.id}
                          className={cn(
                            "inline-flex h-5 w-5 rounded-full border-2 border-white shadow-sm",
                            index > 0 && "-ml-1.5",
                          )}
                          style={{ backgroundColor: variant.color_code }}
                          title={`${variant.color_name} / ${variant.size_name}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {variants.length} variant
                      {variants.length === 1 ? "" : "s"}
                      {remainingVariants ? ` available` : ""}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-end justify-between gap-3 pt-1">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1">
                  <span
                    className={cn("font-semibold text-primary", styles.price)}
                  >
                    {formatDisplayPrice(product.price)}
                  </span>

                  {hasDiscount ? (
                    <span
                      className={cn(
                        "text-gray-400 line-through",
                        styles.comparePrice,
                      )}
                    >
                      {formatComparePrice(product.price, comparePriceRaw)}
                    </span>
                  ) : null}
                </div>

                {hasDiscount ? (
                  <p className="mt-1 text-xs font-medium text-emerald-600">
                    You save {discount}
                  </p>
                ) : null}
              </div>

              <NavigateButton
                onClick={handleOpenModal}
                className={cn(
                  "shrink-0 rounded-full transition-transform duration-300 group-hover:scale-[1.02]",
                  styles.button,
                )}
                icon={CartPlusIcon}
              >
                Add
              </NavigateButton>
            </div>
          </div>
        </article>
      </Link>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl rounded-[28px] border-0 p-0 sm:max-w-3xl">
          <div className="grid max-h-[85vh] overflow-hidden rounded-[28px] bg-white md:grid-cols-[1.08fr_0.92fr]">
            <div className="flex max-h-[85vh] flex-col">
              <DialogHeader className="space-y-2 border-b border-gray-100 px-6 pb-4 pt-6 text-left">
                <DialogTitle className="text-2xl text-gray-950">
                  {productTitle}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Select your preferred variant from the list
                </DialogDescription>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-primary">
                    {formatDisplayPrice(product.price)}
                  </span>
                  {hasDiscount ? (
                    <span className="text-gray-400 line-through">
                      {formatComparePrice(product.price, comparePriceRaw)}
                    </span>
                  ) : null}
                </div>
              </DialogHeader>

              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                <div className="grid gap-3">
                  {variants.map((variant) => {
                    const variantState = variantCartState[variant.id];
                    const isSelected = variant.id === selectedVariantKey;
                    const isInCart = Boolean(
                      variantState?.isInCart ?? variant.added_to_cart,
                    );
                    const cartQty = Math.max(
                      variantState?.quantity ?? variant.cart_quantity ?? 0,
                      0,
                    );

                    return (
                      <div
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedVariantId(variant.id);
                          }
                        }}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-2xl border p-3 text-left transition-colors",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                        )}
                      >
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={variant.image_url || imageSrc}
                            alt={`${productTitle} ${variant.color_name}`}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {variant.color_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Size {variant.size_name}
                              </p>
                            </div>
                            <span
                              className="h-5 w-5 rounded-full border border-black/10"
                              style={{ backgroundColor: variant.color_code }}
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                                Qty: {cartQty}
                              </span>
                              {isInCart ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                                  <Check className="h-3.5 w-3.5" />
                                  In cart{cartQty > 0 ? ` · ${cartQty}` : ""}
                                </span>
                              ) : (
                                <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                                  Not in cart
                                </span>
                              )}
                            </div>
                            <Button
                              variant="rubix"
                              className="!pr-4 !pl-4 !text-xs"
                              isArrow={false}
                              size="xs"
                              onClick={() => handleViewProduct(variant.id)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex max-h-[85vh] flex-col border-t border-gray-100 bg-gray-50/60 p-6 md:border-l md:border-t-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                      Selected Variant
                    </p>
                    <h4 className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedVariant?.color_name ?? "Select a variant"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Size {selectedVariant?.size_name ?? "--"}
                    </p>
                  </div>
                  {selectedVariant ? (
                    <span
                      className="h-6 w-6 rounded-full border border-black/10"
                      style={{ backgroundColor: selectedVariant.color_code }}
                    />
                  ) : null}
                </div>

                <div className="relative h-[240px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-200">
                  <Image
                    src={selectedVariant?.image_url || imageSrc}
                    alt={
                      selectedVariant ? `${productTitle} variant` : productTitle
                    }
                    fill
                    className="object-contain p-5"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 shadow-sm">
                    {brandName}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Quantity
                      </p>
                    </div>

                    <div className="flex items-center rounded-full border border-primary/25 bg-white p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setHasManualQuantityChange(true);
                          setQuantity((current) => Math.max(1, current - 1));
                        }}
                        disabled={quantity <= 1}
                        className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-12 px-3 text-center font-semibold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setHasManualQuantityChange(true);
                          setQuantity((current) => Math.min(10, current + 1));
                        }}
                        className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {selectedVariantInCart ? (
                    <p className="mt-3 text-xs font-medium text-gray-500">
                      {hasQuantityChanged
                        ? "Quantity changed. Update cart to continue."
                        : "Proceed directly to checkout."}
                    </p>
                  ) : null}
                </div>
              </div>

              <DialogFooter className="mt-auto px-0 pb-0 pt-5">
                <div className="flex w-full gap-3">
                  {selectedVariantInCart ? (
                    <Button
                      variant="alert"
                      className="w-full justify-center"
                      isArrow={false}
                      onClick={() => handleCartAction("remove")}
                      disabled={isCartUpdating}
                      size="xs"
                    >
                      Remove
                    </Button>
                  ) : (
                    <div className="hidden md:block" />
                  )}
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    isArrow={false}
                    onClick={handlePrimaryAction}
                    disabled={isCartUpdating || !selectedVariant}
                    size="xs"
                  >
                    {isCartUpdating ? "Updating..." : primaryActionLabel}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;

const MetaChip = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-medium text-gray-600",
        className,
      )}
    >
      {text}
    </span>
  );
};

const DiscountBadge = ({
  discount,
  size,
}: {
  discount: string;
  size: "sm" | "md";
}) => {
  return (
    <div
      className={cn(
        "absolute right-3 top-3 rounded-full bg-black/90 px-3 py-1.5 text-white shadow-lg backdrop-blur-sm",
        size === "sm" ? "text-[11px]" : "text-xs",
      )}
    >
      <span className="font-semibold">{discount} OFF</span>
    </div>
  );
};

const formatComparePrice = (displayPrice: string, compareRaw: string) => {
  const currencySymbol = displayPrice.replace(/[0-9.,\s]/g, "") || "$";
  return `${currencySymbol}${compareRaw}`;
};

const formatDisplayPrice = (value: string) => {
  const currencySymbol = value.replace(/[0-9.,\s]/g, "") || "$";
  const numericValue = value.replace(/[^0-9.]/g, "");
  return `${currencySymbol}${numericValue}`;
};

const getBrandName = (brand?: string | ProductBrand) => {
  if (!brand) {
    return "";
  }

  return typeof brand === "string" ? brand : brand.name;
};

const getProductHref = (slug: string, variantId: string | null) => {
  const formattedSlug = productName(slug) ?? slug;

  if (!variantId) {
    return `/products/${formattedSlug}`;
  }

  return `/products/${formattedSlug}?variant=${variantId}`;
};

const getProductId = (product: Product) => {
  const value = product.id ?? product.product_id;

  return value ? String(value) : null;
};

export const ProductCardSkeleton = ({
  size = "md",
}: {
  size?: "sm" | "md";
}) => {
  const styles = sizeStyles[size];

  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
      <div className={cn("w-full bg-gray-200", styles.imageHeight)} />
      <div className={cn("space-y-3", styles.cardPadding)}>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
        </div>
        <div className="h-5 w-4/5 rounded bg-gray-200" />
        <div className="h-5 w-2/3 rounded bg-gray-200" />
        <div className="flex items-end justify-between pt-2">
          <div className="space-y-2">
            <div className="h-6 w-24 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
          <div className="h-11 w-24 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
};
