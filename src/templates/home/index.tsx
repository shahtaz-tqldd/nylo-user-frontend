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

  const bestSellingProducts = data?.data?.best_selling_products || [];
  const offerItems = data?.data?.offer_items || [];

  return (
    <React.Fragment>
      <Hero product={data?.data?.signature_items[0]?.product} />
      <NewArrivals />
      <NewCollections />
      {bestSellingProducts.length > 0 && (
        <Trending products={bestSellingProducts} />
      )}
      <Details />
      {offerItems.length > 0 && <HotDeals products={offerItems} />}
    </React.Fragment>
  );
};

export default Homepage;
