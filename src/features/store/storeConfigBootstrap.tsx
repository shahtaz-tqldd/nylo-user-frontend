"use client";

import { useEffect } from "react";
import { useStoreConfigQuery } from "./storeApiSlice";
import { storeConfigFailed, storeConfigReceived } from "./storeSlice";
import { useAppDispatch } from "@/hooks/redux";

const StoreConfigBootstrap = () => {
  const dispatch = useAppDispatch();
  const { data, error, isError } = useStoreConfigQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(storeConfigReceived(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!isError) return;

    let errorMessage = "Unable to load store configuration.";
    if (error && typeof error === "object" && "status" in error) {
      errorMessage = `Unable to load store configuration (${String(error.status)}).`;
    }

    dispatch(storeConfigFailed(errorMessage));
  }, [dispatch, error, isError]);

  return null;
};

export default StoreConfigBootstrap;
