/** @jsx h */
import { router } from "./router.ts";
import { defineComponent, h, string, boolean } from "../index.ts";
import { css, createTheme } from "../lib/css-in-ts.ts";
import { 
  Layout, 
  Grid, 
  Card, 
  ButtonGroup, 
  Navigation, 
  Form,
  type NavItem,
  type FormField
} from "../lib/composition.ts";

// Theme for consistent styling
const theme = createTheme({
  colors: {
    primary: "#2563eb",
    secondary: "#64748b",
    success: "#059669",
    warning: "#d97706",
    danger: "#dc2626",
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      500: "#6b7280",
      700: "#374151",
      900: "#111827",
    },
  },
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  radii: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },
});

/**
 * 🧩 Component Composition Demo
 * 
 * Showcases higher-level building blocks for complex UIs:
 * - Layout: Flexible container with direction, alignment, spacing
 * - Grid: CSS Grid with simplified API
 * - Card: Content containers with variants
 * - ButtonGroup: Grouped buttons with consistent styling
 * - Navigation: Multiple navigation patterns
 * - Form: Auto-generated forms from field definitions
 */
defineComponent("composition-demo", {
  router,
  
  styles: css({
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: theme.token("space", "xl"),
    },
    
    header: {
      fontSize: "2rem",
      fontWeight: 700,
      color: theme.token("colors", "gray", 900),
      marginBottom: theme.token("space", "xl"),
      textAlign: "center",
    },
    
    section: {
      marginBottom: theme.token("space", "2xl"),
    },
    
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: theme.token("colors", "primary"),
      marginBottom: theme.token("space", "lg"),
      borderBottom: `2px solid ${theme.token("colors", "primary")}`,
      paddingBottom: theme.token("space", "sm"),
    },
    
    description: {
      color: theme.token("colors", "gray", 700),
      marginBottom: theme.token("space", "lg"),
      lineHeight: 1.6,
    },
    
    demoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: theme.token("space", "lg"),
      marginBottom: theme.token("space", "lg"),
    },
    
    codeBlock: {
      background: theme.token("colors", "gray", 50),
      border: `1px solid ${theme.token("colors", "gray", 200)}`,
      borderRadius: theme.token("radii", "md"),
      padding: theme.token("space", "md"),
      fontFamily: "monospace",
      fontSize: "0.875rem",
      overflowX: "auto",
      marginTop: theme.token("space", "md"),
    },
    
    badge: {
      display: "inline-block",
      padding: `${theme.token("space", "xs")} ${theme.token("space", "sm")}`,
      background: theme.token("colors", "success"),
      color: "white",
      borderRadius: theme.token("radii", "lg"),
      fontSize: "0.75rem",
      fontWeight: 600,
      marginLeft: theme.token("space", "sm"),
    },
  }),
  
  render: (
    {
      title = string("Component Composition Helpers"),
      showCode = boolean(true),
    },
    _api,
    classes
  ) => {
    // Demo data
    const navItems: NavItem[] = [
      { label: "Dashboard", href: "/dashboard", active: true },
      { label: "Analytics", href: "/analytics", badge: "3" },
      { label: "Settings", href: "/settings" },
      { label: "Help", href: "/help", disabled: true },
    ];

    const formFields: FormField[] = [
      { type: "text", name: "name", label: "Full Name", placeholder: "Enter your name", required: true },
      { type: "email", name: "email", label: "Email", placeholder: "Enter your email", required: true },
      { type: "select", name: "role", label: "Role", options: [
        { value: "", label: "Select a role" },
        { value: "admin", label: "Administrator" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Viewer" },
      ]},
      { type: "textarea", name: "bio", label: "Bio", placeholder: "Tell us about yourself" },
      { type: "checkbox", name: "newsletter", label: "Subscribe to newsletter", checked: true },
    ];

    return (
      <div class={classes!.container}>
        <style dangerouslySetInnerHTML={{ __html: theme.vars() }} />
        
        <h1 class={classes!.header}>{title}</h1>
        
        {/* Layout Demo */}
        <div class={classes!.section}>
          <h2 class={classes!.sectionTitle}>
            Layout Component
            <span class={classes!.badge}>Flexbox</span>
          </h2>
          <p class={classes!.description}>
            Flexible container with direction, alignment, and spacing controls.
            Perfect for building responsive layouts with consistent spacing.
          </p>
          
          <div class={classes!.demoGrid}>
            {Layout({
              direction: "horizontal",
              align: "center",
              justify: "between",
              gap: "1rem",
              className: "demo-layout",
              children: [
                Card({ children: ["Horizontal Layout"], padding: "1rem" }),
                Card({ children: ["With Justification"], padding: "1rem" }),
                Card({ children: ["And Alignment"], padding: "1rem" }),
              ]
            })}
            
            {Layout({
              direction: "vertical",
              align: "center",
              gap: "0.5rem",
              className: "demo-layout",
              children: [
                Card({ children: ["Vertical"], padding: "1rem" }),
                Card({ children: ["Layout"], padding: "1rem" }),
                Card({ children: ["Stack"], padding: "1rem" }),
              ]
            })}
          </div>
          
          {showCode && (
            <pre class={classes!.codeBlock}>
{`Layout({
  direction: "horizontal", // or "vertical"
  align: "center",         // start | center | end | stretch
  justify: "between",      // start | center | end | between | around | evenly
  gap: "1rem",            // spacing between items
  children: [...],        // content
})`}
            </pre>
          )}
        </div>

        {/* Grid Demo */}
        <div class={classes!.section}>
          <h2 class={classes!.sectionTitle}>
            Grid Component
            <span class={classes!.badge}>CSS Grid</span>
          </h2>
          <p class={classes!.description}>
            CSS Grid container with simplified API. Automatically handles complex grid layouts
            with responsive behavior.
          </p>
          
          {Grid({
            columns: 3,
            gap: "1rem",
            className: "demo-grid",
            children: [
              Card({ children: ["Grid Item 1"], padding: "1rem" }),
              Card({ children: ["Grid Item 2"], padding: "1rem" }),
              Card({ children: ["Grid Item 3"], padding: "1rem" }),
              Card({ children: ["Grid Item 4"], padding: "1rem" }),
              Card({ children: ["Grid Item 5"], padding: "1rem" }),
              Card({ children: ["Grid Item 6"], padding: "1rem" }),
            ]
          })}
          
          {showCode && (
            <pre class={classes!.codeBlock}>
{`Grid({
  columns: 3,              // number or CSS template
  rows: "auto",           // number or CSS template  
  gap: "1rem",           // grid gap
  areas: "header header", // grid template areas (optional)
  children: [...],       // grid items
})`}
            </pre>
          )}
        </div>

        {/* Card Demo */}
        <div class={classes!.section}>
          <h2 class={classes!.sectionTitle}>
            Card Component
            <span class={classes!.badge}>Variants</span>
          </h2>
          <p class={classes!.description}>
            Flexible content containers with multiple variants and optional header/footer sections.
          </p>
          
          <div class={classes!.demoGrid}>
            {Card({
              variant: "elevated",
              header: "Elevated Card",
              footer: "Card footer text",
              children: ["This card uses box-shadow for elevation effect."]
            })}
            
            {Card({
              variant: "outlined",
              header: "Outlined Card", 
              children: ["This card uses a border outline style."]
            })}
            
            {Card({
              variant: "filled",
              header: "Filled Card",
              children: ["This card uses a filled background style."]
            })}
          </div>
          
          {showCode && (
            <pre class={classes!.codeBlock}>
{`Card({
  variant: "elevated",    // elevated | outlined | filled
  padding: "1.5rem",     // inner spacing
  radius: "0.5rem",      // border radius
  header: "Card Title",   // optional header
  footer: "Footer text",  // optional footer
  children: [...],       // card content
})`}
            </pre>
          )}
        </div>

        {/* Navigation Demo */}
        <div class={classes!.section}>
          <h2 class={classes!.sectionTitle}>
            Navigation Component
            <span class={classes!.badge}>Multiple Styles</span>
          </h2>
          <p class={classes!.description}>
            Flexible navigation with multiple variants: tabs, pills, breadcrumbs, and sidebar.
            Automatically handles active states, badges, and accessibility.
          </p>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem; font-weight: 600;">Tabs Style</h3>
            {Navigation({ items: navItems, variant: "tabs" })}
          </div>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem; font-weight: 600;">Pills Style</h3>
            {Navigation({ items: navItems, variant: "pills" })}
          </div>
          
          <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem; font-weight: 600;">Breadcrumbs Style</h3>
            {Navigation({ 
              items: [
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Electronics", href: "/products/electronics", active: true },
              ], 
              variant: "breadcrumbs" 
            })}
          </div>
          
          {showCode && (
            <pre class={classes!.codeBlock}>
{`Navigation({
  items: [
    { label: "Dashboard", href: "/dashboard", active: true },
    { label: "Analytics", href: "/analytics", badge: "3" },
    { label: "Settings", href: "/settings" },
    { label: "Help", href: "/help", disabled: true },
  ],
  variant: "tabs",        // tabs | pills | breadcrumbs | sidebar
  orientation: "horizontal", // horizontal | vertical
})`}
            </pre>
          )}
        </div>

        {/* ButtonGroup Demo */}
        <div class={classes!.section}>
          <h2 class={classes!.sectionTitle}>
            ButtonGroup Component
            <span class={classes!.badge}>Attached/Spaced</span>
          </h2>
          <p class={classes!.description}>
            Groups buttons with consistent spacing and styling. Supports attached and spaced variants
            in both horizontal and vertical orientations.
          </p>
          
          <div class={classes!.demoGrid}>
            <div>
              <h3 style="margin-bottom: 1rem; font-weight: 600;">Attached Horizontal</h3>
              {ButtonGroup({
                variant: "attached",
                orientation: "horizontal",
                children: [
                  "<button class='btn btn-outline'>Left</button>",
                  "<button class='btn btn-outline'>Center</button>",
                  "<button class='btn btn-outline'>Right</button>",
                ]
              })}
            </div>
            
            <div>
              <h3 style="margin-bottom: 1rem; font-weight: 600;">Spaced Horizontal</h3>
              {ButtonGroup({
                variant: "spaced",
                size: "md",
                children: [
                  "<button class='btn btn-primary'>Save</button>",
                  "<button class='btn btn-secondary'>Cancel</button>",
                  "<button class='btn btn-danger'>Delete</button>",
                ]
              })}
            </div>
          </div>
          
          {showCode && (
            <pre class={classes!.codeBlock}>
{`ButtonGroup({
  variant: "attached",     // attached | spaced
  size: "md",             // sm | md | lg
  orientation: "horizontal", // horizontal | vertical
  children: [
    "<button>Button 1</button>",
    "<button>Button 2</button>",
    "<button>Button 3</button>",
  ],
})`}
            </pre>
          )}
        </div>

        {/* Form Demo */}
        <div class={classes!.section}>
          <h2 class={classes!.sectionTitle}>
            Form Component
            <span class={classes!.badge}>Auto-Generated</span>
          </h2>
          <p class={classes!.description}>
            Auto-generate complete forms from field definitions. Handles validation,
            accessibility, and consistent styling automatically.
          </p>
          
          {Form({
            fields: formFields,
            action: "/submit",
            method: "POST",
            submitText: "Create Account",
            resetText: "Clear Form"
          })}
          
          {showCode && (
            <pre class={classes!.codeBlock}>
{`Form({
  fields: [
    { type: "text", name: "name", label: "Full Name", required: true },
    { type: "email", name: "email", label: "Email", required: true },
    { type: "select", name: "role", label: "Role", options: [...] },
    { type: "textarea", name: "bio", label: "Bio" },
    { type: "checkbox", name: "newsletter", label: "Subscribe" },
  ],
  action: "/submit",
  method: "POST",
  submitText: "Create Account",
  resetText: "Clear Form",
})`}
            </pre>
          )}
        </div>

        {/* Benefits Summary */}
        <div class={classes!.section}>
          <h2 class={classes!.sectionTitle}>Benefits</h2>
          
          {Grid({
            columns: 2,
            gap: "1.5rem",
            children: [
              Card({
                variant: "outlined",
                header: "🚀 Rapid Development",
                children: ["Build complex UIs in minutes instead of hours. Pre-built components handle common patterns automatically."]
              }),
              
              Card({
                variant: "outlined", 
                header: "🎨 Consistent Design",
                children: ["All components follow the same design principles and can be themed consistently across your application."]
              }),
              
              Card({
                variant: "outlined",
                header: "♿ Accessibility Built-in",
                children: ["ARIA attributes, keyboard navigation, and screen reader support are included by default."]
              }),
              
              Card({
                variant: "outlined",
                header: "📱 Responsive by Default",
                children: ["Components adapt to different screen sizes and orientations automatically."]
              }),
            ]
          })}
        </div>
      </div>
    );
  },
});