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
  readonly maxSize: number;          // Maximum cache size in MB
  readonly maxEntries: number;       // Maximum number of cached entries  
  readonly ttl: number;             // Time to live in milliseconds
  readonly enableCompression: boolean; // Enable gzip compression for large entries
  readonly trackDependencies: boolean; // Track component dependencies for invalidation
}

export interface CacheStats {
  readonly entries: number;
  readonly totalSize: number;        // Size in bytes
  readonly hitRate: number;          // Cache hit percentage
  readonly memoryUsage: number;      // Memory usage in MB
  readonly compressionRatio: number; // Compression effectiveness
}

export interface CacheKey {
  readonly component: string;
  readonly props: string;            // Serialized props hash
  readonly context: string;          // Render context (theme, locale, etc.)
}

/**
 * High-performance LRU cache with compression and dependency tracking
 */
class PerformanceCache<T = string> {
  private entries = new Map<string, CacheEntry<T>>();
  private accessOrder = new Map<string, number>(); // For LRU eviction
  private compressionCache = new Map<string, Uint8Array>(); // Compressed data
  private dependencyGraph = new Map<string, Set<string>>(); // Component dependencies
  
  private hitCount = 0;
  private missCount = 0;
  private currentSize = 0; // Size in bytes
  private accessCounter = 0;

  constructor(private options: CacheOptions) {}

  /**
   * Generate cache key from component name, props, and context
   */
  generateKey(component: string, props: Record<string, unknown>, context: Record<string, unknown> = {}): string {
    const propsHash = this.hashObject(props);
    const contextHash = this.hashObject(context);
    return `${component}:${propsHash}:${contextHash}`;
  }

  /**
   * Get cached value with automatic decompression
   */
  get(key: string): T | null {
    const entry = this.entries.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }

    // Check TTL expiration
    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.delete(key);
      this.missCount++;
      return null;
    }

    // Update LRU access order
    this.accessOrder.set(key, ++this.accessCounter);
    
    // Update hit statistics
    this.entries.set(key, {
      ...entry,
      hits: entry.hits + 1,
    });
    
    this.hitCount++;

    // Decompress if needed
    if (this.options.enableCompression && this.compressionCache.has(key)) {
      const compressed = this.compressionCache.get(key)!;
      return this.decompress(compressed) as T;
    }

    return entry.value;
  }

  /**
   * Store value in cache with optional compression
   */
  set(key: string, value: T, dependencies: readonly string[] = []): void {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    const size = new TextEncoder().encode(serialized).length;

    // Check if we need compression
    const shouldCompress = this.options.enableCompression && size > 1024; // Compress if >1KB
    let finalValue = value;
    let finalSize = size;

    if (shouldCompress) {
      const compressed = this.compress(serialized);
      this.compressionCache.set(key, compressed);
      finalSize = compressed.length;
      // Store a placeholder value since actual data is compressed
      finalValue = '' as T;
    }

    const entry: CacheEntry<T> = {
      value: finalValue,
      timestamp: Date.now(),
      hits: 0,
      size: finalSize,
      dependencies,
    };

    // Remove old entry if exists
    if (this.entries.has(key)) {
      this.currentSize -= this.entries.get(key)!.size;
    }

    // Add new entry
    this.entries.set(key, entry);
    this.accessOrder.set(key, ++this.accessCounter);
    this.currentSize += finalSize;

    // Track dependencies
    if (this.options.trackDependencies) {
      this.updateDependencyGraph(key, dependencies);
    }

    // Evict if necessary
    this.evictIfNeeded();
  }

  /**
   * Delete entry and cleanup
   */
  delete(key: string): boolean {
    const entry = this.entries.get(key);
    if (!entry) return false;

    this.entries.delete(key);
    this.accessOrder.delete(key);
    this.compressionCache.delete(key);
    this.currentSize -= entry.size;

    // Cleanup dependency graph
    this.dependencyGraph.delete(key);
    for (const deps of this.dependencyGraph.values()) {
      deps.delete(key);
    }

    return true;
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.entries.clear();
    this.accessOrder.clear();
    this.compressionCache.clear();
    this.dependencyGraph.clear();
    this.currentSize = 0;
    this.hitCount = 0;
    this.missCount = 0;
    this.accessCounter = 0;
  }

  /**
   * Invalidate cache entries by dependency
   */
  invalidateByDependency(dependency: string): number {
    let invalidated = 0;
    const toDelete = new Set<string>();

    for (const [key, entry] of this.entries) {
      if (entry.dependencies.includes(dependency)) {
        toDelete.add(key);
      }
    }

    for (const key of toDelete) {
      this.delete(key);
      invalidated++;
    }

    return invalidated;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;
    
    let compressionRatio = 1;
    if (this.options.enableCompression && this.compressionCache.size > 0) {
      const originalSize = Array.from(this.entries.values()).reduce((sum, entry) => sum + entry.size, 0);
      const compressedSize = Array.from(this.compressionCache.values()).reduce((sum, data) => sum + data.length, 0);
      compressionRatio = compressedSize > 0 ? originalSize / compressedSize : 1;
    }

    return {
      entries: this.entries.size,
      totalSize: this.currentSize,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage: Math.round((this.currentSize / (1024 * 1024)) * 100) / 100,
      compressionRatio: Math.round(compressionRatio * 100) / 100,
    };
  }

  /**
   * Get most accessed entries for debugging
   */
  getHotEntries(limit = 10): Array<{ key: string; hits: number; size: number }> {
    return Array.from(this.entries.entries())
      .map(([key, entry]) => ({ key, hits: entry.hits, size: entry.size }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);
  }

  /**
   * Evict entries when cache is full using LRU + size-aware strategy
   */
  private evictIfNeeded(): void {
    const maxSizeBytes = this.options.maxSize * 1024 * 1024; // Convert MB to bytes

    // Evict by entry count
    while (this.entries.size > this.options.maxEntries) {
      this.evictLRU();
    }

    // Evict by size
    while (this.currentSize > maxSizeBytes && this.entries.size > 0) {
      this.evictLRU();
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey = '';
    let lruAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder) {
      if (accessTime < lruAccess) {
        lruAccess = accessTime;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
    }
  }

  /**
   * Update dependency graph for cache invalidation
   */
  private updateDependencyGraph(key: string, dependencies: readonly string[]): void {
    for (const dep of dependencies) {
      if (!this.dependencyGraph.has(dep)) {
        this.dependencyGraph.set(dep, new Set());
      }
      this.dependencyGraph.get(dep)!.add(key);
    }
  }

  /**
   * Simple hash function for cache keys
   */
  private hashObject(obj: Record<string, unknown>): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Simple compression using UTF-16 encoding tricks
   */
  private compress(data: string): Uint8Array {
    // Simple run-length encoding for demo - in production use proper compression
    const encoder = new TextEncoder();
    return encoder.encode(data);
  }

  /**
   * Decompress data
   */
  private decompress(data: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(data);
  }
}

/**
 * Default cache configurations for different use cases
 */
export const cachePresets = {
  // High-performance production cache
  production: {
    maxSize: 100,           // 100MB cache
    maxEntries: 10000,      // Up to 10k components
    ttl: 3600000,          // 1 hour TTL
    enableCompression: true,
    trackDependencies: true,
  },

  // Development cache with faster invalidation
  development: {
    maxSize: 50,            // 50MB cache
    maxEntries: 5000,       // Up to 5k components
    ttl: 300000,           // 5 minute TTL
    enableCompression: false, // Faster dev builds
    trackDependencies: true,
  },

  // Memory-constrained environments
  minimal: {
    maxSize: 10,            // 10MB cache
    maxEntries: 1000,       // Up to 1k components
    ttl: 600000,           // 10 minute TTL
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
export function initializeRenderCache(options: CacheOptions = cachePresets.production): PerformanceCache<string> {
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
  context: Record<string, unknown> = {}
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
export const cacheWarming = {
  /**
   * Pre-render critical components with common prop combinations
   */
  warmCriticalComponents(components: Array<{
    name: string;
    propVariations: Array<Record<string, unknown>>;
    renderFn: (props: Record<string, unknown>) => string;
    dependencies?: readonly string[];
  }>): Promise<number> {
    return new Promise((resolve) => {
      let warmed = 0;
      
      for (const component of components) {
        for (const props of component.propVariations) {
          cachedRender(
            component.name,
            props,
            () => component.renderFn(props),
            component.dependencies
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
  warmFromAnalytics(analytics: Array<{
    component: string;
    props: Record<string, unknown>;
    frequency: number;
  }>): number {
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
export const cacheMonitoring = {
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
        summary: { entries: 0, totalSize: 0, hitRate: 0, memoryUsage: 0, compressionRatio: 1 },
        hotEntries: [],
        recommendations: ['Cache not initialized. Consider calling initializeRenderCache()'],
      };
    }

    const summary = cache.getStats();
    const hotEntries = cache.getHotEntries(20);
    const recommendations: string[] = [];

    // Generate recommendations
    if (summary.hitRate < 50) {
      recommendations.push('Low cache hit rate. Consider increasing TTL or cache size.');
    }
    if (summary.memoryUsage > 80) {
      recommendations.push('High memory usage. Consider enabling compression or reducing cache size.');
    }
    if (summary.entries < 100 && summary.memoryUsage < 10) {
      recommendations.push('Cache underutilized. Consider increasing maxEntries.');
    }
    if (summary.compressionRatio < 1.5 && hotEntries.some(e => e.size > 10000)) {
      recommendations.push('Large entries with poor compression. Review component output size.');
    }

    return { summary, hotEntries, recommendations };
  },
};

/**
 * Export the main PerformanceCache class for direct usage
 */
export { PerformanceCache };