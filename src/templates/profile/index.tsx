"use client";
import React from "react";
import moment from "moment";
import MyProfileLayout from "./profile-layout";
import DataTable, { Column } from "@/components/table";
import { Order } from "./demo-data";
import { useOrderListQuery } from "@/features/orders/orderApiSlice";

// Example data type

const MyOrderPage = () => {
  const { data } = useOrderListQuery();
  const orders =
    data?.data?.map((item) => ({
      id: item.id,
      order_id: item.tracking_number,
      created_at: moment(item.created_at).format("MMM D, YYYY"),
      delivery_date: item.delivery_date,
      status: item.status,
    })) || [];
  const columns: Column<Order>[] = [
    { key: "order_id", header: "Order" },
    { key: "created_at", header: "Order Placed", sortable: true },
    { key: "delivery_date", header: "Delivery Date", sortable: true },
    { key: "status", header: "Status" },
  ];

  return (
    <MyProfileLayout>
      <div>
        <h3>My Orders</h3>
        <DataTable
          data={orders}
          columns={columns}
          defaultPageSize={10}
          isShowActions
          className="mt-8"
        />
      </div>
    </MyProfileLayout>
  );
};

export default MyOrderPage;
