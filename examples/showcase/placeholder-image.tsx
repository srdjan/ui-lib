/** @jsx h */
import { defineComponent, h, number, string } from "../../index.ts";

export default defineComponent("placeholder-image", {
  render: ({
    width = number(300),
    height = number(150),
    label = string(""),
  }) => (
    <svg width={`${width}`} height={`${height}`} xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="rgb(243,244,246)" />
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dy=".3em"
        fill="rgb(156,163,175)"
        font-family="sans-serif"
        font-size="16"
      >
        {label || `${width}×${height}`}
      </text>
    </svg>
  ),
});

