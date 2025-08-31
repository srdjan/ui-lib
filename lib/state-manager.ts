// funcwc State Manager - Pub/Sub system for complex application state
// This file provides both the TypeScript interface and the JavaScript implementation

/**
 * TypeScript interface for the funcwc State Manager
 * Use this for type checking in TypeScript components
 */
export interface StateManager {
  /**
   * Publish state update to all subscribers of a topic
   * @param topic - Topic name
   * @param data - State data to publish
   */
  publish(topic: string, data: unknown): void;

  /**
   * Subscribe to state updates for a topic
   * @param topic - Topic name to subscribe to
   * @param callback - Function to call when state updates (receives data as parameter)
   * @param element - DOM element that owns this subscription (for automatic cleanup)
   */
  subscribe(
    topic: string,
    callback: (data: unknown) => void,
    element: Element,
  ): void;

  /**
   * Get current state for a topic
   * @param topic - Topic name
   * @returns Current state data or undefined if topic doesn't exist
   */
  getState(topic: string): unknown;

  /**
   * Remove all subscriptions for a topic
   * @param topic - Topic name to clear
   */
  clearTopic(topic: string): void;

  /**
   * Debug method to inspect current state and subscriptions
   */
  debug(): void;

  /**
   * Get all active topics
   */
  getTopics(): string[];

  /**
   * Get subscription count for a topic
   * @param topic - Topic name
   */
  getSubscriberCount(topic: string): number;
}

/**
 * Subscription entry internal interface
 */
interface Subscription {
  callback: (data: unknown) => void;
  element: Element;
  timestamp: number;
}

/**
 * State entry internal interface
 */
interface StateEntry {
  data: unknown;
  timestamp: number;
  updateCount: number;
}

/**
 * JavaScript implementation string for injection into host pages
 * This creates window.funcwcState with the pub/sub functionality
 */
export const createStateManagerScript = (): string => {
  return `
// funcwc State Manager - Client-side pub/sub for component communication
window.funcwcState = {
  // Internal state storage: Map<topic, StateEntry>
  _state: new Map(),
  
  // Internal subscriptions: Map<topic, Subscription[]>
  _subscribers: new Map(),
  
  // Configuration
  _config: {
    maxSubscriptionsPerTopic: 100,
    maxTopics: 50,
    cleanupInterval: 30000, // 30 seconds
    debugMode: false
  },
  
  // Last cleanup timestamp
  _lastCleanup: Date.now(),

  /**
   * Publish state update to all subscribers of a topic
   */
  publish(topic, data) {
    if (typeof topic !== 'string') {
      console.warn('funcwcState.publish: topic must be a string');
      return;
    }
    
    // Store state with metadata
    const stateEntry = this._state.get(topic) || { updateCount: 0 };
    const newState = {
      data: data,
      timestamp: Date.now(),
      updateCount: stateEntry.updateCount + 1
    };
    
    this._state.set(topic, newState);
    
    // Limit total topics
    if (this._state.size > this._config.maxTopics) {
      const oldestTopic = Array.from(this._state.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      this._state.delete(oldestTopic);
      this._subscribers.delete(oldestTopic);
      
      if (this._config.debugMode) {
        console.warn('funcwcState: Removed oldest topic due to limit:', oldestTopic);
      }
    }
    
    // Notify subscribers
    const subs = this._subscribers.get(topic) || [];
    const validSubs = [];
    
    subs.forEach(sub => {
      // Check if element is still in the DOM
      if (document.contains(sub.element)) {
        try {
          sub.callback.call(sub.element, data);
          validSubs.push(sub);
        } catch (error) {
          if (this._config.debugMode) {
            console.error('funcwcState: Subscription callback error:', error);
          }
        }
      }
    });
    
    // Update subscribers list with only valid ones (automatic cleanup)
    if (validSubs.length !== subs.length) {
      if (validSubs.length === 0) {
        this._subscribers.delete(topic);
      } else {
        this._subscribers.set(topic, validSubs);
      }
      
      if (this._config.debugMode) {
        console.log(\`funcwcState: Cleaned up \${subs.length - validSubs.length} dead subscriptions for topic '\${topic}'\`);
      }
    }
    
    // Periodic cleanup
    if (Date.now() - this._lastCleanup > this._config.cleanupInterval) {
      this._performCleanup();
    }
  },

  /**
   * Subscribe to state updates for a topic
   */
  subscribe(topic, callback, element) {
    if (typeof topic !== 'string') {
      console.warn('funcwcState.subscribe: topic must be a string');
      return;
    }
    
    if (typeof callback !== 'function') {
      console.warn('funcwcState.subscribe: callback must be a function');
      return;
    }
    
    if (!(element instanceof Element)) {
      console.warn('funcwcState.subscribe: element must be a DOM element');
      return;
    }
    
    // Initialize subscribers array if needed
    if (!this._subscribers.has(topic)) {
      this._subscribers.set(topic, []);
    }
    
    const subs = this._subscribers.get(topic);
    
    // Check subscription limits
    if (subs.length >= this._config.maxSubscriptionsPerTopic) {
      console.warn(\`funcwcState.subscribe: Maximum subscriptions reached for topic '\${topic}'\`);
      return;
    }
    
    // Add subscription
    const subscription = {
      callback: callback,
      element: element,
      timestamp: Date.now()
    };
    
    subs.push(subscription);
    
    // Immediately call with current state if it exists
    if (this._state.has(topic)) {
      const currentState = this._state.get(topic);
      try {
        callback.call(element, currentState.data);
      } catch (error) {
        if (this._config.debugMode) {
          console.error('funcwcState: Initial callback error:', error);
        }
      }
    }
    
    if (this._config.debugMode) {
      console.log(\`funcwcState: Subscribed to '\${topic}', total subscribers: \${subs.length}\`);
    }
  },

  /**
   * Get current state for a topic
   */
  getState(topic) {
    if (typeof topic !== 'string') {
      console.warn('funcwcState.getState: topic must be a string');
      return undefined;
    }
    
    const stateEntry = this._state.get(topic);
    return stateEntry ? stateEntry.data : undefined;
  },

  /**
   * Remove all subscriptions for a topic
   */
  clearTopic(topic) {
    if (typeof topic !== 'string') {
      console.warn('funcwcState.clearTopic: topic must be a string');
      return;
    }
    
    this._state.delete(topic);
    this._subscribers.delete(topic);
    
    if (this._config.debugMode) {
      console.log(\`funcwcState: Cleared topic '\${topic}'\`);
    }
  },

  /**
   * Get all active topics
   */
  getTopics() {
    return Array.from(this._state.keys());
  },

  /**
   * Get subscription count for a topic
   */
  getSubscriberCount(topic) {
    if (typeof topic !== 'string') {
      return 0;
    }
    
    const subs = this._subscribers.get(topic);
    return subs ? subs.length : 0;
  },

  /**
   * Performance cleanup of dead subscriptions
   */
  _performCleanup() {
    let totalCleaned = 0;
    
    for (const [topic, subs] of this._subscribers.entries()) {
      const validSubs = subs.filter(sub => document.contains(sub.element));
      const cleanedCount = subs.length - validSubs.length;
      
      if (cleanedCount > 0) {
        if (validSubs.length === 0) {
          this._subscribers.delete(topic);
        } else {
          this._subscribers.set(topic, validSubs);
        }
        totalCleaned += cleanedCount;
      }
    }
    
    this._lastCleanup = Date.now();
    
    if (this._config.debugMode && totalCleaned > 0) {
      console.log(\`funcwcState: Cleanup complete, removed \${totalCleaned} dead subscriptions\`);
    }
  },

  /**
   * Debug method to inspect current state
   */
  debug() {
    console.group('🔄 funcwcState Debug Information');
    
    console.log('Active Topics:', this.getTopics());
    
    console.log('Current State:');
    for (const [topic, entry] of this._state.entries()) {
      console.log(\`  \${topic}:\`, {
        data: entry.data,
        updateCount: entry.updateCount,
        age: \`\${Math.round((Date.now() - entry.timestamp) / 1000)}s ago\`,
        subscribers: this.getSubscriberCount(topic)
      });
    }
    
    console.log('Subscription Summary:');
    for (const [topic, subs] of this._subscribers.entries()) {
      const validSubs = subs.filter(sub => document.contains(sub.element));
      console.log(\`  \${topic}: \${validSubs.length} active / \${subs.length} total\`);
    }
    
    console.log('Configuration:', this._config);
    console.log('Memory Usage:', {
      topics: this._state.size,
      totalSubscriptions: Array.from(this._subscribers.values()).reduce((sum, subs) => sum + subs.length, 0)
    });
    
    console.groupEnd();
  },

  /**
   * Configure the state manager
   */
  configure(options) {
    Object.assign(this._config, options);
    
    if (this._config.debugMode) {
      console.log('funcwcState: Configuration updated:', this._config);
    }
  },

  /**
   * Reset all state and subscriptions (useful for testing)
   */
  reset() {
    this._state.clear();
    this._subscribers.clear();
    this._lastCleanup = Date.now();
    
    if (this._config.debugMode) {
      console.log('funcwcState: Reset complete');
    }
  },

  /**
   * Get performance statistics
   */
  getStats() {
    const now = Date.now();
    let totalUpdateCount = 0;
    let oldestState = now;
    let newestState = 0;
    
    for (const entry of this._state.values()) {
      totalUpdateCount += entry.updateCount;
      if (entry.timestamp < oldestState) oldestState = entry.timestamp;
      if (entry.timestamp > newestState) newestState = entry.timestamp;
    }
    
    return {
      topics: this._state.size,
      totalUpdates: totalUpdateCount,
      totalSubscriptions: Array.from(this._subscribers.values()).reduce((sum, subs) => sum + subs.length, 0),
      oldestStateAge: this._state.size > 0 ? Math.round((now - oldestState) / 1000) : 0,
      newestStateAge: this._state.size > 0 ? Math.round((now - newestState) / 1000) : 0,
      lastCleanupAge: Math.round((now - this._lastCleanup) / 1000)
    };
  }
};

// Enable debug mode in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.funcwcState.configure({ debugMode: true });
}

// Global error handling for unhandled promise rejections in callbacks
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (window.funcwcState._config.debugMode) {
      console.warn('funcwcState: Possible unhandled promise rejection in callback:', event.reason);
    }
  });
}
`.trim();
};

/**
 * Create a lightweight state manager script for production
 * Removes debug features and comments for smaller bundle size
 */
export const createMinimalStateManagerScript = (): string => {
  return `
window.funcwcState={_state:new Map(),_subscribers:new Map(),_lastCleanup:Date.now(),publish(t,d){const s=this._state.get(t)||{updateCount:0},n={data:d,timestamp:Date.now(),updateCount:s.updateCount+1};this._state.set(t,n);const u=this._subscribers.get(t)||[],v=[];u.forEach(s=>{document.contains(s.element)&&(s.callback.call(s.element,d),v.push(s))});v.length!==u.length&&(0===v.length?this._subscribers.delete(t):this._subscribers.set(t,v));Date.now()-this._lastCleanup>3e4&&this._performCleanup()},subscribe(t,c,e){if("string"!=typeof t||"function"!=typeof c||!(e instanceof Element))return;this._subscribers.has(t)||this._subscribers.set(t,[]);const s=this._subscribers.get(t);if(s.length>=100)return;s.push({callback:c,element:e,timestamp:Date.now()});if(this._state.has(t)){const s=this._state.get(t);try{c.call(e,s.data)}catch(t){}}},getState(t){const s=this._state.get(t);return s?s.data:void 0},clearTopic(t){this._state.delete(t),this._subscribers.delete(t)},getTopics(){return Array.from(this._state.keys())},getSubscriberCount(t){const s=this._subscribers.get(t);return s?s.length:0},_performCleanup(){for(const[t,s]of this._subscribers.entries()){const u=s.filter(t=>document.contains(t.element));u.length!==s.length&&(0===u.length?this._subscribers.delete(t):this._subscribers.set(t,u))}this._lastCleanup=Date.now()},debug(){console.group("🔄 funcwcState Debug");console.log("Topics:",this.getTopics());console.log("State:",Object.fromEntries(this._state));console.groupEnd()},reset(){this._state.clear(),this._subscribers.clear(),this._lastCleanup=Date.now()}};
`.trim();
};

/**
 * Default configuration for the state manager
 */
export const defaultStateManagerConfig = {
  maxSubscriptionsPerTopic: 100,
  maxTopics: 50,
  cleanupInterval: 30000, // 30 seconds
  debugMode: false,
};

/**
 * Utility function to inject state manager into a page
 * @param minimal - Use minimal version for production
 * @param config - Configuration options
 */
export const injectStateManager = (
  minimal = false,
  config: Partial<typeof defaultStateManagerConfig> = {},
): string => {
  const script = minimal
    ? createMinimalStateManagerScript()
    : createStateManagerScript();

  const configScript = Object.keys(config).length > 0
    ? `window.funcwcState.configure(${JSON.stringify(config)});`
    : "";

  return `<script>\n${script}\n${configScript}\n</script>`;
};

// Note: Global type augmentation omitted to satisfy linting constraints.
