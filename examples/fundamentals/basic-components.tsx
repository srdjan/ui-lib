/** @jsx h */
/// <reference path="../../src/lib/jsx.d.ts" />
import {
  defineComponent,
  h,
  string,
  number,
  boolean,
  renderComponent,
} from "../../src/index.ts";

/**
 * BASIC COMPONENT CREATION
 * Demonstrates the fundamentals of funcwc component definition
 */

// 1. Minimal Component - Just render function
defineComponent("hello-world", {
  render: () => (
    <div style="padding: 1rem; border: 2px solid #28a745; border-radius: 6px; text-align: center;">
      <h3>👋 Hello funcwc!</h3>
      <p>This is the simplest possible component - just a render function returning JSX</p>
    </div>
  )
});

// 2. Component with Props - Function-style props (modern approach)
defineComponent("user-card", {
  render: ({
    // Function-style props - automatically inferred from parameters
    name = string("Anonymous"),
    age = number(25),
    isActive = boolean(true),
  }) => (
    <div style="padding: 1rem; border: 1px solid #dee2e6; border-radius: 8px; margin: 1rem 0; background: #f8f9fa;">
      <h4 style="margin: 0 0 0.5rem 0; color: #495057;">
        {name} {isActive && <span style="color: #28a745;">●</span>}
      </h4>
      <p style="margin: 0; color: #6c757d;">Age: {age}</p>
      <p style="margin: 0; color: #6c757d; font-size: 0.9rem;">
        Status: {isActive ? "Active" : "Inactive"}
      </p>
    </div>
  )
});

// 3. Component with Props via function-style helpers (modern approach)
defineComponent("product-card", {
  render: ({
    title = string("Untitled Product"),
    price = number(0),
    inStock = boolean(true),
    description = string("")
  }) => (
    <div style="padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 1rem 0; color: #333;">
        {title}
        {!inStock && <span style="color: #dc3545; font-size: 0.8rem; margin-left: 0.5rem;">OUT OF STOCK</span>}
      </h3>
      {description && <p style="color: #666; margin: 0 0 1rem 0;">{description}</p>}
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 1.2rem; font-weight: bold; color: #28a745;">
          ${Number(price).toFixed(2)}
        </span>
        <button 
          style={`padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; ${
            inStock 
              ? 'background: #007bff; color: white;' 
              : 'background: #6c757d; color: white; cursor: not-allowed;'
          }`}
          disabled={!inStock}
        >
          {inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  )
});

// 4. Component with computed props using function-style defaults
defineComponent("custom-props-card", {
  render: ({ 
    firstName = string("John"),
    lastName = string("Doe"),
    score = number(0),
    tags = string(""),
  }) => {
    const fullName = `${firstName} ${lastName}`;
    const clampedScore = Math.max(0, Math.min(100, Number(score)));
    const parsedTags = String(tags).split(",").map((t) => t.trim()).filter(Boolean);
    const timestamp = new Date().toISOString();
    return (
    <div style="padding: 1rem; border: 2px solid #17a2b8; border-radius: 8px; background: #e1f7fa;">
      <h4 style="margin: 0 0 1rem 0; color: #0c5460;">{fullName}</h4>
      <div style="margin-bottom: 1rem;">
        <strong>Score:</strong> {score}/100
        <div 
          style={`height: 8px; background: #dee2e6; border-radius: 4px; overflow: hidden; margin-top: 0.25rem;`}
        >
          <div 
            style={`height: 100%; background: ${clampedScore >= 70 ? '#28a745' : clampedScore >= 40 ? '#ffc107' : '#dc3545'}; width: ${clampedScore}%; transition: all 0.3s ease;`}
          ></div>
        </div>
      </div>
      {parsedTags.length > 0 && (
        <div>
          <strong>Tags:</strong>
          <div style="margin-top: 0.5rem;">
            {parsedTags.map(tag => (
              <span style="display: inline-block; background: #007bff; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin-right: 0.5rem;">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      <small style="color: #6c757d; display: block; margin-top: 1rem;">
        Created: {timestamp}
      </small>
    </div>
    );
  }
});

// 5. Component demonstrating JSX vs HTML output comparison
defineComponent("jsx-demo", {
  render: ({ content = string("Demo content") }) => {
    // This JSX gets converted to an HTML string by the custom JSX runtime
    const jsxOutput = (
      <div style="border: 1px solid #6f42c1; padding: 1rem; border-radius: 6px;">
        <h4 style="color: #6f42c1; margin-top: 0;">JSX Input</h4>
        <p>{content}</p>
        <button style="background: #6f42c1; color: white; border: none; padding: 0.5rem; border-radius: 4px;">
          Click me
        </button>
      </div>
    );

    // The rendered output will be an HTML string that can be displayed
    return (
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
        <div>
          <h5 style="margin: 0 0 0.5rem 0; color: #495057;">JSX Code:</h5>
          <pre style="background: #f8f9fa; padding: 1rem; border-radius: 4px; font-size: 0.8rem; overflow-x: auto; color: #495057;">
{`<div style="border: 1px solid #6f42c1; padding: 1rem;">
  <h4 style="color: #6f42c1;">JSX Input</h4>
  <p>{content}</p>
  <button style="background: #6f42c1; color: white;">
    Click me
  </button>
</div>`}
          </pre>
        </div>
        <div>
          <h5 style="margin: 0 0 0.5rem 0; color: #495057;">Rendered Output:</h5>
          {jsxOutput}
        </div>
      </div>
    );
  }
});

// 6. Showcase Component - Demonstrates renderComponent utility
defineComponent("component-showcase", {
  render: () => {
    // Using renderComponent to render other components programmatically
    const helloWorldHtml = renderComponent("hello-world");
    const userCardHtml = renderComponent("user-card", { 
      name: "Alice Johnson", 
      age: 28, 
      isActive: true 
    });
    const productCardHtml = renderComponent("product-card", {
      title: "Awesome Widget",
      price: 29.99,
      inStock: true,
      description: "A fantastic widget that does amazing things!"
    });

    return (
      <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 2rem; margin: 2rem 0;">
        <h3 style="margin: 0 0 1.5rem 0; color: #856404;">🎨 Component Showcase</h3>
        <p style="color: #856404; margin-bottom: 2rem;">
          These components were rendered programmatically using <code>renderComponent()</code>:
        </p>
        
        <div style="margin-bottom: 2rem;">
          <h4 style="color: #856404;">Hello World Component:</h4>
          <div dangerouslySetInnerHTML={{ __html: helloWorldHtml }}></div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h4 style="color: #856404;">User Card Component:</h4>
          <div dangerouslySetInnerHTML={{ __html: userCardHtml }}></div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h4 style="color: #856404;">Product Card Component:</h4>
          <div dangerouslySetInnerHTML={{ __html: productCardHtml }}></div>
        </div>
      </div>
    );
  }
});

console.log("✅ Basic Components examples loaded - 6 components demonstrating core funcwc patterns");
