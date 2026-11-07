import { useQuery } from "@tanstack/react-query";

import type { components } from "@/api/schema";
import { orderKeys } from "@/features/orders/api/queryKeys";
import { apiGet } from "@/lib/apiClient";

export type Order = components["schemas"]["OrderRead"];

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => apiGet<Order>(`/api/v1/orders/${orderId}`),
  });
}
