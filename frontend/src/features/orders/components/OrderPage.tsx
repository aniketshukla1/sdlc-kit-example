import { useOrder } from "@/features/orders/api/useOrder";
import { OrderSummary } from "@/features/orders/components/OrderSummary";

type OrderPageProps = {
  orderId: number;
};

export function OrderPage({ orderId }: OrderPageProps) {
  const { data: order, isPending, isError, refetch } = useOrder(orderId);

  if (isPending) return <p role="status">Loading order…</p>;
  if (isError) {
    return (
      <div role="alert">
        <p>Could not load this order.</p>
        <button type="button" onClick={() => void refetch()}>
          Try again
        </button>
      </div>
    );
  }
  if (order.lines.length === 0) return <p>This order has no items yet.</p>;
  return <OrderSummary order={order} />;
}
