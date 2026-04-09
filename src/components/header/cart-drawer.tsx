"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import Image from "next/image";
import Button from "../buttons/primary-button";
import Title from "../ui/title";
import {
  useAddToCartMutation,
  useCartItemListQuery,
} from "@/features/products/productApiSlice";
import { useAppSelector } from "@/hooks/redux";
import { CartItem } from "@/features/products/types";
import { DialogTrigger } from "../ui/dialog";
import { Cart } from "@/assets/algo-icons";
import IconButton from "../buttons/icon-button";
import { useState } from "react";

const getCartItemImage = (item: CartItem) =>
  item.variant?.image_url ??
  item.product?.image_url ??
  "https://placehold.co/200x200?text=Product";

const formatPrice = (value?: string | number) => {
  const parsed = Number(value ?? 0);
  return `$${parsed.toFixed(2)}`;
};

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, isLoading, isFetching } = useCartItemListQuery(undefined, {
    skip: !isAuthenticated,
  });
  const total_items = data?.meta?.total_items || 0;
  const [addToCart, { isLoading: isRemoving }] = useAddToCartMutation();

  const cartItems = data?.data ?? [];
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity ?? 0),
    0,
  );
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price ?? 0),
    0,
  );

  const handleRemove = async (item: CartItem) => {
    const productId = item.product?.id ?? item.product_id;
    if (!productId) {
      return;
    }

    try {
      await addToCart({
        product_id: String(productId),
        variant_id: item.variant?.id ? String(item.variant.id) : undefined,
        action: "remove",
      }).unwrap();
    } catch (error) {
      console.error("Removing cart item failed:", error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DialogTrigger asChild>
        <div className="relative">
          {total_items && (
            <span className="absolute top-0 right-0 text-xs bg-red-500 h-6 w-6 rounded-full text-white center z-20">
              {total_items}
            </span>
          )}
          <IconButton icon={Cart} size={6} />
        </div>
      </DialogTrigger>

      <DrawerContent className="right-0 left-auto !max-w-[420px] w-full rounded-none border-l border-l-primary/10">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
          <Title variant="sm">Your Cart</Title>
          <DrawerDescription>Items you’ve added to cart</DrawerDescription>
        </DrawerHeader>

        <div className="flex max-h-[70vh] flex-col gap-5 overflow-y-auto px-4 py-2">
          {!isAuthenticated ? (
            <p className="text-sm text-gray-500">
              Sign in to view your cart items.
            </p>
          ) : isLoading || isFetching ? (
            <p className="text-sm text-gray-500">Loading cart items...</p>
          ) : !cartItems.length ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 border-b border-b-gray-200 pb-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src={getCartItemImage(item)}
                    alt={item.product?.title ?? "Cart item"}
                    height={100}
                    width={100}
                    className="h-16 w-16 rounded-md border object-cover"
                  />
                  <div className="min-w-0">
                    <p className="w-fit text-xs font-semibold text-primary">
                      {item.product?.brand ?? "Brand"}
                    </p>
                    <h5 className="truncate font-medium">
                      {item.product?.title ?? "Product"}
                    </h5>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                      {item.variant?.color?.name ? (
                        <span>Color: {item.variant.color.name}</span>
                      ) : null}
                      {item.variant?.size?.name ? (
                        <span>Size: {item.variant.size.name}</span>
                      ) : null}
                      <span>Qty: {item.quantity ?? 0}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {formatPrice(item.total_price ?? item.unit_price)}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="alert"
                    size="xs"
                    className="px-4"
                    onClick={() => handleRemove(item)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DrawerFooter className="border-t border-t-gray-200">
          {isAuthenticated && cartItems.length ? (
            <div className="flex w-full items-center justify-between text-sm text-gray-600">
              <span>{totalItems} item(s)</span>
              <span className="font-semibold text-gray-900">
                Subtotal: {formatPrice(subtotal)}
              </span>
            </div>
          ) : null}
          <Button
            className="w-full"
            link={isAuthenticated && cartItems.length ? "/checkout" : null}
            disabled={!isAuthenticated || !cartItems.length}
          >
            Checkout
          </Button>
          <DrawerClose asChild>
            <Button variant="rubix" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
