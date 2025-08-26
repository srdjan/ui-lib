// Simplified props system - optional transformer function approach

// Props transformer function type - takes raw attributes, returns whatever the user wants
export type PropsTransformer<TRawAttrs = Record<string, string>, TProps = any> = 
  (attrs: TRawAttrs) => TProps;

// Simple prop spec that's just a function or nothing
export type PropsSpec<TProps = any> = PropsTransformer<Record<string, string>, TProps> | undefined;

// Helper type to infer props type from transformer or default to raw attributes
export type InferProps<T extends PropsSpec> = 
  T extends PropsTransformer<any, infer P> ? P : Record<string, string>;