/**
 * Example demonstrating the new declarative bindings feature in ui-lib
 * 
 * Declarative bindings provide a simple, HTML-attribute-based approach
 * to reactivity that processes at SSR time for maximum performance.
 */

import { defineComponent, h } from "../mod.ts";
import { bindText, bindClass, bindValue, emitOn, showIf } from "../mod.ts";

// Example 1: Basic text binding
defineComponent("greeting-card", {
  render: () => 
    h("div", { class: "card" }, [
      h("h2", { "data-bind-text": "greeting" }, "Hello World"),
      h("p", { "data-bind-text": "message" }, "Welcome to ui-lib")
    ])
});

// Example 2: Form with two-way value binding
defineComponent("contact-form", {
  render: () =>
    h("form", {}, [
      h("input", {
        type: "text",
        "data-bind-value": "name",
        placeholder: "Your name"
      }),
      h("input", {
        type: "email", 
        "data-bind-value": "email",
        placeholder: "Your email"
      }),
      h("button", {
        "data-emit": "submit-form",
        "data-emit-value": '{"form": "contact"}'
      }, "Submit")
    ])
});

// Example 3: Conditional visibility
defineComponent("notification-banner", {
  render: () =>
    h("div", { "data-show-if": "showNotification" }, [
      h("div", { class: "alert" }, [
        h("span", { "data-bind-text": "notificationMessage" }, "Alert!"),
        h("button", { "data-emit": "close-notification" }, "×")
      ])
    ])
});

// Example 4: Theme switcher with class binding
defineComponent("theme-toggle", {
  render: () =>
    h("div", { "data-bind-class": "theme" }, [
      h("button", {
        "data-emit": "toggle-theme",
        "data-bind-style": "backgroundColor:buttonColor"
      }, "Toggle Theme")
    ])
});

// Example 5: Using helper functions for cleaner code
defineComponent("user-profile", {
  render: () => {
    // Helper functions make the bindings more readable
    const nameBinding = bindText("userName");
    const emailBinding = bindText("userEmail");
    const avatarBinding = bindClass("avatarStyle");
    const editButton = emitOn("edit-profile");
    const adminSection = showIf("isAdmin");
    
    return h("div", { class: "profile" }, [
      h("div", { class: "avatar", [avatarBinding]: "" }),
      h("h3", { [nameBinding]: "" }, "User Name"),
      h("p", { [emailBinding]: "" }, "user@example.com"),
      h("button", { [editButton]: "" }, "Edit Profile"),
      h("div", { [adminSection]: "" }, "Admin Controls")
    ]);
  }
});

// Example 6: Event listening
defineComponent("event-listener", {
  render: () =>
    h("div", { "data-listen": "user:login:handleUserLogin()" }, [
      h("p", {}, "Waiting for login event..."),
      h("div", { "data-listen": "app:error:showError()" }, "Error display area")
    ])
});

// Example 7: Complex interactive component
defineComponent("shopping-cart", {
  render: () =>
    h("div", { class: "cart" }, [
      // Cart header with item count
      h("header", {}, [
        h("h2", {}, "Shopping Cart"),
        h("span", { "data-bind-text": "cartCount" }, "0"),
        h("span", {}, " items")
      ]),
      
      // Cart items (shown conditionally)
      h("div", { "data-show-if": "hasItems", class: "items" }, [
        h("div", { "data-bind-text": "cartItems" }, "Loading items...")
      ]),
      
      // Empty cart message
      h("div", { "data-hide-if": "hasItems", class: "empty" }, 
        "Your cart is empty"
      ),
      
      // Cart actions
      h("footer", {}, [
        h("span", { "data-bind-text": "totalPrice" }, "$0.00"),
        h("button", {
          "data-emit": "checkout",
          "data-emit-value": '{"action": "checkout"}'
        }, "Checkout"),
        h("button", {
          "data-emit": "clear-cart"
        }, "Clear Cart")
      ])
    ])
});

// Example 8: Search with live filtering
defineComponent("search-box", {
  render: () =>
    h("div", { class: "search-container" }, [
      h("input", {
        type: "search",
        placeholder: "Search...",
        "data-bind-value": "searchQuery",
        "data-listen": "input:filterResults()"
      }),
      h("button", {
        "data-emit": "search",
        "data-hide-if": "isSearching"
      }, "Search"),
      h("div", {
        "data-show-if": "isSearching",
        class: "spinner"
      }, "Searching..."),
      h("div", {
        "data-bind-text": "searchResults",
        class: "results"
      }, "No results")
    ])
});

// Usage notes:
console.log(`
Declarative Bindings Usage:

1. Text Binding: data-bind-text="stateName"
   - Binds element's text content to state

2. Class Binding: data-bind-class="className"  
   - Binds element's CSS class to state

3. Style Binding: data-bind-style="property:stateName"
   - Binds specific CSS property to state

4. Value Binding: data-bind-value="stateName"
   - Two-way binding for form inputs

5. Event Emission: data-emit="eventName" data-emit-value='{"key":"value"}'
   - Emits custom event on click

6. Event Listening: data-listen="eventName:handler()"
   - Listens for custom events

7. Conditional Display: data-show-if="stateName" / data-hide-if="stateName"
   - Shows/hides element based on state

All bindings are processed at SSR time for optimal performance!
`);