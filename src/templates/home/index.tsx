"use client";

import React from "react";

// sections
import Hero from "./hero";
import NewArrivals from "./new-arrivals";
import NewCollections from "./new-collections";
import Trending from "./trending";
import Details from "./details";
import HotDeals from "./hot-deals";

// services
import { useFeaturedItemsQuery } from "@/features/products/productApiSlice";

const Homepage = () => {
  const { data } = useFeaturedItemsQuery();

  return (
    <React.Fragment>
      <Hero product={data?.data?.signature_items[0]?.product} />
      <NewArrivals />
      <NewCollections />
      <Trending products={data?.data?.best_selling_products || []} />
      <Details />
      <HotDeals products={data?.data?.offer_items || []} />
    </React.Fragment>
  );
};

export default Homepage;
