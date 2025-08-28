/** @jsx h */
/// <reference path="../src/lib/jsx.d.ts" />
import {
  defineComponent,
  h,
  patch,
  del,
  post,
  renderComponent,
  string,
  number,
} from "../src/index.ts";
import type { GeneratedApiMap } from "../src/index.ts";

// Demo-only helpers (stubbed). In a real app these would query a DB/session.
async function updateCartQuantity(_productId: string, _quantity: number): Promise<void> {}
async function getProductName(productId: string): Promise<string> { return `Product ${productId}`; }
async function getProductPrice(_productId: string): Promise<number> { return 19.99; }
async function removeFromCart(_productId: string): Promise<void> {}
async function addToFavorites(_productId: string): Promise<void> {}

defineComponent("cart-item", {
  api: {
    // JSON in, HTML out: request body is JSON (json-enc), HTML returned for swapping
    updateQuantity: patch("/api/cart/:productId/quantity", async (req, params) => {
      const body = await req.json() as { quantity?: number };
      const newQuantity = Number(body.quantity ?? 0);

      await updateCartQuantity(params.productId, newQuantity);

      return new Response(
        renderComponent("cart-item", {
          productId: params.productId,
          name: await getProductName(params.productId),
          quantity: newQuantity,
          price: await getProductPrice(params.productId),
        }),
        { headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }),

    remove: del("/api/cart/:productId", async (_req, params) => {
      await removeFromCart(params.productId);
      return new Response("", { status: 200 });
    }),

    favorite: post("/api/cart/:productId/favorite", async (_req, params) => {
      await addToFavorites(params.productId);
      return new Response(
        renderComponent("cart-item", {
          productId: params.productId,
          name: await getProductName(params.productId),
          quantity: 1,
          price: await getProductPrice(params.productId),
        }),
        { headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }),
  },

  render: ({
    productId = string("1"),
    name = string("Product"),
    quantity = number(1),
    price = number(0),
  }: any, api: GeneratedApiMap) => (
    <div class="cart-item" data-product-id={productId}>
      <h3>{name}</h3>
      <div class="quantity-controls">
        <input
          type="number"
          name="quantity"
          value={quantity}
          // Trigger JSON submission on change; API helper adds default headers and encodings
          hx-trigger="change"
          {...api.updateQuantity(productId, {}, { target: "closest .cart-item" })}
        />
      </div>
      <div class="price">${price}</div>
      <div class="actions">
        <button {...api.favorite(productId)}>
          ❤️ Favorite
        </button>
        <button {...api.remove(productId)}>
          🗑️ Remove
        </button>
      </div>
    </div>
  ),
});

console.log("✅ cart-item registered");
