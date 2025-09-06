/** @jsx h */
import { defineComponent, h, string } from "../../index.ts";

export default defineComponent("generic-demo-preview", {
  styles: {
    container: `{
      padding: 2rem;
      text-align: center;
      background: linear-gradient(135deg, var(--blue-1), var(--cyan-2));
      border-radius: 0.5rem;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.5rem;
    }`,
    title: `{
      color: var(--cyan-9);
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
      font-weight: 800;
    }`,
    subtitle: `{
      color: var(--cyan-10);
      margin-bottom: 1rem;
    }`,
    badges: `{
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1rem;
    }`,
    badge: `{
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      color: white;
      font-weight: 600;
    }`,
    badgeA: `{ background: var(--indigo-6); }`,
    badgeB: `{ background: var(--teal-6); }`,
    badgeC: `{ background: var(--pink-6); }`,
    badgeD: `{ background: var(--violet-6); }`,
  },

  // Expect a demo prop from the server route
  render: ({ demo = string("") }, _api: any, classes: any) => {
    const name = (demo as string) || "Demo";
    const media = String(demo) === "media";
    return (
      <div class={classes.container}>
        <h3 class={classes.title}>
          🚀 {name.charAt(0).toUpperCase() + name.slice(1)} Demo
        </h3>
        <p class={classes.subtitle}>
          Revolutionary {name} components coming soon!
        </p>
        <div class={classes.badges}>
          {media
            ? [
              <div class={`${classes.badge} ${classes.badgeC}`}>
                🎵 Audio Player
              </div>,
              <div class={`${classes.badge} ${classes.badgeB}`}>
                🎥 Video Controls
              </div>,
              <div class={`${classes.badge} ${classes.badgeD}`}>
                🎨 UI Themes
              </div>,
            ]
            : [
              <div class={`${classes.badge} ${classes.badgeA}`}>
                ⚡ 10x Faster
              </div>,
              <div class={`${classes.badge} ${classes.badgeB}`}>
                📦 0kb Bundle
              </div>,
              <div class={`${classes.badge} ${classes.badgeC}`}>
                ✨ 100% Type Safe
              </div>,
            ]}
        </div>
      </div>
    );
  },
});
