"use client";
import React, { useMemo, useState } from "react";
import moment from "moment";
import MyProfileLayout from "./profile-layout";
import DataTable, { Column } from "@/components/table";
import {
  useOrderListQuery,
  useUpdateOrderMutation,
} from "@/features/orders/orderApiSlice";
import type { OrderItem } from "@/features/orders/types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/buttons/primary-button";
import toast from "react-hot-toast";

type OrderTableRow = {
  id: string;
  orderNumber: string;
  orderPlaced: string;
  itemsCount: number;
  total: string;
  paymentStatus: string;
  status: string;
  order: OrderItem;
};

type OrderActionType = "cancel" | "refund";

const actionCopy: Record<
  OrderActionType,
  {
    title: string;
    description: string;
    policy: string;
    confirmLabel: string;
    successFallback: string;
  }
> = {
  cancel: {
    title: "Cancel order",
    description:
      "This request will cancel the order before it moves further into fulfillment.",
    policy:
      "Cancellation policy: you should only cancel orders that are still pending. Once the cancellation is confirmed, the order will not be processed further.",
    confirmLabel: "Confirm cancellation",
    successFallback: "Order cancelled successfully.",
  },
  refund: {
    title: "Request refund",
    description:
      "This request will be sent to the backend for refund review and processing.",
    policy:
      "Refund policy: refund requests are reviewed against payment and fulfillment status. Approved refunds are returned to the original payment method based on your payment provider timeline.",
    confirmLabel: "Request refund",
    successFallback: "Refund request submitted successfully.",
  },
};

const getStatusTone = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === "approved" || normalized === "paid") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (normalized === "pending") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (normalized === "cancelled" || normalized === "refunded") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
};

const formatMoney = (amount: string, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Number(amount));

const formatAddress = (order: OrderItem) => {
  const address = order.shipping_address;
  return [
    `${address.first_name} ${address.last_name}`.trim(),
    address.address_line_1,
    address.address_line_2,
    `${address.city}, ${address.state_province} ${address.postal_code}`.trim(),
    address.country,
    address.phone,
    address.email,
  ]
    .filter(Boolean)
    .join(", ");
};

const MyOrderPage = () => {
  const { data, isLoading } = useOrderListQuery();
  const [updateOrder, { isLoading: isUpdatingOrder }] = useUpdateOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    order: OrderItem;
    action: OrderActionType;
  } | null>(null);

  const orders = useMemo<OrderTableRow[]>(
    () =>
      data?.data?.map((item) => ({
        id: item.id,
        orderNumber: item.tracking_number,
        orderPlaced: moment(item.created_at).format("MMM D, YYYY"),
        itemsCount: item.items.reduce((sum, line) => sum + line.quantity, 0),
        total: formatMoney(item.total_amount, item.currency),
        paymentStatus: item.payment_status,
        status: item.status,
        order: item,
      })) || [],
    [data],
  );

  const columns: Column<OrderTableRow>[] = [
    { key: "orderNumber", header: "Order", sortable: true },
    { key: "orderPlaced", header: "Order Placed", sortable: true },
    {
      key: "itemsCount",
      header: "Items",
      sortable: true,
      render: (row) => `${row.itemsCount} item${row.itemsCount > 1 ? "s" : ""}`,
    },
    { key: "total", header: "Total", sortable: true },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (row) => (
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusTone(
            row.paymentStatus,
          )}`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusTone(
            row.status,
          )}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const handleSubmitAction = async () => {
    if (!actionTarget) return;

    try {
      const response = await updateOrder({
        order_id: actionTarget.order.id,
        action: actionTarget.action,
      }).unwrap();

      toast.success(
        response.message ||
          actionCopy[actionTarget.action].successFallback,
      );
      setActionTarget(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Unable to update the order right now.",
      );
    }
  };

  return (
    <MyProfileLayout>
      <div>
        <h3>My Orders</h3>
        <DataTable
          data={orders}
          columns={columns}
          defaultPageSize={10}
          isShowActions
          renderRowActions={(row) => {
            const nextAction: OrderActionType =
              row.status.toLowerCase() === "pending" ? "cancel" : "refund";

            return (
              <>
                <DropdownMenuItem onSelect={() => setSelectedOrder(row.order)}>
                  View details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    setActionTarget({ order: row.order, action: nextAction })
                  }
                >
                  {nextAction === "cancel" ? "Cancel order" : "Refund order"}
                </DropdownMenuItem>
              </>
            );
          }}
          emptyState={
            isLoading ? "Loading your orders..." : "You have no orders yet."
          }
          className="mt-8"
        />
      </div>

      <Drawer
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
        direction="right"
      >
        <DrawerContent className="right-0 left-auto !w-full !max-w-[560px] rounded-none border-l border-primary/10">
          <DrawerHeader className="border-b border-gray-200 px-6 py-5 text-left">
            <DrawerTitle className="text-xl">Order details</DrawerTitle>
            <DrawerDescription>
              {selectedOrder
                ? `Order ${selectedOrder.tracking_number}`
                : "Review your order summary and shipping details."}
            </DrawerDescription>
          </DrawerHeader>

          {selectedOrder ? (
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Payment
                  </p>
                  <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                    {selectedOrder.payment_status}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Placed on
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {moment(selectedOrder.created_at).format("MMM D, YYYY h:mm A")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Total
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatMoney(selectedOrder.total_amount, selectedOrder.currency)}
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-gray-950">Items</h4>
                  <span className="text-sm text-gray-500">
                    {selectedOrder.items.length} product
                    {selectedOrder.items.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-950">
                            {item.product_title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.variant_description}
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            SKU: {item.sku}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>Qty: {item.quantity}</p>
                          <p className="mt-1 font-medium text-gray-950">
                            {formatMoney(item.total_price, selectedOrder.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-base font-semibold text-gray-950">
                  Shipping details
                </h4>
                <div className="rounded-2xl border border-gray-200 p-4 text-sm leading-6 text-gray-600">
                  {formatAddress(selectedOrder)}
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-base font-semibold text-gray-950">
                  Payment summary
                </h4>
                <div className="rounded-2xl border border-gray-200 p-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>
                      {formatMoney(selectedOrder.subtotal, selectedOrder.currency)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Discount</span>
                    <span>
                      {formatMoney(
                        selectedOrder.discount_amount,
                        selectedOrder.currency,
                      )}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Shipping</span>
                    <span>
                      {formatMoney(
                        selectedOrder.shipping_charge,
                        selectedOrder.currency,
                      )}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Tax</span>
                    <span>
                      {formatMoney(selectedOrder.tax_amount, selectedOrder.currency)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 font-semibold text-gray-950">
                    <span>Total</span>
                    <span>
                      {formatMoney(
                        selectedOrder.total_amount,
                        selectedOrder.currency,
                      )}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          <DrawerFooter className="border-t border-gray-200 px-6 py-4" />
        </DrawerContent>
      </Drawer>

      <Dialog
        open={Boolean(actionTarget)}
        onOpenChange={(open) => {
          if (!open) setActionTarget(null);
        }}
      >
        <DialogContent className="max-w-xl rounded-3xl border-0 p-0">
          {actionTarget ? (
            <>
              <DialogHeader className="border-b border-gray-100 px-6 py-6 text-left">
                <DialogTitle className="text-2xl text-gray-950">
                  {actionCopy[actionTarget.action].title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-6 text-gray-500">
                  {actionCopy[actionTarget.action].description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 px-6 py-6">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-950">
                    Order {actionTarget.order.tracking_number}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Total:{" "}
                    {formatMoney(
                      actionTarget.order.total_amount,
                      actionTarget.order.currency,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4 text-sm leading-6 text-gray-600">
                  {actionCopy[actionTarget.action].policy}
                </div>
              </div>

              <DialogFooter className="border-t border-gray-100 px-6 py-5 sm:justify-between">
                <Button
                  variant="accent"
                  size="xs"
                  isArrow={false}
                  onClick={() => setActionTarget(null)}
                  className="w-full sm:w-auto"
                >
                  Keep order
                </Button>
                <Button
                  size="xs"
                  isArrow={false}
                  onClick={handleSubmitAction}
                  disabled={isUpdatingOrder}
                  className="w-full sm:w-auto"
                >
                  {isUpdatingOrder
                    ? "Submitting..."
                    : actionCopy[actionTarget.action].confirmLabel}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </MyProfileLayout>
  );
};

export default MyOrderPage;
