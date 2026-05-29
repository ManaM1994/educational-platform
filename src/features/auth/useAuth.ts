import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "./authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, clearUser } from "./authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    retry: false,
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (isError) {
      dispatch(clearUser());
      return;
    }
    if (isSuccess && data) {
      dispatch(setUser(data));
    }
  }, [data, isError, isSuccess, dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
