/** @jsx h */
import { h, renderToString } from "https://deno.land/x/jsx@v0.1.5/mod.ts";
import { Layout } from "./components/Layout.tsx";
import { Header } from "./components/Header.tsx";
import { UserCard } from "./components/UserCard.tsx";
import { StatsComponent } from "./components/StatsComponent.tsx";
import type { User, Stats } from "./types.ts";

// Mock data
const users: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
  { id: 3, name: "Carol Wilson", email: "carol@example.com", role: "Moderator" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "User" },
];

const stats: Stats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalPosts: 5634,
};

function App() {
  return (
    <Layout title="Deno JSX Precompilation Demo">
      <Header 
        title="🦕 Deno Native JSX Demo" 
        subtitle="Server-side rendering with precompiled JSX - No React needed!"
      />
      
      <div class="card">
        <h2>🚀 Pure Deno JSX</h2>
        <p>
          This app demonstrates Deno's native JSX precompilation without any React dependencies. 
          Static JSX elements are precompiled to HTML strings at build time for optimal performance.
        </p>
        <ul>
          <li><strong>Zero dependencies:</strong> Uses Deno's built-in JSX support</li>
          <li><strong>Static elements:</strong> Precompiled to HTML strings</li>
          <li><strong>Dynamic content:</strong> Rendered at runtime when needed</li>
          <li><strong>Better performance:</strong> Reduced object creation overhead</li>
        </ul>
      </div>

      <StatsComponent stats={stats} />

      <div class="card">
        <h2>👥 User Directory</h2>
        <p>Here are our registered users:</p>
        {users.map(user => (
          <UserCard user={user} />
        ))}
      </div>

      <div class="card">
        <h2>⚙️ Configuration</h2>
        <p>Enable JSX precompilation in your <code>deno.json</code>:</p>
        <pre>{`{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "https://deno.land/x/jsx@v0.1.5"
  }
}`}</pre>
        
        <h3>Key Benefits:</h3>
        <ul>
          <li><strong>No React bundle:</strong> Smaller runtime footprint</li>
          <li><strong>Native performance:</strong> Direct HTML string generation</li>
          <li><strong>Simple setup:</strong> Just configure JSX precompilation</li>
          <li><strong>TypeScript ready:</strong> Full type support out of the box</li>
        </ul>
      </div>

      <div class="card">
        <h2>🔧 How It Works</h2>
        <p>
          When you set <code>jsx: "precompile"</code>, Deno analyzes your JSX and:
        </p>
        <ol>
          <li>Identifies static elements that don't depend on props or state</li>
          <li>Precompiles them to HTML strings at build time</li>
          <li>Leaves dynamic parts as JSX objects for runtime rendering</li>
          <li>Combines both for optimal server-side rendering performance</li>
        </ol>
      </div>
    </Layout>
  );
}

// Start the server
const port = Number(Deno.env.get("PORT") ?? "8000");
Deno.serve({ port }, async (req) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/") {
    const html = renderToString(<App />);
    
    return new Response(`<!DOCTYPE html>${html}`, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
  
  if (url.pathname === "/api/users") {
    return Response.json(users);
  }
  
  if (url.pathname === "/api/stats") {
    return Response.json(stats);
  }
  
  return new Response("Not Found", { status: 404 });
});

console.log(`🚀 Docs server on http://localhost:${port}`);
console.log("🦕 Using Deno native JSX precompile (docs only)");

