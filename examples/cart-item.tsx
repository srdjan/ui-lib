/** @jsx h */
/// <reference path="../src/lib/jsx.d.ts" />
import {
  defineComponent,
  del,
  h,
  number,
  patch,
  post,
  renderComponent,
  string,
} from "../src/index.ts";
import type { GeneratedApiMap } from "../src/index.ts";

// Demo-only helpers (stubbed). In a real app these would query a DB/session.
function updateCartQuantity(
  _productId: string,
  _quantity: number,
): Promise<void> {
  return Promise.resolve();
}
function getProductName(productId: string): Promise<string> {
  return Promise.resolve(`Product ${productId}`);
}
function getProductPrice(_productId: string): Promise<number> {
  return Promise.resolve(19.99);
}
function removeFromCart(_productId: string): Promise<void> {
  return Promise.resolve();
}
function addToFavorites(_productId: string): Promise<void> {
  return Promise.resolve();
}

defineComponent("cart-item", {
  api: {
    // JSON in, HTML out: request body is JSON (json-enc), HTML returned for swapping
    updateQuantity: patch(
      "/api/cart/:productId/quantity",
      async (req, params) => {
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
      },
    ),

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
    productId = string("1") as unknown as string,
    name = string("Product") as unknown as string,
    quantity = number(1) as unknown as number,
    price = number(0) as unknown as number,
  }, api: GeneratedApiMap) => (
    <div class="cart-item" data-product-id={productId}>
      <h3>{name}</h3>
      <div class="quantity-controls">
        <input
          type="number"
          name="quantity"
          value={quantity}
          // Trigger JSON submission on change; API helper adds default headers and encodings
          hx-trigger="change"
          {...api.updateQuantity(productId, {})}
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
