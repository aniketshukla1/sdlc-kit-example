import type { Order } from "@/features/orders/api/useOrder";

type OrderSummaryProps = {
  order: Order;
};

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <main>
      <h1>Order {order.id}</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Quantity</th>
            <th scope="col">Unit price</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((line) => (
            <tr key={line.sku}>
              <td>{line.name}</td>
              <td>{line.quantity}</td>
              <td>${line.unit_price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2}>Total</th>
            <td>${order.total}</td>
          </tr>
        </tfoot>
      </table>
    </main>
  );
}
