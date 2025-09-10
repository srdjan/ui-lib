/** @jsx h */
import { defineComponent, h, string } from "../../../index.ts";
import { showcaseClasses } from "../../../lib/utilities/showcase-utilities.ts";

/**
 * Hero Section Component
 * Displays the main hero area with title, subtitle, and stats
 * Uses Open Props gradients and typography scales
 */
defineComponent("showcase-hero-section", {
  render: (props) => {
    const title = props?.title || "ui-lib";
    const subtitle = props?.subtitle || "The Most Ergonomic Component Library Ever Built";
    const showStats = props?.showStats !== "false";

    return (
      <section class={showcaseClasses.showcaseHero}>
        <div class={showcaseClasses.showcaseHeroContent}>
          <h1 class={showcaseClasses.showcaseHeroTitle}>{title}</h1>
          <p class={showcaseClasses.showcaseHeroSubtitle}>
            {subtitle}
          </p>
          {showStats && <showcase-hero-stats></showcase-hero-stats>}
        </div>
      </section>
    );
  },
});

/**
 * Hero Stats Component
 * Displays key metrics in the hero section
 */
defineComponent("showcase-hero-stats", {
  render: () => {
    return (
      <div
        class={showcaseClasses.showcaseGrid}
        style="max-width: 800px; margin: 0 auto;"
      >
        <div style="text-align: center;">
          <span class={showcaseClasses.showcaseStatValue}>0kb</span>
          <span class={showcaseClasses.showcaseStatLabel}>
            Runtime Overhead
          </span>
        </div>
        <div style="text-align: center;">
          <span class={showcaseClasses.showcaseStatValue}>100%</span>
          <span class={showcaseClasses.showcaseStatLabel}>Type Safe</span>
        </div>
        <div style="text-align: center;">
          <span class={showcaseClasses.showcaseStatValue}>47+</span>
          <span class={showcaseClasses.showcaseStatLabel}>Components</span>
        </div>
      </div>
    );
  },
});