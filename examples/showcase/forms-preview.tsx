/** @jsx h */
import { defineComponent, h, Input, Button, Alert } from "../../index.ts";

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
      gap: 1rem;
      align-items: center;
    }`,
    alignEnd: `{
      align-items: end;
    }`,
    mt1: `{
      margin-top: 1rem;
    }`,
    mt2: `{
      margin-top: 2rem;
    }`,
    ml1: `{
      margin-left: 1rem;
    }`,
    inlineRow: `{
      display: inline-flex;
      gap: 1rem;
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
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }`,
    flex1: `{
      flex: 1;
    }`,

    // Preview panel
    panel: `{
      width: 100%;
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }`,
    panelHeader: `{
      padding: 1rem 1.5rem;
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
      gap: 0.5rem;
    }`,
    panelActions: `{
      display: flex;
      gap: 0.5rem;
    }`,
    panelAction: `{
      padding: 0.25rem 0.75rem;
      background: white;
      border: 1px solid var(--gray-300);
      border-radius: 0.375rem;
      color: var(--gray-600);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }`,
    previewContent: `{
      padding: 2rem;
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
      border-radius: 0.75rem;
      padding: 2rem;
    }`,
    cardTitle: `{
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--gray-900);
    }`,
    result: `{
      margin-bottom: 1rem;
    }`,
    formVertical: `{
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }`,
    grid2: `{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }`,

    // Hero card
    cardHero: `{
      background: linear-gradient(135deg, var(--indigo-6) 0%, var(--purple-6) 100%);
      border-radius: 0.75rem;
      padding: 2rem;
      color: white;
    }`,
    heroTitle: `{
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
    }`,

    // Badges
    badge: `{
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
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
    <div class={classes.panel}>
      {/* Header */}
      <div class={classes.panelHeader}>
        <span class={classes.panelTitle}>👁️ Live Form Components</span>
        <div class={classes.panelActions}>
          <button type="button" class={classes.panelAction} onclick="viewFormsCode()">📝 View Code</button>
          <button type="button" class={classes.panelAction} onclick="refreshPreview(this)">🔄 Refresh</button>
          <button type="button" class={classes.panelAction} onclick="toggleFullscreen(this)">⛶ Fullscreen</button>
        </div>
      </div>

      {/* Content */}
      <div class={classes.previewContent}>
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
                {Input({ type: "text", name: "firstName", label: "First Name", placeholder: "John", required: true })}
                {Input({ type: "text", name: "lastName", label: "Last Name", placeholder: "Doe", required: true })}
              </div>
              {Input({ type: "email", name: "email", label: "Email Address", placeholder: "john@example.com", required: true, helpText: "We'll never share your email" })}
              {Input({ type: "password", name: "password", label: "Password", placeholder: "Choose a strong password", required: true, helpText: "At least 8 characters" })}
              {Alert({ variant: "info", children: "All fields are validated in real-time" })}
              <div class={`${classes.row} ${classes.mt1}`}>
                {Button({ type: "submit", variant: "primary", children: "Create Account" })}
                {Button({ type: "button", variant: "outline", children: "Cancel" })}
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
                {Input({ type: "text", name: "name", label: "Full Name", required: true })}
                {Input({ type: "email", name: "email", label: "Email", required: true })}
              </div>
              {Input({ type: "tel", name: "phone", label: "Phone Number", placeholder: "(555) 123-4567" })}
              {Input({ type: "textarea", name: "message", label: "Message", placeholder: "Tell us about your project...", rows: 4, required: true })}
              <div class={classes.row}>
                {Button({ type: "submit", variant: "primary", size: "lg", children: "Send Message" })}
                <div id="contact-spinner" class={`htmx-indicator`}>
                  <span class={classes.textMuted}>Sending...</span>
                </div>
              </div>
            </form>
          </div>

          {/* Newsletter */}
          <div class={classes.cardHero}>
            <h3 class={classes.heroTitle}>Stay Updated</h3>
            <p class={classes.lead}>Get the latest news and updates delivered to your inbox.</p>
            <div id="newsletter-result" class={classes.result}></div>
            <form
              hx-post="/api/forms/newsletter"
              hx-target="#newsletter-result"
              hx-indicator="#newsletter-spinner"
              class={`${classes.row} ${classes.alignEnd}`}
            >
              {Input({ type: "email", name: "email", placeholder: "Enter your email", leftAddon: "📧", className: classes.flex1 })}
              {Button({ type: "submit", variant: "secondary", children: "Subscribe" })}
              <div id="newsletter-spinner" class={`htmx-indicator`}>
                <span class={classes.textHeroMuted}>Subscribing...</span>
              </div>
            </form>
          </div>
        </div>

        {/* Badges */}
        <div class={`${classes.textCenter} ${classes.mt2}`}>
          <div class={classes.inlineRow}>
            <div class={`${classes.badge} ${classes.badgeSuccess}`}>✅ Real Components</div>
            <div class={`${classes.badge} ${classes.badgePrimary}`}>🎯 Live Validation</div>
            <div class={`${classes.badge} ${classes.badgePurple}`}>⚡ Zero Config</div>
          </div>
        </div>
      </div>
    </div>
  ),
});

