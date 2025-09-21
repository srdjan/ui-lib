import { parseRenderParameters } from "./render-parameter-parser.ts";
import { extractPropDefinitions } from "./prop-helpers.ts";
// Props transformer type - now local since it's no longer in define-component
type PropsTransformer<TRawAttrs = Record<string, string>, TProps = unknown> = (
  attrs: TRawAttrs,
) => TProps;
import { getConfig } from "./config.ts";

interface PropsParserConfig<TProps> {
  name: string;
  props?: PropsTransformer<Record<string, string>, TProps>;
  autoProps?: boolean;
  render: (...args: any[]) => unknown;
}

export function createPropsParser<TProps>(
  config: PropsParserConfig<TProps>,
): PropsTransformer<Record<string, string>, TProps> | undefined {
  const {
    props: propsTransformer,
    autoProps,
    render,
    name,
  } = config;
  const shouldAutoInfer = autoProps !== false;

  // Auto-generate props transformer from render function parameters if none provided
  let finalPropsTransformer = propsTransformer;
  if (!propsTransformer && shouldAutoInfer) {
    const { propHelpers, hasProps } = parseRenderParameters(render);
    if (hasProps) {
      const { propsTransformer: autoTransformer } = extractPropDefinitions(
        propHelpers,
      );
      finalPropsTransformer = autoTransformer as PropsTransformer<
        Record<string, string>,
        TProps
      >;
      if (getConfig().logging || getConfig().dev) {
        console.log(
          `Auto-generated props for component "${name}":`,
          Object.keys(propHelpers),
        );
      }
    }
  }

  return finalPropsTransformer;
}
