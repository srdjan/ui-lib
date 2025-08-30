export {};

declare global {
  interface Window {
    // Adapter exposed by examples/server.ts; minimal facade over funcwcState
    StateManager?: {
      publish: (topic: string, data: unknown) => void;
      subscribe: (topic: string, cb: (data: unknown) => void, el: Element) => void;
      getState: (topic: string) => unknown;
      getTopics?: () => string[];
      persistState?: () => void;
      restoreState?: () => void;
    };
  }
}

