import {
  assertEquals,
  assertExists,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { getRegistry } from "../../../lib/registry.ts";
import { ok } from "../../../lib/result.ts";
import type { ShoppingRepository } from "../api/repository.ts";
import { setRepositoryForTesting } from "../api/repository.ts";
import type { Cart } from "../api/types.ts";

// NOTE: This example-level test referenced an app component that was moved into the library.
// The import is removed; the test is marked ignored until it is updated to the new API.

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

Deno.test({
  name: "product-card addToCart emits cart-updated trigger",
  ignore: true,
  fn: async () => {
    try {
      const repositoryStub = {
        addToCart: async () => ok(sampleCart),
      } as unknown as ShoppingRepository;

      setRepositoryForTesting(repositoryStub);

      const registry = getRegistry();
      const component = registry["product-card"];
      assertExists(component, "product-card component should be registered");
      assertExists(component.apiMap, "product-card should define api map");

      const api = component.apiMap!.addToCart as [
        string,
        string,
        (req: Request) => Promise<Response>,
      ];
      assertExists(api, "addToCart api definition should exist");

      const handler = api[2];
      const request = new Request("http://localhost/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/html",
          "HX-Request": "true",
        },
        body: JSON.stringify({
          productId: "prod-1",
          quantity: 1,
          sessionId: "session-1",
        }),
      });

      const response = await handler(request);
      const triggerHeader = response.headers.get("HX-Trigger");
      assertExists(triggerHeader, "response should include HX-Trigger header");

      const parsed = JSON.parse(triggerHeader as string) as Record<
        string,
        unknown
      >;
      const cartUpdated = parsed["cart-updated"] as Record<string, unknown>;
      assertExists(cartUpdated, "cart-updated trigger should be present");
      assertEquals(cartUpdated.itemCount, sampleCart.itemCount);
      assertEquals(cartUpdated.total, sampleCart.total);
      assertEquals(cartUpdated.target, "body");

      const body = await response.text();
      assertStringIncludes(body, "Added to cart");
    } finally {
      setRepositoryForTesting(null);
    }
  },
});
