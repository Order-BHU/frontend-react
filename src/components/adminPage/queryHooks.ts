import { useQuery, useMutation } from "@tanstack/react-query";
import {
  driverList,
  updateOrder,
  allOrders,
  dashboard,
  editProfile,
  updatePfp,
} from "@/api/misc";
import { myOrders } from "@/api/restaurant";

export function useDashboardQuery() {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: dashboard,
    refetchOnWindowFocus: false,
  });
}

export function useEditProfileMutate(
  successFn: (data: any) => void,
  errorFn: (error: Error) => void
) {
  return useMutation({
    mutationFn: editProfile,
    onSuccess: (data) => {
      successFn(data);
    },
    onError: (error) => {
      errorFn(error);
    },
  });
}

export function useMyOrdersQuery(
  ordertype: "pending" | "delivering" | "accepted" | "ready" | "history"
) {
  useQuery({
    queryFn: () => myOrders(ordertype),
    queryKey: [`order-${ordertype}`],
    staleTime: 300000,
  });
}
