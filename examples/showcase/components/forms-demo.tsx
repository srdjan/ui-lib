/** @jsx h */
import { defineComponent, h } from "../../../index.ts";
import { Button, Input, Alert, getOpenPropsIntegrationStyles } from "../utilities/open-props-component-adapter.ts";

/**
 * Forms Demo Component
 * Showcase beautiful forms using Open Props design system
 * Features registration, contact, and newsletter forms with validation
 */
defineComponent("showcase-forms-demo", {
  render: () => (
      <div style="max-width: 1200px; margin: 0 auto; padding: var(--size-fluid-4); display: grid; gap: var(--size-fluid-4);">
        
        {/* User Registration Form */}
        <div class="forms-card">
          <h3 class="forms-card-title">👤 User Registration</h3>
          <div id="registration-result" class="forms-result"></div>
          <form
            hx-post="/api/forms/register"
            hx-target="#registration-result"
            hx-indicator="#reg-spinner"
            class="forms-form"
          >
            <div class="forms-grid-2">
              <div dangerouslySetInnerHTML={{__html: Input({
                type: "text",
                id: "firstName",
                name: "firstName",
                label: "First Name",
                placeholder: "John",
                required: true,
                variant: "filled",
                size: "lg"
              })}} />
              <div dangerouslySetInnerHTML={{__html: Input({
                type: "text",
                id: "lastName", 
                name: "lastName",
                label: "Last Name",
                placeholder: "Doe", 
                required: true,
                variant: "filled",
                size: "lg"
              }))}} />
            </div>
            
            <div dangerouslySetInnerHTML={{__html: Input({
              type: "email",
              id: "email",
              name: "email", 
              label: "Email Address",
              placeholder: "john@example.com",
              required: true,
              helpText: "We'll never share your email",
              variant: "filled",
              size: "lg"
            }))}} />
            
            <div dangerouslySetInnerHTML={{__html: Input({
              type: "password",
              id: "password",
              name: "password",
              label: "Password",
              placeholder: "Choose a strong password",
              required: true,
              helpText: "At least 8 characters", 
              variant: "filled",
              size: "lg"
            }))}} />
            
            <div dangerouslySetInnerHTML={{__html: Alert({
              variant: "info",
              children: "ℹ️ All fields are validated in real-time"
            }))}} />
            
            <div class="forms-actions">
              <div dangerouslySetInnerHTML={{__html: Button({
                type: "submit",
                variant: "primary",
                size: "lg",
                children: "Create Account"
              }))}} />
              <div dangerouslySetInnerHTML={{__html: Button({
                type: "button", 
                variant: "outline",
                size: "lg",
                children: "Cancel"
              }))}} />
              <div id="reg-spinner" class="htmx-indicator forms-spinner">
                Processing...
              </div>
            </div>
          </form>
        </div>

        {/* Contact Form */}
        <div class="forms-card">
          <h3 class="forms-card-title">📞 Contact Us</h3>
          <div id="contact-result" class="forms-result"></div>
          <form
            hx-post="/api/forms/contact"
            hx-target="#contact-result"
            hx-indicator="#contact-spinner"
            class="forms-form"
          >
            <div class="forms-grid-2">
              <div dangerouslySetInnerHTML={{__html: Input({
                type: "text",
                id: "contactName",
                name: "name",
                label: "Full Name",
                required: true,
                variant: "filled",
                size: "lg"
              }))}} />
              <div dangerouslySetInnerHTML={{__html: Input({
                type: "email",
                id: "contactEmail", 
                name: "email",
                label: "Email",
                required: true,
                variant: "filled", 
                size: "lg"
              }))}} />
            </div>
            
            <div dangerouslySetInnerHTML={{__html: Input({
              type: "tel",
              id: "phone",
              name: "phone",
              label: "Phone Number",
              placeholder: "(555) 123-4567",
              variant: "filled",
              size: "lg"
            }))}} />
            
            <div dangerouslySetInnerHTML={{__html: Input({
              type: "textarea",
              id: "message",
              name: "message",
              label: "Message",
              placeholder: "Tell us about your project...",
              rows: 4,
              required: true,
              variant: "filled",
              size: "lg"
            }))}} />
            
            <div class="forms-actions">
              <div dangerouslySetInnerHTML={{__html: Button({
                type: "submit",
                variant: "primary",
                size: "lg", 
                children: "Send Message"
              }))}} />
              <div id="contact-spinner" class="htmx-indicator forms-spinner">
                Sending...
              </div>
            </div>
          </form>
        </div>

        {/* Newsletter Signup */}
        <div class="forms-card forms-card-hero">
          <h3 class="forms-hero-title">📧 Stay Updated</h3>
          <p class="forms-hero-subtitle">
            Get the latest news and updates delivered to your inbox.
          </p>
          <div id="newsletter-result" class="forms-result"></div>
          <form
            hx-post="/api/forms/newsletter"
            hx-target="#newsletter-result"
            hx-indicator="#newsletter-spinner"
            class="forms-newsletter-form"
          >
            <div class="forms-field">
              <label for="newsletterEmail" class="forms-label forms-label-light">Email Address</label>
              <div class="forms-newsletter-row">
                <div dangerouslySetInnerHTML={{__html: Input({
                  type: "email",
                  id: "newsletterEmail",
                  name: "email",
                  placeholder: "Enter your email",
                  required: true,
                  variant: "filled",
                  size: "lg"
                }))}} />
                <div dangerouslySetInnerHTML={{__html: Button({
                  type: "submit",
                  variant: "primary",
                  size: "lg",
                  children: "Subscribe"
                }))}} />
              </div>
            </div>
            <div id="newsletter-spinner" class="htmx-indicator forms-spinner forms-spinner-light">
              Subscribing...
            </div>
          </form>
        </div>

        {/* Feature Badges */}
        <div class="forms-badges">
          <div class="forms-badge forms-badge-success">
            ✅ Real Components
          </div>
          <div class="forms-badge forms-badge-primary">
            🎯 Live Validation
          </div>
          <div class="forms-badge forms-badge-purple">
            ⚡ Zero Config
          </div>
        </div>
        
        <div dangerouslySetInnerHTML={{__html: getOpenPropsIntegrationStyles()}} />
        
        <style dangerouslySetInnerHTML={{
          __html: `
          .forms-card {
            background: var(--surface-1);
            border: 1px solid var(--surface-3);
            border-radius: var(--radius-3);
            padding: var(--size-fluid-4);
            box-shadow: var(--shadow-2);
            transition: box-shadow var(--animation-fade-in);
          }
          .forms-card:hover {
            box-shadow: var(--shadow-3);
          }
          .forms-card-hero {
            background: var(--gradient-3);
            color: var(--gray-0);
            border: none;
          }
          .forms-card-title {
            font-size: var(--font-size-3);
            font-weight: var(--font-weight-6);
            margin-bottom: var(--size-3);
            color: var(--text-1);
          }
          .forms-hero-title {
            font-size: var(--font-size-4);
            font-weight: var(--font-weight-7);
            margin: 0 0 var(--size-2) 0;
            color: var(--gray-0);
          }
          .forms-hero-subtitle {
            margin-bottom: var(--size-4);
            opacity: 0.9;
            color: var(--gray-1);
          }
          .forms-form {
            display: flex;
            flex-direction: column;
            gap: var(--size-3);
          }
          .forms-newsletter-form {
            display: flex;
            flex-direction: column;
            gap: var(--size-2);
          }
          .forms-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--size-3);
          }
          .forms-field {
            display: flex;
            flex-direction: column;
            gap: var(--size-1);
          }
          .forms-label {
            font-size: var(--font-size-1);
            font-weight: var(--font-weight-5);
            color: var(--text-1);
          }
          .forms-label-light {
            color: var(--gray-0);
          }
          .forms-input, .forms-textarea {
            padding: var(--size-3);
            border: 1px solid var(--surface-3);
            border-radius: var(--radius-2);
            font-size: var(--font-size-1);
            background: var(--surface-1);
            color: var(--text-1);
            transition: all var(--animation-fade-in);
          }
          .forms-input:focus, .forms-textarea:focus {
            outline: none;
            border-color: var(--blue-6);
            box-shadow: 0 0 0 2px var(--blue-2);
          }
          .forms-input-light {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.3);
            color: var(--gray-0);
          }
          .forms-input-light::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
          .forms-input-light:focus {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
          }
          .forms-help {
            font-size: var(--font-size-0);
            color: var(--text-2);
          }
          .forms-alert {
            display: flex;
            align-items: center;
            gap: var(--size-2);
            padding: var(--size-2) var(--size-3);
            background: var(--blue-1);
            border: 1px solid var(--blue-3);
            border-radius: var(--radius-2);
            font-size: var(--font-size-1);
            color: var(--blue-7);
          }
          .forms-actions {
            display: flex;
            gap: var(--size-2);
            align-items: center;
            margin-top: var(--size-2);
          }
          .forms-newsletter-row {
            display: flex;
            gap: var(--size-2);
            align-items: end;
          }
          .forms-newsletter-row .forms-input {
            flex: 1;
          }
          .forms-btn {
            padding: var(--size-3) var(--size-4);
            border-radius: var(--radius-2);
            font-size: var(--font-size-1);
            font-weight: var(--font-weight-5);
            cursor: pointer;
            transition: all var(--animation-fade-in);
            border: none;
          }
          .forms-btn-primary {
            background: var(--blue-6);
            color: var(--gray-0);
          }
          .forms-btn-primary:hover {
            background: var(--blue-7);
            transform: translateY(-1px);
            box-shadow: var(--shadow-3);
          }
          .forms-btn-outline {
            background: transparent;
            border: 1px solid var(--surface-3);
            color: var(--text-1);
          }
          .forms-btn-outline:hover {
            background: var(--surface-2);
          }
          .forms-btn-light {
            background: rgba(255, 255, 255, 0.2);
            color: var(--gray-0);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .forms-btn-light:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          .forms-result {
            margin-bottom: var(--size-2);
            min-height: var(--size-4);
          }
          .forms-spinner {
            font-size: var(--font-size-0);
            color: var(--text-2);
            display: none;
          }
          .forms-spinner-light {
            color: rgba(255, 255, 255, 0.8);
          }
          .htmx-request .htmx-indicator {
            display: inline;
          }
          .forms-badges {
            display: flex;
            justify-content: center;
            gap: var(--size-3);
            flex-wrap: wrap;
            margin-top: var(--size-4);
          }
          .forms-badge {
            padding: var(--size-2) var(--size-3);
            border-radius: var(--radius-2);
            font-size: var(--font-size-0);
            font-weight: var(--font-weight-6);
            color: var(--gray-0);
          }
          .forms-badge-success {
            background: var(--green-6);
          }
          .forms-badge-primary {
            background: var(--blue-6);
          }
          .forms-badge-purple {
            background: var(--purple-6);
          }
          
          @media (max-width: 768px) {
            .forms-grid-2 {
              grid-template-columns: 1fr;
            }
            .forms-newsletter-row {
              flex-direction: column;
              align-items: stretch;
            }
          }
          `
        }} />
      </div>
  ),
});