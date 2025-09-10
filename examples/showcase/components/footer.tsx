/** @jsx h */
import { array, defineComponent, h, string } from "../../../index.ts";
import { showcaseClasses } from "../../../lib/utilities/showcase-utilities.ts";

/**
 * Footer Component
 * Simple footer with links and copyright
 * Uses Open Props for styling
 */
defineComponent("showcase-footer", {
  render: (props) => {
    const links = props?.links ? JSON.parse(props.links) : [
      { href: "https://github.com/srdjans/ui-lib", label: "GitHub" },
      { href: "/docs", label: "Documentation" },
      { href: "/examples", label: "Examples" },
      { href: "/benchmark", label: "Benchmarks" },
    ];
    const copyright = props?.copyright || "© 2024 ui-lib. Built with Deno + TypeScript + Love.";

    return (
      <footer class={showcaseClasses.showcaseFooter}>
        <div class={showcaseClasses.showcaseFooterLinks}>
          {links.map((link: any) => (
            <a href={link.href} class={showcaseClasses.showcaseFooterLink}>
              {link.label}
            </a>
          ))}
        </div>
        <p>{copyright}</p>
      </footer>
    );
  },
});