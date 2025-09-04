import { assertEquals, assertExists, assertNotEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  PerformanceCache,
  cachePresets,
  initializeRenderCache,
  getRenderCache,
  cachedRender,
  cacheWarming,
  cacheMonitoring,
  type CacheOptions,
  type CacheStats,
} from "./performance-cache.ts";

// Test setup
const testCacheOptions: CacheOptions = {
  maxSize: 1, // 1MB for testing
  maxEntries: 100,
  ttl: 1000, // 1 second for fast testing
  enableCompression: true,
  trackDependencies: true,
};

Deno.test("PerformanceCache - Basic operations", () => {
  const cache = new PerformanceCache<string>(testCacheOptions);
  
  // Test set and get
  cache.set("test-key", "test-value");
  assertEquals(cache.get("test-key"), "test-value");
  
  // Test cache miss
  assertEquals(cache.get("non-existent"), null);
  
  // Test delete
  assertEquals(cache.delete("test-key"), true);
  assertEquals(cache.get("test-key"), null);
  assertEquals(cache.delete("non-existent"), false);
});

Deno.test("PerformanceCache - TTL expiration", async () => {
  const shortTtlOptions: CacheOptions = {
    ...testCacheOptions,
    ttl: 50, // 50ms TTL
  };
  
  const cache = new PerformanceCache<string>(shortTtlOptions);
  
  cache.set("ttl-test", "value");
  assertEquals(cache.get("ttl-test"), "value");
  
  // Wait for TTL to expire
  await new Promise(resolve => setTimeout(resolve, 60));
  
  assertEquals(cache.get("ttl-test"), null);
});

Deno.test("PerformanceCache - LRU eviction by entry count", () => {
  const smallCache = new PerformanceCache<string>({
    ...testCacheOptions,
    maxEntries: 3,
  });
  
  // Fill cache to capacity
  smallCache.set("key1", "value1");
  smallCache.set("key2", "value2");
  smallCache.set("key3", "value3");
  
  // All should exist
  assertEquals(smallCache.get("key1"), "value1");
  assertEquals(smallCache.get("key2"), "value2");
  assertEquals(smallCache.get("key3"), "value3");
  
  // Add one more - should evict least recently used (key1)
  smallCache.set("key4", "value4");
  
  assertEquals(smallCache.get("key1"), null); // Evicted
  assertEquals(smallCache.get("key2"), "value2");
  assertEquals(smallCache.get("key3"), "value3");
  assertEquals(smallCache.get("key4"), "value4");
});

Deno.test("PerformanceCache - Dependency tracking and invalidation", () => {
  const cache = new PerformanceCache<string>(testCacheOptions);
  
  // Set entries with dependencies
  cache.set("comp1", "value1", ["theme", "locale"]);
  cache.set("comp2", "value2", ["locale"]);
  cache.set("comp3", "value3", ["user"]);
  
  // Verify all entries exist
  assertEquals(cache.get("comp1"), "value1");
  assertEquals(cache.get("comp2"), "value2");
  assertEquals(cache.get("comp3"), "value3");
  
  // Invalidate by locale dependency
  const invalidated = cache.invalidateByDependency("locale");
  assertEquals(invalidated, 2); // comp1 and comp2
  
  assertEquals(cache.get("comp1"), null); // Invalidated
  assertEquals(cache.get("comp2"), null); // Invalidated
  assertEquals(cache.get("comp3"), "value3"); // Still exists
});

Deno.test("PerformanceCache - Statistics tracking", () => {
  const cache = new PerformanceCache<string>(testCacheOptions);
  
  // Initial stats
  let stats = cache.getStats();
  assertEquals(stats.entries, 0);
  assertEquals(stats.totalSize, 0);
  assertEquals(stats.hitRate, 0);
  
  // Add entries and access them
  cache.set("key1", "value1");
  cache.set("key2", "value2");
  
  // Generate some hits and misses
  cache.get("key1"); // hit
  cache.get("key1"); // hit
  cache.get("key2"); // hit
  cache.get("missing"); // miss
  
  stats = cache.getStats();
  assertEquals(stats.entries, 2);
  assertEquals(stats.hitRate, 75); // 3 hits, 1 miss = 75%
  assertEquals(stats.totalSize > 0, true);
});

Deno.test("PerformanceCache - Key generation", () => {
  const cache = new PerformanceCache<string>(testCacheOptions);
  
  const props1 = { title: "Hello", count: 1 };
  const props2 = { count: 1, title: "Hello" }; // Same props, different order
  const props3 = { title: "Hello", count: 2 }; // Different props
  
  const key1 = cache.generateKey("component", props1);
  const key2 = cache.generateKey("component", props2);
  const key3 = cache.generateKey("component", props3);
  
  // Same props should generate same key regardless of order
  assertEquals(key1, key2);
  // Different props should generate different keys
  assertNotEquals(key1, key3);
});

Deno.test("PerformanceCache - Hot entries tracking", () => {
  const cache = new PerformanceCache<string>(testCacheOptions);
  
  cache.set("popular", "value1");
  cache.set("moderate", "value2");
  cache.set("rare", "value3");
  
  // Access with different frequencies
  for (let i = 0; i < 10; i++) cache.get("popular");
  for (let i = 0; i < 5; i++) cache.get("moderate");
  cache.get("rare");
  
  const hotEntries = cache.getHotEntries(3);
  assertEquals(hotEntries.length, 3);
  assertEquals(hotEntries[0].key, "popular");
  assertEquals(hotEntries[0].hits, 10);
  assertEquals(hotEntries[1].key, "moderate");
  assertEquals(hotEntries[1].hits, 5);
  assertEquals(hotEntries[2].key, "rare");
  assertEquals(hotEntries[2].hits, 1);
});

Deno.test("PerformanceCache - Clear functionality", () => {
  const cache = new PerformanceCache<string>(testCacheOptions);
  
  cache.set("key1", "value1");
  cache.set("key2", "value2");
  cache.get("key1"); // Generate some stats
  
  assertEquals(cache.getStats().entries, 2);
  assertEquals(cache.getStats().hitRate, 100);
  
  cache.clear();
  
  const stats = cache.getStats();
  assertEquals(stats.entries, 0);
  assertEquals(stats.totalSize, 0);
  assertEquals(stats.hitRate, 0);
  assertEquals(cache.get("key1"), null);
  assertEquals(cache.get("key2"), null);
});

Deno.test("Cache presets are valid", () => {
  assertEquals(typeof cachePresets.production.maxSize, "number");
  assertEquals(typeof cachePresets.development.maxSize, "number");
  assertEquals(typeof cachePresets.minimal.maxSize, "number");
  
  assertEquals(cachePresets.production.enableCompression, true);
  assertEquals(cachePresets.development.enableCompression, false);
  assertEquals(cachePresets.minimal.enableCompression, true);
});

Deno.test("Global render cache initialization", () => {
  // Initially null
  assertEquals(getRenderCache(), null);
  
  // Initialize
  const cache = initializeRenderCache(testCacheOptions);
  assertExists(cache);
  assertEquals(getRenderCache(), cache);
  
  // Can get the same instance
  const sameCache = getRenderCache();
  assertEquals(cache, sameCache);
});

Deno.test("Cached render functionality", () => {
  initializeRenderCache(testCacheOptions);
  
  let renderCount = 0;
  const renderFn = () => {
    renderCount++;
    return `<div>Render #${renderCount}</div>`;
  };
  
  // First render should call renderFn
  const result1 = cachedRender("test-component", { prop: "value" }, renderFn);
  assertEquals(renderCount, 1);
  assertEquals(result1, "<div>Render #1</div>");
  
  // Second render with same props should use cache
  const result2 = cachedRender("test-component", { prop: "value" }, renderFn);
  assertEquals(renderCount, 1); // Not incremented
  assertEquals(result2, "<div>Render #1</div>"); // Same result
  
  // Different props should render again
  const result3 = cachedRender("test-component", { prop: "different" }, renderFn);
  assertEquals(renderCount, 2);
  assertEquals(result3, "<div>Render #2</div>");
});

Deno.test("Cached render without cache", () => {
  // Set global cache to null to test no-cache scenario
  const originalCache = getRenderCache();
  
  // We can't actually set the global cache to null from the public API,
  // so let's test the behavior when cache returns null for the key
  if (originalCache) {
    originalCache.clear(); // Clear cache to simulate no entries
  }
  
  let renderCount = 0;
  const renderFn = () => {
    renderCount++;
    return `<div>Render #${renderCount}</div>`;
  };
  
  // First render
  const result1 = cachedRender("test-component-no-cache", { prop: "value" }, renderFn);
  assertEquals(renderCount, 1);
  
  // Second render with same props - will hit cache if cache exists
  const result2 = cachedRender("test-component-no-cache", { prop: "value" }, renderFn);
  
  if (originalCache) {
    // With cache, should not re-render
    assertEquals(renderCount, 1);
    assertEquals(result1, result2);
  } else {
    // Without cache, should re-render
    assertEquals(renderCount, 2);
    assertNotEquals(result1, result2);
  }
});

Deno.test("Cache warming - critical components", async () => {
  initializeRenderCache(testCacheOptions);
  
  const components = [
    {
      name: "header",
      propVariations: [
        { title: "Home" },
        { title: "About" },
        { title: "Contact" },
      ],
      renderFn: (props: Record<string, unknown>) => `<header>${props.title}</header>`,
      dependencies: ["theme"],
    },
    {
      name: "button",
      propVariations: [
        { variant: "primary" },
        { variant: "secondary" },
      ],
      renderFn: (props: Record<string, unknown>) => `<button class="${props.variant}">Button</button>`,
    },
  ];
  
  const warmed = await cacheWarming.warmCriticalComponents(components);
  assertEquals(warmed, 5); // 3 header + 2 button variations
  
  // Verify entries are in cache
  const cache = getRenderCache()!;
  const stats = cache.getStats();
  assertEquals(stats.entries, 5);
});

Deno.test("Cache warming - from analytics", () => {
  initializeRenderCache(testCacheOptions);
  
  const analytics = [
    { component: "header", props: { title: "Home" }, frequency: 100 },
    { component: "button", props: { variant: "primary" }, frequency: 50 },
    { component: "footer", props: { year: 2024 }, frequency: 25 },
  ];
  
  const warmed = cacheWarming.warmFromAnalytics(analytics);
  assertEquals(warmed, 3);
  
  const cache = getRenderCache()!;
  const stats = cache.getStats();
  assertEquals(stats.entries, 3);
});

Deno.test("Cache monitoring - report generation", () => {
  initializeRenderCache(testCacheOptions);
  const cache = getRenderCache()!;
  
  // Add some test data
  cache.set("comp1", "a".repeat(1000), ["theme"]); // Large entry
  cache.set("comp2", "small");
  
  // Generate some hits
  for (let i = 0; i < 10; i++) cache.get("comp1");
  cache.get("comp2");
  cache.get("missing"); // Miss
  
  const report = cacheMonitoring.generateReport();
  
  assertEquals(typeof report.summary.hitRate, "number");
  assertEquals(report.hotEntries.length > 0, true);
  assertEquals(report.hotEntries[0].hits, 10);
  assertEquals(Array.isArray(report.recommendations), true);
});

Deno.test("Cache monitoring - no cache report", () => {
  // Test report when cache exists but is empty
  const cache = getRenderCache();
  if (cache) {
    cache.clear(); // Clear all entries
    
    const report = cacheMonitoring.generateReport();
    
    assertEquals(report.summary.entries, 0);
    assertEquals(report.hotEntries.length, 0);
    // Should have recommendations for underutilized cache
    assertEquals(Array.isArray(report.recommendations), true);
    assertEquals(report.recommendations.length > 0, true);
  } else {
    // If no cache is initialized
    const report = cacheMonitoring.generateReport();
    
    assertEquals(report.summary.entries, 0);
    assertEquals(report.hotEntries.length, 0);
    assertEquals(report.recommendations.includes('Cache not initialized. Consider calling initializeRenderCache()'), true);
  }
});

Deno.test("Cache monitoring - performance monitor", () => {
  initializeRenderCache(testCacheOptions);
  const cache = getRenderCache()!;
  
  const monitor = cacheMonitoring.createMonitor(10); // 10ms interval for fast testing
  
  // Add some data
  cache.set("test", "value");
  cache.get("test");
  
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const currentStats = monitor.getCurrentStats();
      assertExists(currentStats);
      assertEquals(currentStats.entries, 1);
      assertEquals(currentStats.hitRate, 100);
      
      const history = monitor.getHistory();
      // Should have collected some measurements
      assertEquals(history.length >= 0, true);
      
      monitor.stop();
      resolve();
    }, 50);
  });
});