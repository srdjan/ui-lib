// High-performance SSR caching system for ui-lib
// Provides intelligent component render caching with invalidation strategies

export interface CacheEntry<T = string> {
  readonly value: T;
  readonly timestamp: number;
  readonly hits: number;
  readonly size: number;
  readonly dependencies: readonly string[];
}

export interface CacheOptions {
  readonly maxSize: number; // Maximum cache size in MB
  readonly maxEntries: number; // Maximum number of cached entries
  readonly ttl: number; // Time to live in milliseconds
  readonly enableCompression: boolean; // Enable gzip compression for large entries
  readonly trackDependencies: boolean; // Track component dependencies for invalidation
}

export interface CacheStats {
  readonly entries: number;
  readonly totalSize: number; // Size in bytes
  readonly hitRate: number; // Cache hit percentage
  readonly memoryUsage: number; // Memory usage in MB
  readonly compressionRatio: number; // Compression effectiveness
}

export interface CacheKey {
  readonly component: string;
  readonly props: string; // Serialized props hash
  readonly context: string; // Render context (theme, locale, etc.)
}

/**
 * Performance cache state type
 */
type PerformanceCacheState<T = string> = {
  readonly entries: ReadonlyMap<string, CacheEntry<T>>;
  readonly accessOrder: ReadonlyMap<string, number>; // For LRU eviction
  readonly compressionCache: ReadonlyMap<string, Uint8Array>; // Compressed data
  readonly dependencyGraph: ReadonlyMap<string, ReadonlySet<string>>; // Component dependencies
  readonly hitCount: number;
  readonly missCount: number;
  readonly currentSize: number; // Size in bytes
  readonly accessCounter: number;
  readonly options: CacheOptions;
};

/**
 * Create default cache state
 */
const createDefaultCacheState = <T = string>(
  options: CacheOptions,
): PerformanceCacheState<T> => ({
  entries: new Map(),
  accessOrder: new Map(),
  compressionCache: new Map(),
  dependencyGraph: new Map(),
  hitCount: 0,
  missCount: 0,
  currentSize: 0,
  accessCounter: 0,
  options,
});

/**
 * Pure helper functions
 */
const hashObject = (obj: Record<string, unknown>): string => {
  // Simple hash function for objects
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

const generateKey = (
  component: string,
  props: Record<string, unknown>,
  context: Record<string, unknown> = {},
): string => {
  const propsHash = hashObject(props);
  const contextHash = hashObject(context);
  return `${component}:${propsHash}:${contextHash}`;
};

const compress = (data: string): Uint8Array => {
  // Simple compression using TextEncoder (in real implementation, use gzip)
  return new TextEncoder().encode(data);
};

const decompress = (data: Uint8Array): string => {
  // Simple decompression using TextDecoder (in real implementation, use gzip)
  return new TextDecoder().decode(data);
};

const getCachedValue = <T>(
  state: PerformanceCacheState<T>,
  key: string,
): { value: T | null; newState: PerformanceCacheState<T> } => {
  const entry = state.entries.get(key);

  if (!entry) {
    return {
      value: null,
      newState: {
        ...state,
        missCount: state.missCount + 1,
      },
    };
  }

  // Check TTL expiration
  if (Date.now() - entry.timestamp > state.options.ttl) {
    const { newState: deletedState } = deleteCacheEntry(state, key);
    return {
      value: null,
      newState: {
        ...deletedState,
        missCount: deletedState.missCount + 1,
      },
    };
  }

  // Update LRU access order
  const newAccessOrder = new Map(state.accessOrder);
  newAccessOrder.set(key, state.accessCounter + 1);

  // Update hit statistics
  const newEntries = new Map(state.entries);
  newEntries.set(key, {
    ...entry,
    hits: entry.hits + 1,
  });

  const newState: PerformanceCacheState<T> = {
    ...state,
    entries: newEntries,
    accessOrder: newAccessOrder,
    accessCounter: state.accessCounter + 1,
    hitCount: state.hitCount + 1,
  };

  // Decompress if needed
  if (state.options.enableCompression && state.compressionCache.has(key)) {
    const compressed = state.compressionCache.get(key)!;
    return {
      value: decompress(compressed) as T,
      newState,
    };
  }

  return {
    value: entry.value,
    newState,
  };
};

const deleteCacheEntry = <T>(
  state: PerformanceCacheState<T>,
  key: string,
): { success: boolean; newState: PerformanceCacheState<T> } => {
  const entry = state.entries.get(key);
  if (!entry) {
    return { success: false, newState: state };
  }

  const newEntries = new Map(state.entries);
  const newAccessOrder = new Map(state.accessOrder);
  const newCompressionCache = new Map(state.compressionCache);
  const newDependencyGraph = new Map(state.dependencyGraph);

  newEntries.delete(key);
  newAccessOrder.delete(key);
  newCompressionCache.delete(key);
  newDependencyGraph.delete(key);

  return {
    success: true,
    newState: {
      ...state,
      entries: newEntries,
      accessOrder: newAccessOrder,
      compressionCache: newCompressionCache,
      dependencyGraph: newDependencyGraph,
      currentSize: state.currentSize - entry.size,
    },
  };
};

const evictLRUEntries = <T>(
  state: PerformanceCacheState<T>,
  targetSize: number,
): PerformanceCacheState<T> => {
  if (state.currentSize + targetSize <= state.options.maxSize * 1024 * 1024) {
    return state;
  }

  // Sort by access order (oldest first)
  const sortedEntries = Array.from(state.accessOrder.entries())
    .sort(([, a], [, b]) => a - b);

  let currentState = state;

  for (const [key] of sortedEntries) {
    const entry = currentState.entries.get(key);
    if (!entry) continue;

    const { newState } = deleteCacheEntry(currentState, key);
    currentState = newState;

    // Stop if we've freed enough space
    if (
      currentState.currentSize + targetSize <=
        state.options.maxSize * 1024 * 1024
    ) {
      break;
    }
  }

  return currentState;
};

const setCacheValue = <T>(
  state: PerformanceCacheState<T>,
  key: string,
  value: T,
  dependencies: readonly string[] = [],
): PerformanceCacheState<T> => {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  const size = new TextEncoder().encode(serialized).length;

  // Check if we need compression
  const shouldCompress = state.options.enableCompression && size > 1024; // Compress if >1KB
  let finalValue = value;
  let finalSize = size;
  let newCompressionCache = new Map(state.compressionCache);

  if (shouldCompress) {
    const compressed = compress(serialized);
    newCompressionCache.set(key, compressed);
    finalSize = compressed.length;
    // Store a placeholder value since actual data is compressed
    finalValue = "" as T;
  }

  // Create cache entry
  const entry: CacheEntry<T> = {
    value: finalValue,
    timestamp: Date.now(),
    hits: 0,
    size: finalSize,
    dependencies,
  };

  // Remove old entry if exists and calculate size adjustment
  let currentState = state;
  if (state.entries.has(key)) {
    const { newState } = deleteCacheEntry(state, key);
    currentState = newState;
  }

  // Evict entries if needed (by size)
  let evictedState = evictLRUEntries(currentState, finalSize);

  // Evict by entry count if necessary (LRU)
  if (evictedState.entries.size >= evictedState.options.maxEntries) {
    // Sort oldest first
    const sorted = Array.from(evictedState.accessOrder.entries()).sort((a, b) =>
      a[1] - b[1]
    );
    let tmpState = evictedState;
    while (tmpState.entries.size >= tmpState.options.maxEntries) {
      const oldest = sorted.shift();
      if (!oldest) break;
      const { newState } = deleteCacheEntry(tmpState, oldest[0]);
      tmpState = newState;
    }
    evictedState = tmpState;
  }

  // Store entry
  const newEntries = new Map(evictedState.entries);
  const newAccessOrder = new Map(evictedState.accessOrder);
  const newDependencyGraph = new Map(evictedState.dependencyGraph);

  newEntries.set(key, entry);
  newAccessOrder.set(key, evictedState.accessCounter + 1);

  // Update dependency graph
  if (state.options.trackDependencies && dependencies.length > 0) {
    newDependencyGraph.set(key, new Set(dependencies));
  }

  return {
    ...evictedState,
    entries: newEntries,
    accessOrder: newAccessOrder,
    compressionCache: newCompressionCache,
    dependencyGraph: newDependencyGraph,
    accessCounter: evictedState.accessCounter + 1,
    currentSize: evictedState.currentSize + finalSize,
  };
};

// Functional PerformanceCache interface
export interface IPerformanceCache<T = string> {
  generateKey(
    component: string,
    props: Record<string, unknown>,
    context?: Record<string, unknown>,
  ): string;
  get(key: string): T | null;
  set(key: string, value: T, dependencies?: readonly string[]): void;
  delete(key: string): boolean;
  clear(): void;
  has(key: string): boolean;
  invalidate(dependency: string): number;
  getStats(): CacheStats;
  cleanup(): void;
}

// Functional PerformanceCache implementation
export const createPerformanceCache = <T = string>(
  options: CacheOptions,
): IPerformanceCache<T> => {
  let state = createDefaultCacheState<T>(options);

  return {
    generateKey(
      component: string,
      props: Record<string, unknown>,
      context: Record<string, unknown> = {},
    ): string {
      return generateKey(component, props, context);
    },

    get(key: string): T | null {
      const { value, newState } = getCachedValue(state, key);
      state = newState;
      return value;
    },

    set(key: string, value: T, dependencies: readonly string[] = []): void {
      state = setCacheValue(state, key, value, dependencies);
    },

    delete(key: string): boolean {
      const { success, newState } = deleteCacheEntry(state, key);
      state = newState;
      return success;
    },

    clear(): void {
      state = createDefaultCacheState<T>(options);
    },

    has(key: string): boolean {
      const entry = state.entries.get(key);
      if (!entry) return false;

      // Check TTL expiration
      if (Date.now() - entry.timestamp > state.options.ttl) {
        const { newState } = deleteCacheEntry(state, key);
        state = newState;
        return false;
      }

      return true;
    },

    invalidate(dependency: string): number {
      let invalidatedCount = 0;
      let currentState = state;

      for (const [key, entry] of state.entries.entries()) {
        if (entry.dependencies.includes(dependency)) {
          const { newState } = deleteCacheEntry(currentState, key);
          currentState = newState;
          invalidatedCount++;
        }
      }

      state = currentState;
      return invalidatedCount;
    },

    getStats(): CacheStats {
      const totalRequests = state.hitCount + state.missCount;
      const hitRate = totalRequests > 0
        ? (state.hitCount / totalRequests) * 100
        : 0;

      // Calculate compression ratio
      let totalOriginalSize = 0;
      let totalCompressedSize = 0;

      for (const [key, entry] of state.entries.entries()) {
        if (state.compressionCache.has(key)) {
          totalCompressedSize += entry.size;
          // Estimate original size (this is simplified)
          totalOriginalSize += entry.size * 2; // Assume 2:1 compression ratio
        } else {
          totalOriginalSize += entry.size;
          totalCompressedSize += entry.size;
        }
      }

      const compressionRatio = totalOriginalSize > 0
        ? totalCompressedSize / totalOriginalSize
        : 1;

      return {
        entries: state.entries.size,
        totalSize: state.currentSize,
        hitRate: Math.round(hitRate * 100) / 100,
        memoryUsage: Math.round((state.currentSize / (1024 * 1024)) * 100) /
          100,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
      };
    },

    cleanup(): void {
      const now = Date.now();
      let currentState = state;

      for (const [key, entry] of state.entries.entries()) {
        if (now - entry.timestamp > state.options.ttl) {
          const { newState } = deleteCacheEntry(currentState, key);
          currentState = newState;
        }
      }

      state = currentState;
    },
  };
};

// Backward compatibility - PerformanceCache class that uses functional implementation
export class PerformanceCache<T = string> {
  private cache: IPerformanceCache<T>;
  // Track hot entries locally (key -> { hits, size })
  private readonly hotMap: Map<string, { hits: number; size: number }>;

  constructor(options: CacheOptions) {
    this.cache = createPerformanceCache<T>(options);
    this.hotMap = new Map();
  }

  generateKey(
    component: string,
    props: Record<string, unknown>,
    context: Record<string, unknown> = {},
  ): string {
    return this.cache.generateKey(component, props, context);
  }

  get(key: string): T | null {
    const val = this.cache.get(key);
    if (val !== null) {
      const entry = this.hotMap.get(key) ?? { hits: 0, size: 0 };
      entry.hits += 1;
      // Approximate size if we don't know it yet and value is string-like
      if (entry.size === 0) {
        const strVal = typeof val === "string" ? val : JSON.stringify(val);
        entry.size = new TextEncoder().encode(strVal).length;
      }
      this.hotMap.set(key, entry);
    }
    return val;
  }

  set(key: string, value: T, dependencies: readonly string[] = []): void {
    this.cache.set(key, value, dependencies);
    const strVal = typeof value === "string" ? value : JSON.stringify(value);
    this.hotMap.set(key, {
      hits: 0,
      size: new TextEncoder().encode(strVal).length,
    });
  }

  delete(key: string): boolean {
    const res = this.cache.delete(key);
    this.hotMap.delete(key);
    return res;
  }

  clear(): void {
    this.cache.clear();
    this.hotMap.clear();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  invalidateByDependency(dependency: string): number {
    return this.cache.invalidate(dependency);
  }

  getStats(): CacheStats {
    return this.cache.getStats();
  }

  cleanup(): void {
    this.cache.cleanup();
  }

  // Additional methods for backward compatibility
  getHotEntries(
    limit = 10,
  ): Array<{ key: string; hits: number; size: number }> {
    return Array.from(this.hotMap.entries())
      .map(([key, { hits, size }]) => ({ key, hits, size }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }
}

/**
 * Default cache configurations for different use cases
 */
export const cachePresets = {
  // High-performance production cache
  production: {
    maxSize: 100, // 100MB cache
    maxEntries: 10000, // Up to 10k components
    ttl: 3600000, // 1 hour TTL
    enableCompression: true,
    trackDependencies: true,
  },

  // Development cache with faster invalidation
  development: {
    maxSize: 50, // 50MB cache
    maxEntries: 5000, // Up to 5k components
    ttl: 300000, // 5 minute TTL
    enableCompression: false, // Faster dev builds
    trackDependencies: true,
  },

  // Memory-constrained environments
  minimal: {
    maxSize: 10, // 10MB cache
    maxEntries: 1000, // Up to 1k components
    ttl: 600000, // 10 minute TTL
    enableCompression: true,
    trackDependencies: false, // Less memory overhead
  },
} as const;

/**
 * Global component render cache instance
 */
let globalRenderCache: PerformanceCache<string> | null = null;

/**
 * Initialize render cache with configuration
 */
export function initializeRenderCache(
  options: CacheOptions = cachePresets.production,
): PerformanceCache<string> {
  globalRenderCache = new PerformanceCache<string>(options);
  return globalRenderCache;
}

/**
 * Get the global render cache instance
 */
export function getRenderCache(): PerformanceCache<string> | null {
  return globalRenderCache;
}

/**
 * Cache-aware component rendering wrapper
 */
export function cachedRender<T extends Record<string, unknown>>(
  componentName: string,
  props: T,
  renderFn: () => string,
  dependencies: readonly string[] = [],
  context: Record<string, unknown> = {},
): string {
  const cache = getRenderCache();

  if (!cache) {
    // No cache - render directly
    return renderFn();
  }

  const key = cache.generateKey(componentName, props, context);
  const cached = cache.get(key);

  if (cached !== null) {
    // Cache hit - return cached result
    return cached;
  }

  // Cache miss - render and store
  const rendered = renderFn();
  cache.set(key, rendered, dependencies);

  return rendered;
}

/**
 * Cache warming utilities for critical components
 */
export const cacheWarming: {
  warmCriticalComponents: (
    components: Array<{
      name: string;
      propVariations: Array<Record<string, unknown>>;
      renderFn: (props: Record<string, unknown>) => string;
      dependencies?: readonly string[];
    }>,
  ) => Promise<number>;
  warmFromAnalytics: (
    analytics: Array<{
      component: string;
      props: Record<string, unknown>;
      frequency: number;
    }>,
  ) => number;
} = {
  /**
   * Pre-render critical components with common prop combinations
   */
  warmCriticalComponents(
    components: Array<{
      name: string;
      propVariations: Array<Record<string, unknown>>;
      renderFn: (props: Record<string, unknown>) => string;
      dependencies?: readonly string[];
    }>,
  ): Promise<number> {
    return new Promise((resolve) => {
      let warmed = 0;

      for (const component of components) {
        for (const props of component.propVariations) {
          cachedRender(
            component.name,
            props,
            () => component.renderFn(props),
            component.dependencies,
          );
          warmed++;
        }
      }

      // Simulate async warming
      setTimeout(() => resolve(warmed), 0);
    });
  },

  /**
   * Warm cache based on usage analytics
   */
  warmFromAnalytics(
    analytics: Array<{
      component: string;
      props: Record<string, unknown>;
      frequency: number;
    }>,
  ): number {
    const cache = getRenderCache();
    if (!cache) return 0;

    let warmed = 0;
    // Sort by frequency and warm most used first
    const sorted = analytics.sort((a, b) => b.frequency - a.frequency);

    for (const { component, props } of sorted.slice(0, 100)) { // Top 100
      const key = cache.generateKey(component, props);
      if (!cache.get(key)) {
        // This would need the actual render function - placeholder for demo
        cache.set(key, `<!-- pre-warmed: ${component} -->`, []);
        warmed++;
      }
    }

    return warmed;
  },
};

/**
 * Cache monitoring and debugging utilities
 */
export const cacheMonitoring: {
  createMonitor: (intervalMs?: number) => {
    getHistory: () => CacheStats[];
    stop: () => void;
    getCurrentStats: () => CacheStats | null;
  };
  generateReport: () => {
    summary: CacheStats;
    hotEntries: Array<{ key: string; hits: number; size: number }>;
    recommendations: string[];
  };
} = {
  /**
   * Monitor cache performance over time
   */
  createMonitor(intervalMs = 30000) {
    const stats: CacheStats[] = [];

    const monitor = setInterval(() => {
      const cache = getRenderCache();
      if (cache) {
        stats.push(cache.getStats());

        // Keep only last 100 measurements
        if (stats.length > 100) {
          stats.shift();
        }
      }
    }, intervalMs);

    return {
      getHistory: () => [...stats],
      stop: () => clearInterval(monitor),
      getCurrentStats: () => getRenderCache()?.getStats() || null,
    };
  },

  /**
   * Generate cache performance report
   */
  generateReport(): {
    summary: CacheStats;
    hotEntries: Array<{ key: string; hits: number; size: number }>;
    recommendations: string[];
  } {
    const cache = getRenderCache();
    if (!cache) {
      return {
        summary: {
          entries: 0,
          totalSize: 0,
          hitRate: 0,
          memoryUsage: 0,
          compressionRatio: 1,
        },
        hotEntries: [],
        recommendations: [
          "Cache not initialized. Consider calling initializeRenderCache()",
        ],
      };
    }

    const summary = cache.getStats();
    const hotEntries = cache.getHotEntries(20);
    const recommendations: string[] = [];

    // Generate recommendations
    if (summary.hitRate < 50) {
      recommendations.push(
        "Low cache hit rate. Consider increasing TTL or cache size.",
      );
    }
    if (summary.memoryUsage > 80) {
      recommendations.push(
        "High memory usage. Consider enabling compression or reducing cache size.",
      );
    }
    if (summary.entries < 100 && summary.memoryUsage < 10) {
      recommendations.push(
        "Cache underutilized. Consider increasing maxEntries.",
      );
    }
    if (
      summary.compressionRatio < 1.5 && hotEntries.some((e) => e.size > 10000)
    ) {
      recommendations.push(
        "Large entries with poor compression. Review component output size.",
      );
    }

    return { summary, hotEntries, recommendations };
  },
};
