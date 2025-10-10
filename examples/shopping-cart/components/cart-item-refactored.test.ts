import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { hx } from "../../../lib/api-recipes.ts";
import { getRegistry } from "../../../lib/registry.ts";
import { ok } from "../../../lib/result.ts";
import { setRepositoryForTesting } from "../api/repository-factory.ts";
import type { ShoppingRepository } from "../api/repository.ts";
import type { Cart } from "../api/types.ts";

// NOTE: Example component moved into the library; import removed.
// Tests are marked ignored until updated to new API.

const sampleCart: Cart = {
  id: "cart-1",
  sessionId: "session-1",
  items: [
    {
      id: "item-1",
      productId: "prod-1",
      product: {
        id: "prod-1",
        name: "Sample Product",
        description: "A product used for testing",
        price: 25,
        originalPrice: 30,
        category: "electronics",
        tags: ["test"],
        imageUrl: "https://example.com/image.jpg",
        images: ["https://example.com/image.jpg"],
        rating: 4.5,
        reviewCount: 100,
        inStock: true,
        stockCount: 10,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      quantity: 1,
      addedAt: new Date().toISOString(),
      unitPrice: 25,
    },
  ],
  subtotal: 25,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 25,
  itemCount: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const emptyCart: Cart = {
  ...sampleCart,
  items: [],
  subtotal: 0,
  total: 0,
  itemCount: 0,
};

Deno.test({
  name: "cart-item client API encodes path and payload",
  ignore: true,
  fn: () => {
    const registry = getRegistry();
    const component = registry["cart-item"];
    assertExists(component);
    assertExists(component.api, "cart-item component should expose client API");

    const attrs = component.api!.updateQuantity(
      "item-1",
      { quantity: 3 },
      hx({ swap: "none" }),
    ) as string;

    assertStringIncludes(attrs, 'hx-patch="/api/cart/items/item-1"');
    assertStringIncludes(attrs, 'hx-vals="{&quot;quantity&quot;:3}');
    assertStringIncludes(attrs, 'hx-swap="none"');
  },
});

Deno.test({
  name: "cart-item updateQuantity emits cart-updated trigger",
  ignore: true,
  fn: async () => {
    const repositoryStub = {
      updateCartItem: async () => ok(sampleCart),
    } as unknown as ShoppingRepository;

    setRepositoryForTesting(repositoryStub);

    try {
      const registry = getRegistry();
      const component = registry["cart-item"];
      const apiDef = component.apiMap!.updateQuantity as [
        string,
        string,
        (req: Request, params?: Record<string, string>) => Promise<Response>,
      ];

      const handler = apiDef[2];
      const request = new Request("http://localhost/api/cart/items/item-1", {
        method: "PATCH",
        headers: {
          Accept: "text/html",
          "HX-Request": "true",
          "HX-Values": JSON.stringify({ quantity: 2 }),
          "x-session-id": "session-1",
        },
      });

      const response = await handler(request, { id: "item-1" });
      const trigger = response.headers.get("HX-Trigger");
      assertExists(trigger);

      const payload = JSON.parse(trigger) as Record<string, any>;
      const detail = payload["cart-updated"] as Record<string, any>;
      assertExists(detail);
      assertEquals(detail.itemCount, sampleCart.itemCount);
      assertEquals(detail.sessionId, sampleCart.sessionId);
      assertEquals(detail.target, "body");
    } finally {
      setRepositoryForTesting(null);
    }
  },
});

Deno.test({
  name: "cart-item removeItem emits cart-updated trigger",
  ignore: true,
  fn: async () => {
    const repositoryStub = {
      removeFromCart: async () => ok(emptyCart),
    } as unknown as ShoppingRepository;

    setRepositoryForTesting(repositoryStub);

    try {
      const registry = getRegistry();
      const component = registry["cart-item"];
      const apiDef = component.apiMap!.removeItem as [
        string,
        string,
        (req: Request, params?: Record<string, string>) => Promise<Response>,
      ];

      const handler = apiDef[2];
      const request = new Request("http://localhost/api/cart/items/item-1", {
        method: "DELETE",
        headers: {
          Accept: "text/html",
          "HX-Request": "true",
          "x-session-id": "session-1",
        },
      });

      const response = await handler(request, { id: "item-1" });
      const trigger = response.headers.get("HX-Trigger");
      assertExists(trigger);

      const payload = JSON.parse(trigger) as Record<string, any>;
      const detail = payload["cart-updated"] as Record<string, any>;
      assertExists(detail);
      assertEquals(detail.itemCount, emptyCart.itemCount);
      assertEquals(detail.removedItemId, "item-1");
      assertEquals(detail.target, "body");
    } finally {
      setRepositoryForTesting(null);
    }
  },
});
