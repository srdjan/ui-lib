/** @jsx h */
import { defineComponent, h } from "../../../index.ts";
import { Button } from "../../../lib/components/button/button.ts";
import { Input } from "../../../lib/components/input/input.ts";
import { Alert } from "../../../lib/components/feedback/alert.ts";
import { renderComponentWithStyles } from "../utilities/component-renderer.ts";

/**
 * Component Library Demo Component
 * Demonstrates all available library components with various configurations
 * Shows proper usage patterns and component composition
 */
defineComponent("showcase-library-demo", {
  render: () => {
    return (
      <div style="max-width: 1200px; margin: 0 auto; padding: var(--size-fluid-4); display: grid; gap: var(--size-fluid-4);">
        
        {/* Button Variants Demo */}
        <div class="forms-card">
          <h3 class="forms-card-title">🔘 Button Components</h3>
          <p style="margin-bottom: var(--size-3); color: var(--text-2);">
            Comprehensive button variants with different sizes and states
          </p>
          
          <div style="display: grid; gap: var(--size-3);">
            {/* Button Variants */}
            <div>
              <h4 style="margin-bottom: var(--size-2); font-size: var(--font-size-1); font-weight: var(--font-weight-6);">Variants</h4>
              <div style="display: flex; gap: var(--size-2); flex-wrap: wrap;">
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "primary",
                  children: "Primary"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "secondary", 
                  children: "Secondary"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "outline",
                  children: "Outline"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "ghost",
                  children: "Ghost"  
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "destructive",
                  children: "Destructive"
                })}} />
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h4 style="margin-bottom: var(--size-2); font-size: var(--font-size-1); font-weight: var(--font-weight-6);">Sizes</h4>
              <div style="display: flex; gap: var(--size-2); align-items: center; flex-wrap: wrap;">
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "primary",
                  size: "sm",
                  children: "Small"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "primary",
                  size: "md",
                  children: "Medium"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "primary",
                  size: "lg",
                  children: "Large"
                })}} />
              </div>
            </div>

            {/* Button States */}
            <div>
              <h4 style="margin-bottom: var(--size-2); font-size: var(--font-size-1); font-weight: var(--font-weight-6);">States</h4>
              <div style="display: flex; gap: var(--size-2); flex-wrap: wrap;">
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "primary",
                  loading: true,
                  loadingText: "Saving...",
                  children: "Save"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "outline",
                  disabled: true,
                  children: "Disabled"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "primary",
                  leftIcon: "📁",
                  children: "With Icon"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
                  variant: "outline",
                  fullWidth: true,
                  children: "Full Width"
                })}} />
              </div>
            </div>
          </div>
        </div>

        {/* Input Variants Demo */}
        <div class="forms-card">
          <h3 class="forms-card-title">📝 Input Components</h3>
          <p style="margin-bottom: var(--size-3); color: var(--text-2);">
            Versatile input components with different types and configurations
          </p>
          
          <div style="display: grid; gap: var(--size-3);">
            {/* Input Types */}
            <div>
              <h4 style="margin-bottom: var(--size-2); font-size: var(--font-size-1); font-weight: var(--font-weight-6);">Input Types</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--size-3);">
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "text",
                  label: "Text Input",
                  placeholder: "Enter text...",
                  variant: "filled"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "email",
                  label: "Email Input",
                  placeholder: "user@example.com",
                  variant: "filled"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "password",
                  label: "Password Input",
                  placeholder: "••••••••",
                  variant: "filled"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "number",
                  label: "Number Input",
                  placeholder: "123",
                  variant: "filled"
                })}} />
              </div>
            </div>

            {/* Input Variants */}
            <div>
              <h4 style="margin-bottom: var(--size-2); font-size: var(--font-size-1); font-weight: var(--font-weight-6);">Variants</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--size-3);">
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "text",
                  label: "Default",
                  placeholder: "Default variant",
                  variant: "default"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "text",
                  label: "Filled",
                  placeholder: "Filled variant", 
                  variant: "filled"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "text",
                  label: "Flushed", 
                  placeholder: "Flushed variant",
                  variant: "flushed"
                })}} />
              </div>
            </div>

            {/* Input States */}
            <div>
              <h4 style="margin-bottom: var(--size-2); font-size: var(--font-size-1); font-weight: var(--font-weight-6);">States & Features</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--size-3);">
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "text",
                  label: "With Help Text",
                  placeholder: "Enter something...",
                  helpText: "This is helpful information",
                  variant: "filled"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "text",
                  label: "With Error",
                  placeholder: "Invalid input",
                  error: true,
                  errorMessage: "This field is required",
                  variant: "filled"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "email",
                  label: "With Icon",
                  placeholder: "email@domain.com",
                  leftIcon: "✉️",
                  variant: "filled"
                })}} />
                <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
                  type: "textarea",
                  label: "Textarea",
                  placeholder: "Enter a longer message...",
                  rows: 3,
                  variant: "filled"
                })}} />
              </div>
            </div>
          </div>
        </div>

        {/* Alert Variants Demo */}
        <div class="forms-card">
          <h3 class="forms-card-title">💬 Alert Components</h3>
          <p style="margin-bottom: var(--size-3); color: var(--text-2);">
            Contextual feedback messages for different scenarios
          </p>
          
          <div style="display: grid; gap: var(--size-3);">
            <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Alert({
              variant: "info",
              children: "ℹ️ This is an informational alert with useful details"
            })}} />
            <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Alert({
              variant: "success", 
              children: "✅ Operation completed successfully!"
            })}} />
            <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Alert({
              variant: "warning",
              children: "⚠️ Please review your settings before continuing"
            })}} />
            <div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Alert({
              variant: "error",
              children: "❌ An error occurred while processing your request"
            })}} />
          </div>
        </div>

        {/* Usage Examples */}
        <div class="forms-card">
          <h3 class="forms-card-title">📋 Usage Examples</h3>
          <p style="margin-bottom: var(--size-3); color: var(--text-2);">
            Copy-paste ready code examples for using these components
          </p>
          
          <div style="background: var(--gray-11); color: var(--gray-0); padding: var(--size-3); border-radius: var(--radius-2); font-family: var(--font-mono); font-size: var(--font-size-0); line-height: 1.5;">
<pre>{`// Import components
import { Button } from "ui-lib/components/button/button.ts";
import { Input } from "ui-lib/components/input/input.ts";  
import { Alert } from "ui-lib/components/feedback/alert.ts";

// Use in your TSX
<div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Button({
  variant: "primary",
  size: "lg", 
  children: "Click me"
})}} />

<div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Input({
  type: "email",
  label: "Email Address",
  placeholder: "user@example.com",
  required: true,
  variant: "filled"
})}} />

<div dangerouslySetInnerHTML={{__html: renderComponentWithStyles(Alert({
  variant: "success",
  children: "Form submitted successfully!"
})}} />`}</pre>
          </div>
        </div>

        {/* Feature Badges */}
        <div class="forms-badges">
          <div class="forms-badge forms-badge-success">
            ✅ Type Safe
          </div>
          <div class="forms-badge forms-badge-primary">
            🎯 Zero Runtime
          </div>
          <div class="forms-badge forms-badge-purple">
            ⚡ SSR First
          </div>
        </div>

      </div>
    );
  },
});