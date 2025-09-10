// Showcase-specific utility classes using Open Props
// Higher-level semantic patterns for the showcase pages

import { css } from "../css-in-ts.ts";

/**
 * Showcase utility classes that leverage Open Props design tokens
 * These are semantic, higher-level utilities for common showcase patterns
 */
export const showcaseUtilities = css({
  // Layout patterns
  showcaseSection: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "var(--size-fluid-6) var(--size-fluid-3)",
    "@media": {
      sm: {
        padding: "var(--size-fluid-5) var(--size-fluid-2)",
      },
    },
  },

  showcaseContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 var(--size-fluid-2)",
  },

  showcaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "var(--size-fluid-3)",
    "@media": {
      sm: {
        gridTemplateColumns: "1fr",
        gap: "var(--size-fluid-2)",
      },
    },
  },

  // Hero patterns
  showcaseHero: {
    background: "var(--gradient-19)", // Open Props gradient
    color: "var(--gray-0)",
    padding: "var(--size-fluid-6) var(--size-fluid-3)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    minHeight: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  showcaseHeroContent: {
    position: "relative",
    zIndex: 1,
    maxWidth: "1200px",
    margin: "0 auto",
  },

  showcaseHeroTitle: {
    fontSize: "var(--font-size-fluid-3)",
    fontWeight: "var(--font-weight-9)",
    lineHeight: "var(--font-lineheight-0)",
    marginBottom: "var(--size-fluid-2)",
    background: "linear-gradient(to right, var(--gray-0), var(--gray-2))",
    backgroundClip: "text",
    color: "transparent",
  },

  showcaseHeroSubtitle: {
    fontSize: "var(--font-size-fluid-1)",
    fontWeight: "var(--font-weight-3)",
    marginBottom: "var(--size-fluid-4)",
    opacity: 0.95,
    color: "var(--gray-1)",
  },

  // Card patterns
  showcaseCard: {
    background: "var(--surface-1)",
    borderRadius: "var(--radius-3)",
    padding: "var(--size-fluid-3)",
    boxShadow: "var(--shadow-3)",
    transition: "all var(--animation-fade-in)",
    position: "relative",
    overflow: "hidden",
  },

  showcaseCardHover: {
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "var(--shadow-5)",
    },
  },

  showcaseCardHeader: {
    borderBottom: "1px solid var(--surface-2)",
    paddingBottom: "var(--size-fluid-2)",
    marginBottom: "var(--size-fluid-2)",
  },

  showcaseCardTitle: {
    fontSize: "var(--font-size-4)",
    fontWeight: "var(--font-weight-7)",
    color: "var(--text-1)",
    marginBottom: "var(--size-2)",
  },

  showcaseCardDescription: {
    color: "var(--text-2)",
    lineHeight: "var(--font-lineheight-3)",
    marginBottom: "var(--size-fluid-2)",
  },

  // Feature card specific
  showcaseFeatureCard: {
    background: "var(--surface-1)",
    borderRadius: "var(--radius-3)",
    padding: "var(--size-fluid-3)",
    boxShadow: "var(--shadow-3)",
    transition: "all var(--animation-fade-in)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: "var(--gradient-3)",
      transform: "scaleX(0)",
      transition: "transform var(--animation-fade-in)",
    },
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "var(--shadow-5)",
    },
    "&:hover::before": {
      transform: "scaleX(1)",
    },
  },

  showcaseFeatureIcon: {
    fontSize: "2.5rem",
    marginBottom: "var(--size-3)",
    display: "inline-block",
  },

  showcaseFeatureStats: {
    display: "flex",
    gap: "var(--size-fluid-2)",
    paddingTop: "var(--size-3)",
    borderTop: "1px solid var(--surface-2)",
  },

  // Metrics bar patterns
  showcaseMetricsBar: {
    background: "var(--gradient-8)",
    color: "var(--gray-0)",
    padding: "var(--size-fluid-2) var(--size-fluid-3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "var(--shadow-4)",
  },

  showcaseMetricsContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-around",
    gap: "var(--size-fluid-3)",
    flexWrap: "wrap",
  },

  showcaseMetric: {
    display: "flex",
    alignItems: "center",
    gap: "var(--size-2)",
  },

  showcaseMetricLabel: {
    fontSize: "var(--font-size-0)",
    opacity: 0.7,
  },

  showcaseMetricValue: {
    fontSize: "var(--font-size-3)",
    fontWeight: "var(--font-weight-7)",
    color: "var(--green-3)",
  },

  // Demo viewer patterns
  showcaseDemoTabs: {
    display: "flex",
    gap: "var(--size-2)",
    marginBottom: "var(--size-fluid-3)",
    borderBottom: "2px solid var(--surface-2)",
    overflowX: "auto",
  },

  showcaseDemoTab: {
    padding: "var(--size-3) var(--size-fluid-2)",
    background: "none",
    border: "none",
    color: "var(--text-2)",
    fontSize: "var(--font-size-1)",
    fontWeight: "var(--font-weight-5)",
    cursor: "pointer",
    position: "relative",
    whiteSpace: "nowrap",
    transition: "color var(--animation-fade-in)",
    "&:hover": {
      color: "var(--text-1)",
    },
    "&.active": {
      color: "var(--blue-6)",
    },
    "&.active::after": {
      content: '""',
      position: "absolute",
      bottom: "-2px",
      left: 0,
      right: 0,
      height: "2px",
      background: "var(--blue-6)",
    },
  },

  showcaseDemoContent: {
    minHeight: "500px",
    width: "100%",
  },

  showcasePanel: {
    background: "var(--surface-1)",
    borderRadius: "var(--radius-2)",
    boxShadow: "var(--shadow-2)",
    overflow: "hidden",
  },

  showcasePanelHeader: {
    padding: "var(--size-3) var(--size-fluid-2)",
    background: "var(--surface-2)",
    borderBottom: "1px solid var(--surface-3)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  showcasePanelTitle: {
    fontWeight: "var(--font-weight-6)",
    color: "var(--text-2)",
  },

  showcasePanelActions: {
    display: "flex",
    gap: "var(--size-2)",
  },

  showcasePanelAction: {
    padding: "var(--size-1) var(--size-2)",
    background: "var(--surface-1)",
    border: "1px solid var(--surface-3)",
    borderRadius: "var(--radius-1)",
    color: "var(--text-2)",
    fontSize: "var(--font-size-0)",
    cursor: "pointer",
    transition: "all var(--animation-fade-in)",
    "&:hover": {
      background: "var(--surface-2)",
      color: "var(--text-1)",
      borderColor: "var(--surface-4)",
    },
  },

  // Code preview patterns
  showcaseCodeContent: {
    padding: "var(--size-fluid-2)",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--font-size-0)",
    lineHeight: "var(--font-lineheight-3)",
    overflowX: "auto",
    background: "var(--gray-11)",
    color: "var(--gray-0)",
  },

  showcasePreviewContent: {
    padding: "var(--size-fluid-3)",
    minHeight: "500px",
  },

  // Footer patterns
  showcaseFooter: {
    background: "var(--gray-11)",
    color: "var(--gray-0)",
    padding: "var(--size-fluid-4) var(--size-fluid-3)",
    textAlign: "center",
    marginTop: "var(--size-fluid-6)",
  },

  showcaseFooterLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "var(--size-fluid-3)",
    marginBottom: "var(--size-fluid-2)",
  },

  showcaseFooterLink: {
    color: "var(--gray-5)",
    textDecoration: "none",
    transition: "color var(--animation-fade-in)",
    "&:hover": {
      color: "var(--gray-0)",
    },
  },

  // Animation utilities
  showcaseAnimateIn: {
    animation: "var(--animation-fade-in-bloom)",
  },

  // Modal patterns (using Open Props)
  showcaseModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "var(--gray-12-transparent)",
    zIndex: 1000,
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    "&.open": {
      display: "flex",
    },
  },

  showcaseModalContent: {
    background: "var(--surface-1)",
    borderRadius: "var(--radius-3)",
    width: "90%",
    maxWidth: "1000px",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "var(--shadow-6)",
    animation: "var(--animation-slide-in-up)",
  },

  showcaseModalHeader: {
    padding: "var(--size-fluid-2)",
    background: "var(--surface-2)",
    borderBottom: "1px solid var(--surface-3)",
    borderRadius: "var(--radius-3) var(--radius-3) 0 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  showcaseModalTitle: {
    fontSize: "var(--font-size-3)",
    fontWeight: "var(--font-weight-7)",
    color: "var(--text-1)",
    display: "flex",
    alignItems: "center",
    gap: "var(--size-2)",
  },

  showcaseModalBody: {
    flex: 1,
    overflow: "auto",
    padding: 0,
  },

  showcaseModalFooter: {
    padding: "var(--size-3)",
    background: "var(--surface-2)",
    borderTop: "1px solid var(--surface-3)",
    display: "flex",
    gap: "var(--size-3)",
    justifyContent: "flex-end",
  },

  // Button utilities (using Open Props)
  showcaseButton: {
    padding: "var(--size-2) var(--size-4)",
    background: "var(--surface-1)",
    border: "1px solid var(--surface-3)",
    borderRadius: "var(--radius-2)",
    cursor: "pointer",
    fontSize: "var(--font-size-1)",
    fontWeight: "var(--font-weight-5)",
    transition: "all var(--animation-fade-in)",
    "&:hover": {
      background: "var(--surface-2)",
    },
  },

  showcaseButtonPrimary: {
    background: "var(--gradient-3)",
    color: "var(--gray-0)",
    border: "none",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "var(--shadow-3)",
    },
  },

  // Shopping cart sidebar patterns
  showcaseCartSidebar: {
    position: "fixed",
    top: 0,
    right: "-400px",
    width: "400px",
    height: "100vh",
    background: "var(--surface-1)",
    boxShadow: "var(--shadow-5)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1001,
    transition: "right var(--animation-slide-out-right)",
    "&.open": {
      right: 0,
    },
  },

  showcaseCartHeader: {
    padding: "var(--size-fluid-3)",
    background: "var(--surface-2)",
    borderBottom: "1px solid var(--surface-3)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  showcaseCartItems: {
    flex: 1,
    overflowY: "auto",
    padding: "var(--size-3)",
  },

  showcaseCartFooter: {
    padding: "var(--size-fluid-3)",
    background: "var(--surface-2)",
    borderTop: "1px solid var(--surface-3)",
  },

  // Floating action button
  showcaseFloatingButton: {
    position: "fixed",
    bottom: "var(--size-8)",
    right: "var(--size-8)",
    background: "var(--gradient-3)",
    color: "var(--gray-0)",
    border: "none",
    borderRadius: "var(--radius-round)",
    padding: "var(--size-3) var(--size-4)",
    fontSize: "var(--font-size-1)",
    fontWeight: "var(--font-weight-6)",
    cursor: "pointer",
    boxShadow: "var(--shadow-4)",
    transition: "all var(--animation-fade-in)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "var(--size-2)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "var(--shadow-5)",
    },
  },

  // Playground patterns
  showcasePlayground: {
    background: "var(--surface-2)",
    padding: "var(--size-fluid-6) var(--size-fluid-3)",
    marginTop: "var(--size-fluid-6)",
  },

  showcasePlaygroundHeader: {
    textAlign: "center",
    marginBottom: "var(--size-fluid-4)",
  },

  showcasePlaygroundEditor: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "var(--size-fluid-3)",
    height: "600px",
    "@media": {
      md: {
        gridTemplateColumns: "1fr",
        height: "auto",
      },
    },
  },

  showcaseEditorPanel: {
    background: "var(--surface-1)",
    borderRadius: "var(--radius-2)",
    boxShadow: "var(--shadow-2)",
    display: "flex",
    flexDirection: "column",
  },

  showcaseEditorTextarea: {
    flex: 1,
    padding: "var(--size-fluid-2)",
    border: "none",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--font-size-0)",
    lineHeight: "var(--font-lineheight-3)",
    resize: "none",
    background: "var(--gray-11)",
    color: "var(--gray-0)",
  },

  showcaseRunButton: {
    padding: "var(--size-3) var(--size-fluid-3)",
    background: "var(--gradient-3)",
    color: "var(--gray-0)",
    border: "none",
    borderRadius: "var(--radius-2)",
    fontSize: "var(--font-size-1)",
    fontWeight: "var(--font-weight-6)",
    cursor: "pointer",
    transition: "all var(--animation-fade-in)",
    margin: "var(--size-fluid-2)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "var(--shadow-3)",
    },
  },

  // Utility helpers
  showcaseMutedText: {
    padding: "var(--size-8)",
    textAlign: "center",
    color: "var(--text-2)",
  },

  showcaseStatValue: {
    fontSize: "var(--font-size-4)",
    fontWeight: "var(--font-weight-7)",
    color: "var(--blue-6)",
    display: "block",
  },

  showcaseStatLabel: {
    fontSize: "var(--font-size-0)",
    color: "var(--text-2)",
  },
});

// Export individual class names for easier use
export const showcaseClasses = showcaseUtilities.classMap;

// Export the CSS string for injection
export const showcaseStyles = showcaseUtilities.css;