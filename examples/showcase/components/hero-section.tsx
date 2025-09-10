/** @jsx h */
import { defineComponent, h, string } from "../../../index.ts";
import { showcaseClasses } from "../utilities/showcase-utilities.ts";

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
      <section class="showcase-hero">
        <div class="showcase-hero-content">
          <h1 class="showcase-hero-title">{title}</h1>
          <p class="showcase-hero-subtitle">
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
        class="showcase-grid"
        style="max-width: 800px; margin: 0 auto;"
      >
        <div style="text-align: center;">
          <span class="showcase-stat-value">0kb</span>
          <span class="showcase-stat-label">
            Runtime Overhead
          </span>
        </div>
        <div style="text-align: center;">
          <span class="showcase-stat-value">100%</span>
          <span class="showcase-stat-label">Type Safe</span>
        </div>
        <div style="text-align: center;">
          <span class="showcase-stat-value">47+</span>
          <span class="showcase-stat-label">Components</span>
        </div>
      </div>
    );
  },
});