/** @jsx h */
import { defineComponent, h, object, string } from "../../../index.ts";
import { showcaseClasses } from "../../../lib/utilities/showcase-utilities.ts";

/**
 * Feature Card Component
 * Interactive card showcasing a feature with icon, title, description, and stats
 * Uses Open Props for consistent styling
 */
defineComponent("showcase-feature-card", {
  render: (props) => {
    const icon = props?.icon || "✨";
    const title = props?.title || "Feature Title";
    const description = props?.description || "Feature description goes here";
    const stats = props?.stats ? JSON.parse(props.stats) : [];
    const onClick = props?.onClick || "";

    return (
      <div
        class={showcaseClasses.showcaseFeatureCard}
        onclick={onClick || undefined}
      >
        <span class={showcaseClasses.showcaseFeatureIcon}>{icon}</span>
        <h3 class={showcaseClasses.showcaseCardTitle}>{title}</h3>
        <p class={showcaseClasses.showcaseCardDescription}>
          {description}
        </p>
        {stats.length > 0 && (
          <div class={showcaseClasses.showcaseFeatureStats}>
            {stats.map((stat: any) => (
              <div style="flex: 1; text-align: center;">
                <span class={showcaseClasses.showcaseStatValue}>
                  {stat.value}
                </span>
                <span class={showcaseClasses.showcaseStatLabel}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
});

/**
 * Feature Cards Section Component
 * Container for multiple feature cards
 */
defineComponent("showcase-feature-cards", {
  render: () => {
    const features = [
      {
        icon: "✨",
        title: "Zero Duplication",
        description:
          "Function-style props eliminate all type duplication. Write once, use everywhere with perfect type safety.",
        stats: [
          { value: "-73%", label: "Less Code" },
          { value: "100%", label: "Type Safe" },
        ],
        onClick: "showDemo('zero-duplication')",
      },
      {
        icon: "🎯",
        title: "DOM-Native State",
        description:
          "No virtual DOM, no state sync. The DOM is your state with zero overhead and perfect performance.",
        stats: [
          { value: "0kb", label: "Runtime" },
          { value: "10x", label: "Faster" },
        ],
        onClick: "showDemo('dom-native')",
      },
      {
        icon: "🚀",
        title: "Unified API",
        description:
          "Define server endpoints once, get HTMX attributes automatically. Zero client-server glue code.",
        stats: [
          { value: "1", label: "Definition" },
          { value: "∞", label: "Usage" },
        ],
        onClick: "showDemo('unified-api')",
      },
    ];

    return (
      <section style="max-width: 1200px; margin: calc(-1 * var(--size-fluid-6)) auto var(--size-fluid-6); padding: 0 var(--size-fluid-3); position: relative; z-index: 10;">
        <div class="showcase-grid">
          {features.map((feature) => (
            <showcase-feature-card
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              stats={JSON.stringify(feature.stats)}
              onClick={feature.onClick}
            />
          ))}
        </div>
      </section>
    );
  },
});