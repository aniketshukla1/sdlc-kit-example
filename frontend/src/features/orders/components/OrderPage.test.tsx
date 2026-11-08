import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import type { Order } from "@/features/orders/api/useOrder";
import { OrderPage } from "@/features/orders/components/OrderPage";

const ORDER: Order = {
  id: 1001,
  lines: [
    { sku: "TEA-250", name: "Green tea 250 g", unit_price: "10.00", quantity: 2 },
    { sku: "MUG-01", name: "Ceramic mug", unit_price: "14.50", quantity: 1 },
  ],
  total: "34.50",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <OrderPage orderId={1001} />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("shows a loading message while the order is on its way", () => {
  vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

  renderPage();

  expect(screen.getByRole("status").textContent).toBe("Loading order…");
});

it("shows each line's name and price, and the order total", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(ORDER)));

  renderPage();

  const heading = await screen.findByRole("heading");
  const cells = screen.getAllByRole("cell").map((cell) => cell.textContent);
  expect(heading.textContent).toBe("Order 1001");
  expect(cells).toEqual(
    expect.arrayContaining(["Green tea 250 g", "$10.00", "Ceramic mug", "$14.50", "$34.50"]),
  );
});

it("shows how many of each item were ordered", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(ORDER)));
  const [tea, mug] = ORDER.lines;

  renderPage();

  await screen.findByRole("heading");
  const headers = screen.getAllByRole("columnheader").map((header) => header.textContent);
  const cellsOf = (name: RegExp) =>
    within(screen.getByRole("row", { name }))
      .getAllByRole("cell")
      .map((cell) => cell.textContent);
  expect(headers).toEqual(["Item", "Quantity", "Unit price"]);
  expect(cellsOf(/Green tea/)).toEqual([tea.name, String(tea.quantity), `$${tea.unit_price}`]);
  expect(cellsOf(/Ceramic mug/)).toEqual([mug.name, String(mug.quantity), `$${mug.unit_price}`]);
});

it("says so when the order has no items", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ...ORDER, lines: [] })));

  renderPage();

  expect((await screen.findByText(/no items/)).textContent).toBe("This order has no items yet.");
});

it("shows an error when the request fails, and tries again on request", async () => {
  const fetchOrder = vi
    .fn()
    .mockResolvedValueOnce(jsonResponse({ detail: "boom" }, 500))
    .mockResolvedValueOnce(jsonResponse(ORDER));
  vi.stubGlobal("fetch", fetchOrder);

  renderPage();
  const alert = await screen.findByRole("alert");
  expect(alert.textContent).toContain("Could not load this order.");
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));

  expect((await screen.findByRole("heading")).textContent).toBe("Order 1001");
});
