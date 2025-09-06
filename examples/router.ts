import { Router } from "../lib/router.ts";

// Create the main router instance for component APIs
export const router = new Router();

// Form submission endpoints for interactive examples
router.register("POST", "/api/forms/register", async (request) => {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    // Simulate validation
    if (!firstName || !lastName || !email || !password) {
      return new Response(
        `
        <div class="alert alert-error">
          ❌ Please fill in all required fields.
        </div>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    if (!email.includes("@")) {
      return new Response(
        `
        <div class="alert alert-error">
          ❌ Please enter a valid email address.
        </div>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    if (password.length < 8) {
      return new Response(
        `
        <div class="alert alert-error">
          ❌ Password must be at least 8 characters long.
        </div>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // Success response
    return new Response(
      `
      <div class="alert alert-success">
        ✅ Account created successfully! Welcome ${firstName} ${lastName}.
      </div>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      `
      <div class="alert alert-error">
        ❌ Registration failed. Please try again.
      </div>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  }
});

router.register("POST", "/api/forms/contact", async (request) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    // Simulate validation
    if (!name || !email || !message) {
      return new Response(
        `
        <div class="alert alert-error">
          ❌ Please fill in all required fields.
        </div>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // Success response
    return new Response(
      `
      <div class="alert alert-success">
        ✅ Thank you ${name}! We'll get back to you within 24 hours.
      </div>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      `
      <div class="alert alert-error">
        ❌ Message failed to send. Please try again.
      </div>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  }
});

router.register("POST", "/api/forms/newsletter", async (request) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString() || "";

    // Simulate validation
    if (!email || !email.includes("@")) {
      return new Response(
        `
        <div class="alert alert-error">
          ❌ Please enter a valid email address.
        </div>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // Success response
    return new Response(
      `
      <div class="alert alert-success">
        ✅ Successfully subscribed! Check your inbox for confirmation.
      </div>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return new Response(
      `
      <div class="alert alert-error">
        ❌ Subscription failed. Please try again.
      </div>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  }
});
