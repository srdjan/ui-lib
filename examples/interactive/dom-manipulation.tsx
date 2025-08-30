/** @jsx h */
/// <reference path="../../src/lib/jsx.d.ts" />
import {
  defineComponent,
  h,
  string,
  boolean,
  number,
  toggleClass,
  toggleClasses,
  conditionalClass,
  dataAttrs,
  spreadAttrs,
} from "../../src/index.ts";

/**
 * DOM MANIPULATION EXAMPLES
 * Comprehensive showcase of funcwc DOM helpers and utilities
 */

// 1. Toggle Class Utilities Demo
defineComponent("toggle-class-demo", {
  styles: {
    container: { padding: '2rem', border: '2px solid #dee2e6', borderRadius: '12px', background: 'white', transition: 'all 0.3s ease' },
    containerActive: { borderColor: '#28a745', background: '#f8fff9', transform: 'scale(1.02)' },
    containerDanger: { borderColor: '#dc3545', background: '#fff5f5' },
    title: { fontSize: '1.5rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#495057', transition: 'color 0.3s ease' },
    titleActive: { color: '#28a745' },
    titleDanger: { color: '#dc3545' },
    buttonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' },
    button: { padding: '0.75rem 1rem', border: '2px solid #007bff', background: 'white', color: '#007bff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' },
    buttonHover: { background: '#007bff', color: 'white', transform: 'translateY(-1px)' }
  },
  render: ({ 
    title = string("Toggle Classes Demo")
  }: any, _api: any, classes: any) => (
    <div class={`${classes!.container} toggle-demo-container`}>
      <h3 class={`${classes!.title} toggle-demo-title`}>{title}</h3>
      <p style="color: #6c757d; margin-bottom: 1.5rem;">
        Click buttons to see different DOM manipulation utilities in action. 
        Watch how classes toggle and the component responds visually.
      </p>
      
      <div class={classes!.buttonGrid}>
        {/* Single class toggle */}
        <button
          type="button"
          class={`${classes!.button} hover:${classes!.buttonHover}`}
          onclick={`
            const container = this.closest('.toggle-demo-container');
            container.classList.toggle('${classes!.containerActive}');
          `}
        >
          🎯 Toggle Active Style
        </button>

        {/* Multiple classes toggle */}
        <button
          type="button"
          class={`${classes!.button} hover:${classes!.buttonHover}`}
          onclick={`
            const container = this.closest('.toggle-demo-container');
            container.classList.toggle('${classes!.containerActive}');
            container.classList.toggle('${classes!.containerDanger}');
          `}
        >
          🔄 Toggle Active/Danger
        </button>

        {/* Conditional class with state check */}
        <button
          type="button"
          class={`${classes!.button} hover:${classes!.buttonHover}`}
          onclick={`
            const container = this.closest('.toggle-demo-container');
            const hasActive = container.classList.contains('${classes!.containerActive}');
            if (hasActive) {
              container.classList.add('${classes!.containerDanger}');
              container.classList.remove('${classes!.containerActive}');
            } else {
              container.classList.add('${classes!.containerActive}');
              container.classList.remove('${classes!.containerDanger}');
            }
          `}
        >
          ⚖️ Swap Active/Danger
        </button>

        {/* Complex DOM manipulation */}
        <button
          type="button"
          class={`${classes!.button} hover:${classes!.buttonHover}`}
          onclick={`
            const container = this.closest('.toggle-demo-container');
            const title = container.querySelector('.toggle-demo-title');
            
            // Chain multiple operations
            container.classList.toggle('active');
            
            // Update title text based on state
            if (container.classList.contains('active')) {
              title.textContent = '✅ Active State!';
              container.classList.add('${classes!.containerActive}');
              title.classList.add('${classes!.titleActive}');
            } else {
              title.textContent = '${title}';
              container.classList.remove('${classes!.containerActive}');
              title.classList.remove('${classes!.titleActive}');
            }
          `}
        >
          🚀 Complex DOM Operations
        </button>
      </div>

      {/* Status display */}
      <div 
        style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 6px; font-family: monospace; font-size: 0.9rem; color: #495057;"
        id="class-status"
      >
        Current classes: <span id="current-classes">none</span>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          // Update class display in real-time
          const observer = new MutationObserver(() => {
            const container = document.querySelector('.toggle-demo-container');
            const statusSpan = document.getElementById('current-classes');
            if (container && statusSpan) {
              const classList = Array.from(container.classList)
                .filter(cls => !cls.startsWith('_') && cls !== 'toggle-demo-container')
                .join(', ');
              statusSpan.textContent = classList || 'none';
            }
          });
          
          const container = document.querySelector('.toggle-demo-container');
          if (container) {
            observer.observe(container, { attributes: true, attributeFilter: ['class'] });
          }
        `
      }}></script>
    </div>
  )
});

// 2. Data Attributes and Spread Utilities
defineComponent("data-attributes-demo", {
  styles: {
    card: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem', borderRadius: '12px', margin: '1rem 0', position: 'relative', overflow: 'hidden' },
    info: { background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)' },
    button: { background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', marginRight: '0.5rem', marginTop: '0.5rem', transition: 'all 0.2s ease' },
    buttonHover: { background: 'rgba(255, 255, 255, 0.3)', transform: 'translateY(-1px)' }
  },
  render: ({
    userId = string("12345"),
    userName = string("John Doe"),
    userRole = string("admin"),
    isActive = boolean(true)
  }: any, _api: any, classes: any) => {
    return (
      <div 
        class={classes!.card}
        data-user-id={userId}
        data-user-name={userName}
        data-role={userRole}
        data-active={isActive}
        data-timestamp={Date.now()}
        data-version="1.0"
        hx-get="/api/user-status"
        hx-trigger="click"
        hx-target="#user-info"
        hx-swap="innerHTML"
      >
        <h3 style="margin: 0 0 1rem 0;">🏷️ Data Attributes Demo</h3>
        <p style="opacity: 0.9; margin: 0 0 1rem 0;">
          This component demonstrates the <code>dataAttrs()</code> and <code>spreadAttrs()</code> utilities.
          Click the buttons to see dynamic data attribute manipulation.
        </p>

        <div class={classes!.info} id="user-info">
          <strong>User Info:</strong><br/>
          ID: {userId} | Name: {userName} | Role: {userRole} | Active: {isActive ? "Yes" : "No"}
        </div>

        <div style="margin-top: 1.5rem;">
          <button
            type="button"
            class={`${classes!.button} hover:${classes!.buttonHover}`}
            onclick={`
              // Update data attributes dynamically
              const card = this.closest('[data-user-id]');
              const currentRole = card.dataset.role;
              const newRole = currentRole === 'admin' ? 'user' : 'admin';
              
              card.dataset.role = newRole;
              card.dataset.timestamp = Date.now();
              
              // Update display
              const info = card.querySelector('#user-info');
              info.innerHTML = \`
                <strong>User Info (Updated):</strong><br/>
                ID: \${card.dataset.userId} | Name: \${card.dataset.userName} | 
                Role: \${newRole} | Active: \${card.dataset.active} | 
                Updated: \${new Date().toLocaleTimeString()}
              \`;
            `}
          >
            🔄 Toggle Role
          </button>

          <button
            type="button"
            class={`${classes!.button} hover:${classes!.buttonHover}`}
            onclick={`
              const card = this.closest('[data-user-id]');
              const isActive = card.dataset.active === 'true';
              
              card.dataset.active = (!isActive).toString();
              card.style.opacity = isActive ? '0.7' : '1';
              
              const info = card.querySelector('#user-info');
              info.innerHTML = \`
                <strong>Status Changed:</strong><br/>
                User is now: \${!isActive ? 'ACTIVE' : 'INACTIVE'}<br/>
                Last updated: \${new Date().toLocaleTimeString()}
              \`;
            `}
          >
            ⚡ Toggle Status  
          </button>

          <button
            type="button"
            class={`${classes!.button} hover:${classes!.buttonHover}`}
            onclick={`
              const card = this.closest('[data-user-id]');
              const info = card.querySelector('#user-info');
              
              const attrs = Object.keys(card.dataset)
                .map(key => \`\${key}: \${card.dataset[key]}\`)
                .join('<br/>');
                
              info.innerHTML = \`
                <strong>All Data Attributes:</strong><br/>
                \${attrs}
              \`;
            `}
          >
            📋 Show All Data
          </button>
        </div>
      </div>
    );
  }
});

// 3. Event Handling and DOM Manipulation Patterns
defineComponent("event-handling-demo", {
  styles: {
    playground: `{
      background: white;
      border: 2px solid #dee2e6;
      border-radius: 12px;
      padding: 2rem;
      margin: 1rem 0;
    }`,
    eventTarget: `{
      background: #f8f9fa;
      border: 2px dashed #6c757d;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      margin: 1rem 0;
      transition: all 0.3s ease;
      cursor: pointer;
    }`,
    eventTargetActive: `{
      background: #e3f2fd;
      border-color: #2196f3;
      color: #1976d2;
      transform: scale(1.05);
    }`,
    eventTargetHover: `{
      background: #e9ecef;
      border-color: #495057;
    }`,
    controlPanel: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #dee2e6;
    }`,
    controlButton: `{
      padding: 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }`,
    controlButtonSecondary: `{
      background: #6c757d;
    }`,
    controlButtonSuccess: `{
      background: #28a745;
    }`,
    controlButtonWarning: `{
      background: #ffc107;
      color: #212529;
    }`
  },
  render: ({ targetText = string("Click me or use controls below!") }: any, _api: any, classes: any) => (
    <div class={classes!.playground}>
      <h3 style="margin: 0 0 1rem 0; color: #495057;">🎮 Event Handling Playground</h3>
      <p style="color: #6c757d; margin-bottom: 1.5rem;">
        Interactive demo showing various DOM manipulation patterns with event handling.
      </p>

      {/* Interactive Target Element */}
      <div
        class={`${classes!.eventTarget} demo-target hover:${classes!.eventTargetHover}`}
        id="event-target"
        onclick={`
          const target = this;
          const isActive = target.classList.contains('${classes!.eventTargetActive}');
          
          if (isActive) {
            target.classList.remove('${classes!.eventTargetActive}');
            target.textContent = '${targetText}';
          } else {
            target.classList.add('${classes!.eventTargetActive}');
            target.textContent = '✨ Activated! Click again to reset.';
          }
          
          // Log event
          const log = document.getElementById('event-log');
          if (log) {
            const time = new Date().toLocaleTimeString();
            log.innerHTML += \`<div>\${time}: Target \${isActive ? 'deactivated' : 'activated'}</div>\`;
            log.scrollTop = log.scrollHeight;
          }
        `}
        onmouseover={`
          if (!this.classList.contains('${classes!.eventTargetActive}')) {
            this.style.background = '#e9ecef';
            this.style.borderColor = '#495057';
          }
        `}
        onmouseout={`
          if (!this.classList.contains('${classes!.eventTargetActive}')) {
            this.style.background = '#f8f9fa';
            this.style.borderColor = '#6c757d';
          }
        `}
      >
        {targetText}
      </div>

      {/* Control Panel */}
      <div class={classes!.controlPanel}>
        <button
          type="button"
          class={classes!.controlButton}
          onclick={`
            const target = document.getElementById('event-target');
            target.style.background = '#e3f2fd';
            target.style.borderColor = '#2196f3';
            target.style.color = '#1976d2';
            target.textContent = '🎨 Styled via JavaScript!';
            
            setTimeout(() => {
              target.style.background = '#f8f9fa';
              target.style.borderColor = '#6c757d';
              target.style.color = 'inherit';
              target.textContent = '${targetText}';
            }, 2000);
          `}
        >
          🎨 Change Style
        </button>

        <button
          type="button"
          class={`${classes!.controlButton} ${classes!.controlButtonSecondary}`}
          onclick={`
            const target = document.getElementById('event-target');
            const randomMessages = [
              '🚀 Random message #1!',
              '⭐ This is message #2!', 
              '🎯 Here\\'s message #3!',
              '💫 Random text #4!',
              '🌟 Final message #5!'
            ];
            
            target.textContent = randomMessages[Math.floor(Math.random() * randomMessages.length)];
            
            // Auto-revert after 3 seconds
            setTimeout(() => {
              target.textContent = '${targetText}';
            }, 3000);
          `}
        >
          🎲 Random Text
        </button>

        <button
          type="button"
          class={`${classes!.controlButton} ${classes!.controlButtonSuccess}`}
          onclick={`
            const target = document.getElementById('event-target');
            let count = 0;
            
            const animate = () => {
              count++;
              target.style.transform = \`rotate(\${count * 5}deg) scale(\${1 + Math.sin(count * 0.3) * 0.1})\`;
              target.textContent = \`🌀 Animation frame \${count}\`;
              
              if (count < 60) {
                requestAnimationFrame(animate);
              } else {
                target.style.transform = '';
                target.textContent = '${targetText}';
              }
            };
            
            animate();
          `}
        >
          🌀 Animate
        </button>

        <button
          type="button"
          class={`${classes!.controlButton} ${classes!.controlButtonWarning}`}
          onclick={`
            const target = document.getElementById('event-target');
            const log = document.getElementById('event-log');
            
            // Reset all states
            target.className = '${classes!.eventTarget} demo-target';
            target.style.cssText = '';
            target.textContent = '${targetText}';
            
            if (log) {
              log.innerHTML = '<div>Event log cleared - ' + new Date().toLocaleTimeString() + '</div>';
            }
          `}
        >
          🧹 Reset All
        </button>
      </div>

      {/* Event Log */}
      <div style="margin-top: 1.5rem;">
        <h4 style="margin: 0 0 0.5rem 0; color: #495057;">📋 Event Log</h4>
        <div 
          id="event-log"
          style="background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem; max-height: 150px; overflow-y: auto; border: 1px solid #444;"
        >
          <div>Event log initialized - {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  )
});

// 4. DOM Manipulation Showcase
defineComponent("dom-manipulation-showcase", {
  render: () => (
    <div style="background: #f8f9fa; padding: 2rem; border-radius: 12px;">
      <h2 style="text-align: center; color: #495057; margin: 0 0 2rem 0;">
        🎛️ DOM Manipulation Showcase
      </h2>

      <div style="display: grid; gap: 2rem;">
        <toggle-class-demo></toggle-class-demo>
        
        <data-attributes-demo 
          userId="42" 
          userName="Jane Developer" 
          userRole="admin" 
          isActive="true"
        ></data-attributes-demo>
        
        <event-handling-demo targetText="🎯 Interactive Target - Try the controls!"></event-handling-demo>
      </div>

      <div style="background: white; border-left: 4px solid #28a745; padding: 1.5rem; margin-top: 2rem; border-radius: 0 8px 8px 0;">
        <h4 style="color: #155724; margin: 0 0 1rem 0;">🛠️ DOM Manipulation Utilities</h4>
        <ul style="color: #155724; margin: 0; columns: 2; column-gap: 2rem;">
          <li><code>toggleClass(className)</code> - Toggle single CSS class</li>
          <li><code>toggleClasses([...classes])</code> - Toggle multiple CSS classes</li>
          <li><code>conditionalClass(condition, trueClass, falseClass)</code> - Conditional class assignment</li>
          <li><code>dataAttrs(object)</code> - Generate data-* attributes</li>
          <li><code>spreadAttrs(object)</code> - Spread attributes object</li>
          <li>Inline event handlers with JavaScript</li>
          <li>DOM querying and manipulation</li>
          <li>Real-time attribute updates</li>
        </ul>
      </div>
    </div>
  )
});

console.log("✅ DOM Manipulation examples loaded - 4 components demonstrating DOM utilities");
