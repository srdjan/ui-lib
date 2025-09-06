/** @jsx h */
import { Alert, Button, defineComponent, h, Input } from "../../index.ts";

// Forms Preview component rendered via SSR from examples/server.ts
// Option 2: Keep server.ts SSR string response, but generate the HTML via defineComponent
export default defineComponent("forms-preview", {
  styles: {
    // HTMX indicator utility
    htmxIndicator: `{
      display: none;
    }`,
    htmxRequestShow: `{
      display: inline;
    }`,

    // Utilities
    row: `{
      display: flex;
      gap: var(--space-md);
      align-items: center;
    }`,
    alignEnd: `{
      align-items: end;
    }`,
    mt1: `{
      margin-top: var(--space-md);
    }`,
    mt2: `{
      margin-top: var(--space-xl);
    }`,
    ml1: `{
      margin-left: var(--space-md);
    }`,
    inlineRow: `{
      display: inline-flex;
      gap: var(--space-md);
    }`,
    textCenter: `{
      text-align: center;
    }`,
    textMuted: `{
      color: var(--gray-600);
    }`,
    textHeroMuted: `{
      color: var(--gray-100);
      opacity: 0.8;
    }`,
    lead: `{
      margin-bottom: var(--space-lg);
      opacity: 0.9;
    }`,
    flex1: `{
      flex: 1;
    }`,

    // Preview panel
    panel: `{
      width: 100%;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }`,
    panelHeader: `{
      padding: var(--space-md) var(--space-lg);
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }`,
    panelTitle: `{
      font-weight: 600;
      color: var(--gray-700);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }`,
    panelActions: `{
      display: flex;
      gap: var(--space-sm);
    }`,
    panelAction: `{
      padding: var(--space-xs) var(--space-md);
      background: white;
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-md);
      color: var(--gray-600);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }`,
    previewContent: `{
      padding: var(--space-xl);
      min-height: 500px;
    }`,

    pageGrid: `{
      display: grid;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }`,

    // Cards
    card: `{
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
    }`,
    cardTitle: `{
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--space-md);
      color: var(--gray-900);
    }`,
    result: `{
      margin-bottom: var(--space-md);
    }`,
    formVertical: `{
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }`,
    grid2: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }`,

    // Hero card
    cardHero: `{
      background: linear-gradient(135deg, var(--indigo-6) 0%, var(--purple-6) 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      color: white;
    }`,
    heroTitle: `{
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 var(--space-xs) 0;
    }`,

    // Badges
    badge: `{
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      color: white;
    }`,
    badgeSuccess: `{
      background: var(--green-6);
    }`,
    badgePrimary: `{
      background: var(--blue-6);
    }`,
    badgePurple: `{
      background: var(--purple-6);
    }`,
  },

  render: (_: Record<string, unknown>, __: unknown, classes: any) => (
    <div>
      <style>
        {`.htmx-indicator{${classes.htmxIndicator}} .htmx-request .htmx-indicator{${classes.htmxRequestShow}}`}
      </style>
      <div class={classes.pageGrid}>
        {/* Registration */}
        <div class={classes.card}>
          <h3 class={classes.cardTitle}>User Registration</h3>
          <div id="registration-result" class={classes.result}></div>
          <form
            hx-post="/api/forms/register"
            hx-target="#registration-result"
            hx-indicator="#reg-spinner"
            class={classes.formVertical}
          >
            <div class={classes.grid2}>
              {Input({
                type: "text",
                name: "firstName",
                label: "First Name",
                placeholder: "John",
                required: true,
                size: "lg",
                variant: "filled",
              })}
              {Input({
                type: "text",
                name: "lastName",
                label: "Last Name",
                placeholder: "Doe",
                required: true,
                size: "lg",
                variant: "filled",
              })}
            </div>
            {Input({
              type: "email",
              name: "email",
              label: "Email Address",
              placeholder: "john@example.com",
              required: true,
              helpText: "We'll never share your email",
              size: "lg",
              variant: "filled",
            })}
            {Input({
              type: "password",
              name: "password",
              label: "Password",
              placeholder: "Choose a strong password",
              required: true,
              helpText: "At least 8 characters",
              size: "lg",
              variant: "filled",
            })}
            {Alert({
              variant: "info",
              children: "All fields are validated in real-time",
            })}
            <div class={`${classes.row} ${classes.mt1}`}>
              {Button({
                type: "submit",
                variant: "primary",
                size: "lg",
                className: "btn btn-primary",
                children: "Create Account",
              })}
              {Button({
                type: "button",
                variant: "outline",
                size: "lg",
                className: "btn",
                children: "Cancel",
              })}
              <div id="reg-spinner" class={`htmx-indicator ${classes.ml1}`}>
                <span class={classes.textMuted}>Processing...</span>
              </div>
            </div>
          </form>
        </div>

        {/* Contact */}
        <div class={classes.card}>
          <h3 class={classes.cardTitle}>Contact Us</h3>
          <div id="contact-result" class={classes.result}></div>
          <form
            hx-post="/api/forms/contact"
            hx-target="#contact-result"
            hx-indicator="#contact-spinner"
            class={classes.formVertical}
          >
            <div class={classes.grid2}>
              {Input({
                type: "text",
                name: "name",
                label: "Full Name",
                required: true,
                size: "lg",
                variant: "filled",
              })}
              {Input({
                type: "email",
                name: "email",
                label: "Email",
                required: true,
                size: "lg",
                variant: "filled",
              })}
            </div>
            {Input({
              type: "tel",
              name: "phone",
              label: "Phone Number",
              placeholder: "(555) 123-4567",
              size: "lg",
              variant: "filled",
            })}
            {Input({
              type: "textarea",
              name: "message",
              label: "Message",
              placeholder: "Tell us about your project...",
              rows: 4,
              required: true,
              size: "lg",
              variant: "filled",
            })}
            <div class={classes.row}>
              {Button({
                type: "submit",
                variant: "primary",
                size: "lg",
                className: "btn btn-primary",
                children: "Send Message",
              })}
              <div id="contact-spinner" class={`htmx-indicator`}>
                <span class={classes.textMuted}>Sending...</span>
              </div>
            </div>
          </form>
        </div>

        {/* Newsletter */}
        <div class={classes.cardHero}>
          <h3 class={classes.heroTitle}>Stay Updated</h3>
          <p class={classes.lead}>
            Get the latest news and updates delivered to your inbox.
          </p>
          <div id="newsletter-result" class={classes.result}></div>
          <form
            hx-post="/api/forms/newsletter"
            hx-target="#newsletter-result"
            hx-indicator="#newsletter-spinner"
            class={`${classes.row} ${classes.alignEnd}`}
          >
            {Input({
              type: "email",
              name: "email",
              placeholder: "Enter your email",
              leftAddon: "📧",
              className: classes.flex1,
              size: "lg",
              variant: "filled",
            })}
            {Button({
              type: "submit",
              variant: "primary",
              size: "lg",
              className: "btn btn-primary",
              children: "Subscribe",
            })}
            <div id="newsletter-spinner" class={`htmx-indicator`}>
              <span class={classes.textHeroMuted}>Subscribing...</span>
            </div>
          </form>
        </div>
      </div>

      {/* Badges */}
      <div class={`${classes.textCenter} ${classes.mt2}`}>
        <div class={classes.inlineRow}>
          <div class={`${classes.badge} ${classes.badgeSuccess}`}>
            ✅ Real Components
          </div>
          <div class={`${classes.badge} ${classes.badgePrimary}`}>
            🎯 Live Validation
          </div>
          <div class={`${classes.badge} ${classes.badgePurple}`}>
            ⚡ Zero Config
          </div>
        </div>
      </div>
    </div>
  ),
});
