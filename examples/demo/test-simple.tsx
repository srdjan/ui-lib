/** @jsx h */
import { defineComponent, h } from "../../index.ts";

defineComponent("test-simple", {
  styles: {
    container: `{
      padding: 1rem;
      background: #f0f0f0;
    }`,
  },
  render: (props, _api, classes) => (
    <div class={classes!.container}>
      <h1>Simple Test Component</h1>
      <p>This is a test component to verify JSX parsing works.</p>
    </div>
  ),
});