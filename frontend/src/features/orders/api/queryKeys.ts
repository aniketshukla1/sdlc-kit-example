export const orderKeys = {
  detail: (orderId: number) => ["orders", orderId] as const,
};
