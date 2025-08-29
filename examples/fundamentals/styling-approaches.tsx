/** @jsx h */
/// <reference path="../../src/lib/jsx.d.ts" />
import {
  defineComponent,
  h,
  string,
  boolean,
} from "../../src/index.ts";

/**
 * STYLING APPROACHES IN FUNCWC
 * Comprehensive comparison of different styling methods
 */

// 1. CSS-Only Format (Modern Approach) - Auto-generated class names
defineComponent("modern-styled-card", {
  styles: {
    // ✨ CSS-only format - class names auto-generated from property names!
    container: `{
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }`,
    title: `{
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }`,
    content: `{
      line-height: 1.6;
      opacity: 0.9;
    }`,
    button: `{
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 500;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;
      margin-top: 1rem;
    }`,
    buttonHover: `{
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }`
  },
  render: ({ 
    title = string("Modern CSS-Only Card"),
    content = string("This card uses the revolutionary CSS-only format with auto-generated class names!")
  }, _api, classes) => (
    <div class={classes!.container}>
      <h3 class={classes!.title}>{title}</h3>
      <p class={classes!.content}>{content}</p>
      <button class={`${classes!.button} hover:${classes!.buttonHover}`}>
        Beautifully Styled
      </button>
    </div>
  )
});

// 2. Traditional Classes Approach (Legacy Support)
defineComponent("traditional-styled-card", {
  classes: {
    container: "traditional-card",
    title: "traditional-title", 
    content: "traditional-content",
    button: "traditional-button"
  },
  styles: `
    .traditional-card {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .traditional-title {
      color: #495057;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
    }
    
    .traditional-content {
      color: #6c757d;
      line-height: 1.5;
    }
    
    .traditional-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
    
    .traditional-button:hover {
      background: #0056b3;
    }
  `,
  render: ({ 
    title = string("Traditional Classes Card"),
    content = string("This card uses traditional CSS classes and selectors.")
  }, _api, classes) => (
    <div class={classes!.container}>
      <h3 class={classes!.title}>{title}</h3>
      <p class={classes!.content}>{content}</p>
      <button class={classes!.button}>
        Traditionally Styled
      </button>
    </div>
  )
});

// 3. Inline Styles (Basic Approach)
defineComponent("inline-styled-card", {
  render: ({ 
    title = string("Inline Styles Card"),
    content = string("This card uses inline styles - simple but not reusable.")
  }) => (
    <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);">
      <h3 style="color: #856404; font-size: 1.25rem; margin: 0 0 1rem 0; font-weight: 600;">
        {title}
      </h3>
      <p style="color: #856404; line-height: 1.5; margin: 0 0 1rem 0;">
        {content}
      </p>
      <button style="background: #ffc107; color: #212529; border: 1px solid #ffc107; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 500;">
        Inline Styled
      </button>
    </div>
  )
});

// 4. Complex CSS-Only Format with State-based Styling
defineComponent("stateful-styled-card", {
  styles: {
    card: `{
      background: var(--card-bg, white);
      border: 2px solid var(--card-border, #dee2e6);
      padding: 1.5rem;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      user-select: none;
      position: relative;
      overflow: hidden;
    }`,
    cardActive: `{
      --card-bg: #e3f2fd;
      --card-border: #2196f3;
      transform: scale(1.02);
      box-shadow: 0 8px 24px rgba(33, 150, 243, 0.2);
    }`,
    cardDisabled: `{
      --card-bg: #f5f5f5;
      --card-border: #bdbdbd;
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }`,
    title: `{
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--title-color, #424242);
      transition: color 0.3s ease;
    }`,
    status: `{
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }`,
    statusActive: `{
      background: #e8f5e8;
      color: #2e7d32;
    }`,
    statusInactive: `{
      background: #ffebee;
      color: #c62828;
    }`,
    ripple: `{
      position: absolute;
      border-radius: 50%;
      background: rgba(33, 150, 243, 0.3);
      transform: scale(0);
      animation: ripple-effect 0.6s linear;
      pointer-events: none;
    }`
  },
  render: ({ 
    title = string("Interactive Styled Card"),
    isActive = boolean(true),
    isDisabled = boolean(false)
  }, _api, classes) => {
    const cardClass = [
      classes!.card,
      isActive && !isDisabled ? classes!.cardActive : "",
      isDisabled ? classes!.cardDisabled : ""
    ].filter(Boolean).join(" ");

    const statusClass = [
      classes!.status,
      isActive ? classes!.statusActive : classes!.statusInactive
    ].join(" ");

    return (
      <div 
        class={cardClass}
        onclick={isDisabled ? "" : `
          // Add ripple effect
          const rect = this.getBoundingClientRect();
          const ripple = document.createElement('span');
          const size = Math.max(rect.width, rect.height);
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;
          
          ripple.className = '${classes!.ripple}';
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';
          
          this.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        `}
      >
        <h3 class={classes!.title}>{title}</h3>
        <span class={statusClass}>
          {isActive ? "Active" : "Inactive"}
        </span>
        <p style="margin: 1rem 0 0 0; color: #666;">
          {isDisabled 
            ? "This card is disabled" 
            : "Click me to see the ripple effect!"
          }
        </p>
      </div>
    );
  }
});

// 5. Advanced CSS-Only Format with CSS Grid and Flexbox
defineComponent("layout-demo-card", {
  styles: {
    container: `{
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }`,
    imageSection: `{
      background: linear-gradient(45deg, #ff6b6b, #feca57);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      position: relative;
    }`,
    contentSection: `{
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }`,
    header: `{
      margin-bottom: 1rem;
    }`,
    title: `{
      font-size: 1.8rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }`,
    subtitle: `{
      color: #7f8c8d;
      font-size: 1rem;
      margin: 0;
    }`,
    features: `{
      list-style: none;
      padding: 0;
      margin: 1.5rem 0;
    }`,
    feature: `{
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      color: #34495e;
    }`,
    icon: `{
      width: 20px;
      height: 20px;
      background: #27ae60;
      border-radius: 50%;
      margin-right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.8rem;
      font-weight: bold;
    }`,
    footer: `{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
    }`,
    price: `{
      font-size: 1.5rem;
      font-weight: 700;
      color: #27ae60;
    }`,
    button: `{
      background: linear-gradient(45deg, #3498db, #2980b9);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }`,
    buttonHover: `{
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
    }`
  },
  render: ({ 
    title = string("Premium Layout Demo"),
    subtitle = string("Advanced CSS Grid & Flexbox showcase"),
    price = string("$29.99")
  }, _api, classes) => (
    <div class={classes!.container}>
      <div class={classes!.imageSection}>
        <div style="font-size: 4rem; opacity: 0.8;">🎨</div>
      </div>
      <div class={classes!.contentSection}>
        <div class={classes!.header}>
          <h3 class={classes!.title}>{title}</h3>
          <p class={classes!.subtitle}>{subtitle}</p>
        </div>
        
        <ul class={classes!.features}>
          <li class={classes!.feature}>
            <span class={classes!.icon}>✓</span>
            CSS Grid Layout System
          </li>
          <li class={classes!.feature}>
            <span class={classes!.icon}>✓</span>
            Flexbox Components
          </li>
          <li class={classes!.feature}>
            <span class={classes!.icon}>✓</span>
            Responsive Design
          </li>
          <li class={classes!.feature}>
            <span class={classes!.icon}>✓</span>
            Modern CSS Features
          </li>
        </ul>

        <div class={classes!.footer}>
          <span class={classes!.price}>{price}</span>
          <button class={`${classes!.button} hover:${classes!.buttonHover}`}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
});

// 6. Style Comparison Component
defineComponent("style-comparison-showcase", {
  render: () => (
    <div style="background: #f8f9fa; padding: 2rem; border-radius: 12px; margin: 2rem 0;">
      <h2 style="text-align: center; color: #495057; margin: 0 0 2rem 0;">
        🎨 Styling Approaches Comparison
      </h2>
      
      <div style="display: grid; gap: 2rem; margin-bottom: 2rem;">
        <modern-styled-card></modern-styled-card>
        <traditional-styled-card></traditional-styled-card>
        <inline-styled-card></inline-styled-card>
      </div>

      <h3 style="color: #495057; margin: 2rem 0 1rem 0;">Advanced Styling Examples:</h3>
      
      <div style="display: grid; gap: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <stateful-styled-card isActive="true" isDisabled="false"></stateful-styled-card>
          <stateful-styled-card isActive="false" isDisabled="false"></stateful-styled-card>
          <stateful-styled-card isActive="true" isDisabled="true"></stateful-styled-card>
        </div>
        
        <layout-demo-card></layout-demo-card>
      </div>

      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-top: 2rem; border-left: 4px solid #28a745;">
        <h4 style="color: #155724; margin: 0 0 1rem 0;">💡 Key Takeaways</h4>
        <ul style="color: #155724; margin: 0;">
          <li><strong>CSS-Only Format:</strong> Auto-generated class names, no duplication, type-safe</li>
          <li><strong>Traditional Classes:</strong> Full CSS control, familiar syntax, explicit names</li>
          <li><strong>Inline Styles:</strong> Quick prototyping, component-scoped, no reusability</li>
          <li><strong>Advanced Patterns:</strong> State-based styling, animations, modern CSS features</li>
        </ul>
      </div>
    </div>
  )
});

console.log("✅ Styling Approaches examples loaded - 6 components demonstrating different styling methods");