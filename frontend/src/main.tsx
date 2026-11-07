import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { OrderPage } from "@/features/orders/components/OrderPage";

const DEMO_ORDER_ID = 1001;

const root = document.getElementById("root");
if (!root) throw new Error("index.html has no #root element");

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <OrderPage orderId={DEMO_ORDER_ID} />
    </QueryClientProvider>
  </StrictMode>,
);
