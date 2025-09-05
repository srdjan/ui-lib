/** @jsx h */
// deno-lint-ignore-file verbatim-module-syntax
import { router } from "./router.ts";
import { defineComponent, h, string } from "../index.ts";

/**
 * 🧾 Form Demo - Open Props UI fields
 * Demonstrates OPUI buttons and basic form controls styled by Open Props.
 */

defineComponent("form-demo", {
  router,
  autoProps: true,
  styles: {
    formCard: `{
      display: block;
      padding: var(--size-4);
      border-radius: var(--radius-2);
      background: var(--surface-1);
      box-shadow: var(--shadow-2);
    }`,
    fieldGroup: `{
      display: grid;
      gap: var(--size-3);
    }`,
    label: `{
      font-weight: var(--font-weight-6);
      font-size: var(--font-size-1);
    }`,
    input: `{
      width: 100%;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      border: var(--border-size-2) solid var(--surface-3);
      background: var(--surface-1);
      color: var(--text-1);
    }`,
    select: `{
      width: 100%;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      border: var(--border-size-2) solid var(--surface-3);
      background: var(--surface-1);
      color: var(--text-1);
    }`,
    textarea: `{
      width: 100%;
      min-height: 6rem;
      padding: var(--size-2) var(--size-3);
      border-radius: var(--radius-2);
      border: var(--border-size-2) solid var(--surface-3);
      background: var(--surface-1);
      color: var(--text-1);
      resize: vertical;
    }`,
    fieldset: `{
      border: var(--border-size-2) solid var(--surface-3);
      border-radius: var(--radius-2);
      padding: var(--size-3);
    }`,
    legend: `{
      font-weight: var(--font-weight-6);
      padding: 0 var(--size-1);
      color: var(--text-1);
    }`,
    checkRow: `{
      display: flex;
      align-items: center;
      gap: var(--size-2);
    }`,
    radioRow: `{
      display: flex;
      align-items: center;
      gap: var(--size-2);
    }`,
  },
  render: (
    {
      title = string("Open Props UI Form"),
    },
    _api,
    classes,
  ) => {
    const heading = typeof title === "string" ? title : "Open Props UI Form";

    return (
      <section class="u-card u-p-4" aria-label="Form demo">
        <h3>{heading}</h3>
        <form class={`opui-form ${classes!.formCard}`} action="#" method="get">
          <div class={classes!.fieldGroup}>
            <div>
              <label class={classes!.label} for="name">Name</label>
              <input
                class={classes!.input}
                type="text"
                id="name"
                name="name"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label class={classes!.label} for="email">Email</label>
              <input
                class={classes!.input}
                type="email"
                id="email"
                name="email"
                placeholder="jane@example.com"
                required
              />
            </div>
            <div>
              <label class={classes!.label} for="role">Role</label>
              <select class={classes!.select} id="role" name="role" required>
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label class={classes!.label} for="about">About</label>
              <textarea
                class={classes!.textarea}
                id="about"
                name="about"
                placeholder="Short bio"
              >
              </textarea>
            </div>
            <fieldset class={classes!.fieldset}>
              <legend class={classes!.legend}>Preferences</legend>
              <div class={classes!.checkRow}>
                <input type="checkbox" id="pref-email" name="pref-email" />
                <label for="pref-email">Email notifications</label>
              </div>
              <div class={classes!.checkRow}>
                <input type="checkbox" id="pref-sms" name="pref-sms" />
                <label for="pref-sms">SMS notifications</label>
              </div>
            </fieldset>
            <fieldset class={classes!.fieldset}>
              <legend class={classes!.legend}>Plan</legend>
              <div class={classes!.radioRow}>
                <input
                  type="radio"
                  id="plan-free"
                  name="plan"
                  value="free"
                  checked
                />
                <label for="plan-free">Free</label>
              </div>
              <div class={classes!.radioRow}>
                <input type="radio" id="plan-pro" name="plan" value="pro" />
                <label for="plan-pro">Pro</label>
              </div>
              <div class={classes!.radioRow}>
                <input
                  type="radio"
                  id="plan-enterprise"
                  name="plan"
                  value="enterprise"
                />
                <label for="plan-enterprise">Enterprise</label>
              </div>
            </fieldset>
          </div>
          <div
            class="u-btn-group u-mt-3"
            role="group"
            aria-label="Form actions"
          >
            <button
              type="submit"
              class="btn btn-success u-transition u-focus-ring"
            >
              Submit
            </button>
            <button
              type="reset"
              class="btn btn-warning u-transition u-focus-ring"
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    );
  },
});
