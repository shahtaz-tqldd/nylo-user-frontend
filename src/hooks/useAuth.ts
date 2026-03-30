import { useEffect } from "react";
import { userDetailsFetched, userLoggedOut } from "@/features/auth/authSlice";
import { useMeQuery } from "@/features/auth/authApiSlice";
import { useAppDispatch, useAppSelector } from "./redux";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data, isSuccess, isLoading, isError, refetch } = useMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (isAuthenticated && isSuccess && data?.data) {
      dispatch(userDetailsFetched(data.data));
    }
  }, [isSuccess, data, dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && isError) {
      dispatch(userLoggedOut());
    }
  }, [dispatch, isAuthenticated, isError]);

  const authChecked = !isAuthenticated || isSuccess;

  return {
    isLoading: isLoading || (isAuthenticated && !authChecked),
    authChecked,
    refetchProfile: refetch,
  };
};

export default useAuth;
