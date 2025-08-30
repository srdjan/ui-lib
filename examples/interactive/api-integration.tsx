/** @jsx h */
/// <reference path="../../src/lib/jsx.d.ts" />
import {
  defineComponent,
  h,
  string,
  number,
  boolean,
  patch,
  get,
  post,
  del,
  renderComponent,
} from "../../src/index.ts";
import type { GeneratedApiMap } from "../../src/index.ts";

/**
 * API INTEGRATION EXAMPLES 
 * Comprehensive showcase of HTMX + JSON API patterns
 */

// 1. Simple Counter with API Updates
defineComponent("api-counter", {
  styles: {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem',
      border: '2px solid #007bff',
      borderRadius: '12px',
      background: 'white',
      boxShadow: '0 4px 12px rgba(0, 123, 255, 0.15)',
    },
    button: {
      padding: '0.75rem 1rem',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      minWidth: '3rem',
    },
    buttonHover: { background: '#0056b3', transform: 'translateY(-1px)' },
    display: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#007bff',
      minWidth: '4rem',
      textAlign: 'center',
      background: '#f8f9ff',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '2px solid #e9ecef',
    },
    reset: { background: '#6c757d', color: 'white', fontSize: '0.9rem' },
  },
  api: {
    // JSON in, HTML out - the core funcwc API pattern
    adjust: patch("/api/counter/adjust", async (req) => {
      const body = await req.json() as {
        current?: number;
        delta?: number;
        value?: number;
        step?: number;
      };
      
      const current = Number(body.current || 0);
      const delta = Number(body.delta || 0);
      const newValue = typeof body.value === "number" ? body.value : current + delta;
      const step = Number(body.step || 1);
      
      // Simulate processing time for demo
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return new Response(
        renderComponent("api-counter", { 
          currentValue: newValue, 
          step,
          lastAction: delta > 0 ? "increment" : delta < 0 ? "decrement" : "reset"
        }),
        { headers: { "content-type": "text/html; charset=utf-8" } }
      );
    })
  },
  render: ({
    currentValue = number(0),
    step = number(1),
    lastAction = string("none")
  }, api: GeneratedApiMap, classes: any) => (
    <div class={classes!.container} data-last-action={lastAction}>
      <button
        type="button"
        class={`${classes!.button} hover:${classes!.buttonHover}`}
        {
          // Sends JSON: { current: 5, delta: -1, step: 1 }
          // Receives HTML that replaces this entire component
          ...api.adjust({ current: currentValue, delta: -step, step }, {
            indicator: "#loading-counter"
          })
        }
      >
        -{step}
      </button>
      
      <div class={classes!.display} id="counter-display">
        {currentValue}
      </div>
      
      <button
        type="button"
        class={`${classes!.button} hover:${classes!.buttonHover}`}
        {
          ...api.adjust({ current: currentValue, delta: step, step }, {
            indicator: "#loading-counter"
          })
        }
      >
        +{step}
      </button>
      
      <button
        type="button"
        class={`${classes!.button} ${classes!.reset}`}
        {
          ...api.adjust({ value: 0, step }, {
            indicator: "#loading-counter"
          })
        }
      >
        Reset
      </button>
      
      <div 
        id="loading-counter" 
        class="htmx-indicator"
        style="color: #007bff; font-size: 0.9rem; font-weight: 500;"
      >
        🔄 Updating...
      </div>
    </div>
  )
});

// 2. User Profile Editor with Validation
defineComponent("user-profile-editor", {
  styles: {
    form: {
      background: 'white', padding: '2rem', borderRadius: '12px',
      border: '1px solid #dee2e6', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
    },
    field: { marginBottom: '1.5rem' },
    label: {
      display: 'block', fontWeight: '600', color: '#495057', marginBottom: '0.5rem',
    },
    input: {
      width: '100%', padding: '0.75rem', border: '2px solid #dee2e6', borderRadius: '6px',
      fontSize: '1rem', transition: 'border-color 0.2s ease',
    },
    inputFocus: {
      borderColor: '#007bff', outline: 'none', boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)',
    },
    inputError: { borderColor: '#dc3545' },
    button: {
      background: '#28a745', color: 'white', border: 'none', padding: '0.75rem 1.5rem',
      borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', width: '100%',
    },
    buttonHover: { background: '#218838', transform: 'translateY(-1px)' },
    error: { color: '#dc3545', fontSize: '0.9rem', marginTop: '0.25rem' },
    success: {
      background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '6px', border: '1px solid #c3e6cb', marginTop: '1rem',
    },
  },
  api: {
    updateProfile: patch("/api/profile/update", async (req) => {
      const data = await req.formData();
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const bio = data.get("bio") as string;
      
      // Simulate validation
      const errors: Record<string, string> = {};
      if (!name || name.length < 2) errors.name = "Name must be at least 2 characters";
      if (!email || !email.includes("@")) errors.email = "Please enter a valid email";
      if (bio && bio.length > 500) errors.bio = "Bio must be less than 500 characters";
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (Object.keys(errors).length > 0) {
        return new Response(
          renderComponent("user-profile-editor", {
            name,
            email,
            bio,
            errors: JSON.stringify(errors),
            success: "false"
          }),
          { 
            status: 400,
            headers: { "content-type": "text/html; charset=utf-8" } 
          }
        );
      }
      
      return new Response(
        renderComponent("user-profile-editor", {
          name,
          email,
          bio,
          errors: "{}",
          success: "true"
        }),
        { headers: { "content-type": "text/html; charset=utf-8" } }
      );
    }),
    
    validateField: post("/api/profile/validate", async (req) => {
      const data = await req.json() as { field: string; value: string };
      
      let error = "";
      switch (data.field) {
        case "name":
          if (!data.value || data.value.length < 2) {
            error = "Name must be at least 2 characters";
          }
          break;
        case "email":
          if (!data.value || !data.value.includes("@")) {
            error = "Please enter a valid email";
          }
          break;
        case "bio":
          if (data.value && data.value.length > 500) {
            error = "Bio must be less than 500 characters";
          }
          break;
      }
      
      return new Response(
        error ? `<span class="error">${error}</span>` : "",
        { headers: { "content-type": "text/html; charset=utf-8" } }
      );
    })
  },
  render: ({
    name = string(""),
    email = string(""),
    bio = string(""),
    errors = string("{}"),
    success = boolean(false)
  }, api: GeneratedApiMap, classes: any) => {
    const errorObj = JSON.parse(String(errors));
    
    return (
      <form 
        class={classes!.form}
        {...api.updateProfile({}, {
          indicator: "#profile-loading"
        })}
      >
        <h3 style="margin: 0 0 1.5rem 0; color: #495057;">👤 Edit Profile</h3>
        
        <div class={classes!.field}>
          <label class={classes!.label} for="profile-name">Name</label>
          <input
            type="text"
            id="profile-name"
            name="name"
            value={name}
            class={`${classes!.input} ${errorObj.name ? classes!.inputError : ""}`}
            hx-trigger="blur"
            {...api.validateField({ field: "name", value: "this.value" }, {
              target: "#name-error",
              swap: "innerHTML"
            })}
          />
          <div id="name-error">{errorObj.name && <span class={classes!.error}>{errorObj.name}</span>}</div>
        </div>
        
        <div class={classes!.field}>
          <label class={classes!.label} for="profile-email">Email</label>
          <input
            type="email"
            id="profile-email"
            name="email"
            value={email}
            class={`${classes!.input} ${errorObj.email ? classes!.inputError : ""}`}
            hx-trigger="blur"
            {...api.validateField({ field: "email", value: "this.value" }, {
              target: "#email-error",
              swap: "innerHTML"
            })}
          />
          <div id="email-error">{errorObj.email && <span class={classes!.error}>{errorObj.email}</span>}</div>
        </div>
        
        <div class={classes!.field}>
          <label class={classes!.label} for="profile-bio">Bio</label>
          <textarea
            id="profile-bio"
            name="bio"
            value={bio}
            class={`${classes!.input} ${errorObj.bio ? classes!.inputError : ""}`}
            rows="4"
            placeholder="Tell us about yourself..."
            hx-trigger="blur"
            {...api.validateField({ field: "bio", value: "this.value" }, {
              target: "#bio-error",
              swap: "innerHTML"
            })}
          ></textarea>
          <div id="bio-error">{errorObj.bio && <span class={classes!.error}>{errorObj.bio}</span>}</div>
        </div>
        
        <button
          type="submit"
          class={`${classes!.button} hover:${classes!.buttonHover}`}
        >
          Update Profile
        </button>
        
        <div 
          id="profile-loading" 
          class="htmx-indicator"
          style="text-align: center; color: #007bff; margin-top: 1rem;"
        >
          🔄 Saving profile...
        </div>
        
        {success && (
          <div class={classes!.success}>
            ✅ Profile updated successfully!
          </div>
        )}
      </form>
    );
  }
});

// 3. Dynamic Search with Autocomplete
defineComponent("search-autocomplete", {
  styles: {
    container: { position: 'relative', width: '100%', maxWidth: '400px' },
    input: {
      width: '100%', padding: '1rem', border: '2px solid #dee2e6', borderRadius: '8px', fontSize: '1rem', transition: 'all 0.2s ease',
    },
    inputFocus: { borderColor: '#007bff', boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)' },
    results: {
      position: 'absolute', top: '100%', left: '0', right: '0', background: 'white', border: '1px solid #dee2e6', borderTop: 'none', borderRadius: '0 0 8px 8px', maxHeight: '300px', overflowY: 'auto', zIndex: '1000', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    item: { padding: '1rem', borderBottom: '1px solid #f8f9fa', cursor: 'pointer', transition: 'background-color 0.2s ease' },
    itemHover: { background: '#f8f9fa' },
    itemActive: { background: '#e3f2fd', color: '#1976d2' },
    highlight: { background: '#fff176', fontWeight: '600' },
    noResults: { padding: '1rem', textAlign: 'center', color: '#6c757d', fontStyle: 'italic' },
  },
  api: {
    search: get("/api/search", async (req) => {
      const url = new URL(req.url);
      const query = url.searchParams.get("q") || "";
      
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock search results
      const allItems = [
        { id: 1, title: "JavaScript Fundamentals", category: "Programming", description: "Learn the basics of JavaScript" },
        { id: 2, title: "React Advanced Patterns", category: "Frontend", description: "Master React patterns and hooks" },
        { id: 3, title: "Node.js Backend Development", category: "Backend", description: "Build scalable server applications" },
        { id: 4, title: "Database Design Principles", category: "Database", description: "Design efficient database schemas" },
        { id: 5, title: "CSS Grid and Flexbox", category: "Styling", description: "Modern CSS layout techniques" },
        { id: 6, title: "TypeScript Best Practices", category: "Programming", description: "Write better TypeScript code" },
        { id: 7, title: "API Design Guidelines", category: "Backend", description: "Design RESTful APIs effectively" },
        { id: 8, title: "Frontend Testing Strategies", category: "Testing", description: "Test your frontend applications" }
      ];
      
      const results = query.length < 2 ? [] : allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      if (results.length === 0 && query.length >= 2) {
        return new Response(`<div class="no-results">No results found for "${query}"</div>`, {
          headers: { "content-type": "text/html; charset=utf-8" }
        });
      }
      
      const highlightQuery = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, '<span class="highlight">$1</span>');
      };
      
      const html = results.map(item => `
        <div class="item hover:item-hover" onclick="
          document.getElementById('search-input').value = '${item.title}';
          document.getElementById('search-results').innerHTML = '';
        ">
          <div style="font-weight: 600; margin-bottom: 0.25rem;">
            ${highlightQuery(item.title, query)}
          </div>
          <div style="font-size: 0.9rem; color: #6c757d;">
            ${item.category} • ${highlightQuery(item.description, query)}
          </div>
        </div>
      `).join("");
      
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    })
  },
  render: ({ placeholder = string("Search for anything...") }, api: GeneratedApiMap, classes: any) => (
    <div class={classes!.container}>
      <input
        type="text"
        id="search-input"
        class={classes!.input}
        placeholder={placeholder}
        hx-trigger="keyup changed delay:300ms"
        {...api.search({}, {
          target: "#search-results",
          swap: "innerHTML"
        })}
        hx-vals='js:{"q": this.value}'
        autocomplete="off"
      />
      <div id="search-results" class={classes!.results}></div>
    </div>
  )
});

// 4. API Integration Showcase
defineComponent("api-showcase", {
  render: () => (
    <div style="background: #f8f9fa; padding: 2rem; border-radius: 12px;">
      <h2 style="text-align: center; color: #495057; margin: 0 0 2rem 0;">
        🔗 API Integration Showcase
      </h2>
      
      <div style="display: grid; gap: 3rem;">
        {/* Counter Example */}
        <div>
          <h3 style="color: #007bff; margin: 0 0 1rem 0;">1. Counter with JSON API</h3>
          <p style="color: #6c757d; margin: 0 0 1.5rem 0;">
            Demonstrates basic HTMX + JSON integration. Click buttons send JSON payloads, 
            server responds with HTML that replaces the component.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <api-counter currentValue="0" step="1"></api-counter>
            <api-counter currentValue="100" step="5"></api-counter>
            <api-counter currentValue="1000" step="100"></api-counter>
          </div>
        </div>

        {/* Profile Editor */}
        <div>
          <h3 style="color: #28a745; margin: 0 0 1rem 0;">2. Form with Validation</h3>
          <p style="color: #6c757d; margin: 0 0 1.5rem 0;">
            Real-time validation with server-side checking. Demonstrates form handling,
            error states, and success responses.
          </p>
          <user-profile-editor 
            name="John Doe" 
            email="john@example.com" 
            bio="I love building web applications!"
          ></user-profile-editor>
        </div>

        {/* Search */}
        <div>
          <h3 style="color: #6f42c1; margin: 0 0 1rem 0;">3. Live Search with Autocomplete</h3>
          <p style="color: #6c757d; margin: 0 0 1.5rem 0;">
            Dynamic search with debounced API calls. Try typing "react", "css", or "api".
          </p>
          <search-autocomplete placeholder="Search courses, tutorials, guides..."></search-autocomplete>
        </div>
      </div>

      {/* API Patterns Explanation */}
      <div style="background: white; border-left: 4px solid #17a2b8; padding: 1.5rem; margin-top: 2rem; border-radius: 0 8px 8px 0;">
        <h4 style="color: #138496; margin: 0 0 1rem 0;">💡 Key API Integration Patterns</h4>
        <ul style="color: #495057; margin: 0;">
          <li><strong>JSON In, HTML Out:</strong> Send JSON payloads, receive HTML responses</li>
          <li><strong>Auto-generated HTMX:</strong> API routes automatically generate HTMX attributes</li>
          <li><strong>Target Flexibility:</strong> Update specific elements or entire components</li>
          <li><strong>Loading States:</strong> Built-in indicators and progress feedback</li>
          <li><strong>Error Handling:</strong> Graceful degradation and error responses</li>
          <li><strong>Real-time Validation:</strong> Immediate feedback without full form submission</li>
        </ul>
      </div>
    </div>
  )
});

console.log("✅ API Integration examples loaded - 4 components demonstrating HTMX + JSON patterns");
