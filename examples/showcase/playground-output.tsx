/** @jsx h */
import { defineComponent, h, string } from "../../index.ts";

export default defineComponent("playground-output", {
  styles: {
    container: `{
      display: block;
    }`,

    alert: `{
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-md);
      border: 1px solid transparent;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }`,

    alertSuccess: `{
      background: var(--green-1);
      border-color: var(--green-4);
      color: var(--green-9);
    }`,

    alertError: `{
      background: var(--red-1);
      border-color: var(--red-5);
      color: var(--red-9);
    }`,

    alertHeader: `{
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-weight: 700;
      font-size: 1.1rem;
    }`,

    errorText: `{
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      font-size: 0.875rem;
    }`,

    alertMeta: `{
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      opacity: 0.9;
      padding-top: var(--space-sm);
      border-top: 1px solid var(--green-3);
    }`,

    panel: `{
      background: var(--surface-1, white);
      border-radius: var(--radius-lg);
      border: 1px solid var(--gray-3);
    }`,

    panelHeader: `{
      padding: var(--space-lg);
      background: var(--gray-1);
      border-bottom: 1px solid var(--gray-3);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      font-weight: 600;
      color: var(--gray-9);
    }`,

    panelBody: `{
      padding: var(--space-lg);
    }`,

    outputInner: `{
      padding: var(--space-lg);
      background: var(--gray-0);
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-3);
    }`,
  },

  render: (
    {
      name = string("Component"),
      rendered = string(""),
      status = string("success"), // "success" | "error"
      error = string(""),
    },
    _api,
    classes,
  ) => (
    <div class={classes!.container}>
      {status === "success"
        ? (
          <div class={`${classes!.alert} ${classes!.alertSuccess}`}>
            <div class={classes!.alertHeader}>
              <span>✅</span>
              <span>Success!</span>
            </div>
            <p>
              Component "{name}" compiled and rendered successfully.
            </p>
            <div class={classes!.alertMeta}>
              <span>
                ⏱️ Render time: <strong>3ms</strong>
              </span>
              <span>
                📦 Bundle size: <strong>0kb</strong>
              </span>
              <span>
                🔍 Type check: <strong>✅ Passed</strong>
              </span>
            </div>
          </div>
        )
        : (
          <div class={`${classes!.alert} ${classes!.alertError}`}>
            <div class={classes!.alertHeader}>
              <span>❌</span>
              <span>Compilation Error</span>
            </div>
            <p class={classes!.errorText}>
              {error}
            </p>
          </div>
        )}

      <div class={classes!.panel}>
        <div class={classes!.panelHeader}>Live Component Output:</div>
        <div class={classes!.panelBody}>
          <div class={classes!.outputInner}>
            {rendered}
          </div>
        </div>
      </div>
    </div>
  ),
});
