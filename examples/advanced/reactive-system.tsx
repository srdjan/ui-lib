/** @jsx h */
import { defineComponent, h, boolean, string, number, object } from "../../src/index.ts";

// Advanced Reactive System Components demonstrating the Hybrid Reactivity System

console.log("🚀 Loading Advanced Reactive System examples..."); 

// 1. CSS Property Reactivity - Theme Controller with Global State
defineComponent("advanced-theme-controller", {
  styles: {
    container: {
      padding: '1.5rem', background: 'var(--theme-bg, #ffffff)', color: 'var(--theme-text, #000000)', border: '2px solid var(--theme-border, #e2e8f0)', borderRadius: '12px', transition: 'all 0.3s ease',
    },
    button: {
      padding: '0.75rem 1.5rem', background: 'var(--theme-primary, #3b82f6)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease',
    },
    status: { marginTop: '1rem', padding: '0.5rem', background: 'var(--theme-secondary, #f1f5f9)', borderRadius: '6px', fontSize: '0.9rem' }
  },
  cssReactions: {
    // React to theme changes by updating CSS custom properties
    "theme": `
      if (value === 'dark') {
        document.documentElement.style.setProperty('--theme-bg', '#1e293b');
        document.documentElement.style.setProperty('--theme-text', '#f1f5f9');
        document.documentElement.style.setProperty('--theme-border', '#374151');
        document.documentElement.style.setProperty('--theme-primary', '#6366f1');
        document.documentElement.style.setProperty('--theme-secondary', '#374151');
      } else {
        document.documentElement.style.setProperty('--theme-bg', '#ffffff');
        document.documentElement.style.setProperty('--theme-text', '#000000');
        document.documentElement.style.setProperty('--theme-border', '#e2e8f0');
        document.documentElement.style.setProperty('--theme-primary', '#3b82f6');
        document.documentElement.style.setProperty('--theme-secondary', '#f1f5f9');
      }
    `
  },
  render: ({ currentTheme = string("light") }: any, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h3', {}, '🎨 Global Theme Controller'),
      h('p', {}, 'Controls theme for all reactive components using CSS custom properties.'),
      h('button', { 
        class: classes!.button,
        onclick: `
          const newTheme = '${currentTheme}' === 'light' ? 'dark' : 'light';
          window.StateManager?.publish('theme', newTheme);
          this.closest('[data-theme]').setAttribute('data-theme', newTheme);
        `,
        'data-theme': currentTheme
      }, `Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Theme`),
      h('div', { class: classes!.status },
        `Current theme: ${currentTheme}`
      )
    )
  )
} as any);

// 2. Reactive Cards that respond to theme changes
defineComponent("advanced-reactive-card", {
  styles: {
    card: {
      padding: '1.5rem', background: 'var(--theme-bg, #ffffff)', color: 'var(--theme-text, #000000)', border: '1px solid var(--theme-border, #e2e8f0)', borderRadius: '8px', margin: '1rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s ease',
    },
    badge: { display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--theme-primary, #3b82f6)', color: 'white', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }
  },
  cssReactions: {
    "theme": `
      // Card reacts to global theme changes
      const card = this.querySelector('.card');
      if (card) {
        card.classList.toggle('dark-theme', value === 'dark');
      }
    `
  },
  render: ({ title = string("Reactive Card"), content = string("This card responds to theme changes automatically!") }: any, api: any, classes: any) => (
    h('div', { class: classes!.card },
      h('h4', {}, title, ' ', h('span', { class: classes!.badge }, 'Reactive')),
      h('p', {}, content)
    )
  )
} as any);

// 3. Pub/Sub State Management - Counter Network
defineComponent("pub-sub-counter", {
  styles: {
    container: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'var(--theme-bg, #ffffff)', border: '2px solid var(--theme-border, #e2e8f0)', borderRadius: '10px', margin: '1rem 0' },
    button: { padding: '0.5rem 1rem', background: 'var(--theme-primary, #3b82f6)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
    display: { fontSize: '1.5rem', fontWeight: 'bold', minWidth: '3rem', textAlign: 'center', color: 'var(--theme-primary, #3b82f6)' },
    label: { fontWeight: '500', color: 'var(--theme-text, #000000)' }
  },
  stateSubscriptions: {
    // Subscribe to global counter network state
    "counter-network": `
      const display = this.querySelector('.display');
      if (display && typeof value === 'number') {
        display.textContent = value.toString();
        
        // Visual feedback for changes
        display.style.transform = 'scale(1.2)';
        setTimeout(() => {
          display.style.transform = 'scale(1)';
        }, 150);
      }
    `
  },
  onMount: `
    // Initialize with current network state
    const currentValue = window.StateManager?.getState('counter-network') || 0;
    const display = this.querySelector('.display');
    if (display) display.textContent = currentValue.toString();
  `,
  render: ({ 
    counterName = string("Counter A"), 
    initialValue = number(0),
    step = number(1)
  }: any, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('span', { class: classes!.label }, counterName + ':'),
      h('button', { 
        class: classes!.button,
        onclick: `
          const current = window.StateManager?.getState('counter-network') || 0;
          window.StateManager?.publish('counter-network', current - ${step});
        `
      }, `-${step}`),
      h('span', { class: classes!.display }, initialValue.toString()),
      h('button', { 
        class: classes!.button,
        onclick: `
          const current = window.StateManager?.getState('counter-network') || 0;
          window.StateManager?.publish('counter-network', current + ${step});
        `
      }, `+${step}`)
    )
  )
} as any);

// 4. DOM Event Communication - Message Board
defineComponent("message-broadcaster", {
  styles: {
    container: { padding: '1.5rem', background: 'var(--theme-bg, #ffffff)', border: '2px solid var(--theme-border, #e2e8f0)', borderRadius: '10px', margin: '1rem 0' },
    input: { width: '100%', padding: '0.75rem', border: '1px solid var(--theme-border, #e2e8f0)', borderRadius: '6px', marginBottom: '1rem', fontSize: '1rem' },
    button: { padding: '0.75rem 1.5rem', background: 'var(--theme-primary, #3b82f6)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }
  },
  eventListeners: {
    "message-sent": `
      // Listen for messages from other components
      const event = arguments[0];
      console.log('📢 Message received:', event.detail);
      
      // Provide visual feedback
      const container = this.querySelector('.container');
      if (container) {
        container.style.borderColor = '#10b981';
        setTimeout(() => {
          container.style.borderColor = 'var(--theme-border, #e2e8f0)';
        }, 1000);
      }
    `
  },
  render: ({ broadcasterId = string("Broadcaster-1") }: any, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h4', {}, `📢 Message Broadcaster (${broadcasterId})`),
      h('input', { 
        type: 'text', 
        class: classes!.input,
        placeholder: 'Enter a message to broadcast...',
        id: `msg-input-${broadcasterId}`
      }),
      h('button', { 
        class: classes!.button,
        onclick: `
          const input = document.getElementById('msg-input-${broadcasterId}');
          const message = input.value.trim();
          if (message) {
            const event = new CustomEvent('message-sent', {
              detail: { from: '${broadcasterId}', message, timestamp: new Date().toISOString() },
              bubbles: true
            });
            document.dispatchEvent(event);
            input.value = '';
          }
        `
      }, 'Broadcast Message')
    )
  )
} as any);

// 5. Message Receiver - Displays received messages
defineComponent("message-receiver", {
  styles: {
    container: `{
      padding: 1.5rem;
      background: var(--theme-bg, #ffffff);
      border: 2px solid var(--theme-border, #e2e8f0);
      border-radius: 10px;
      margin: 1rem 0;
      min-height: 200px;
    }`,
    messageList: `{
      max-height: 150px;
      overflow-y: auto;
      border: 1px solid var(--theme-border, #e2e8f0);
      border-radius: 6px;
      padding: 0.5rem;
      background: var(--theme-secondary, #f1f5f9);
    }`,
    message: `{
      padding: 0.5rem;
      margin: 0.25rem 0;
      background: white;
      border-radius: 4px;
      border-left: 3px solid var(--theme-primary, #3b82f6);
      font-size: 0.9rem;
    }`,
    timestamp: `{
      color: #64748b;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }`
  },
  eventListeners: {
    "message-sent": `
      const event = arguments[0];
      const { from, message, timestamp } = event.detail;
      
      // Add message to display
      const messageList = this.querySelector('.message-list');
      if (messageList) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        messageEl.innerHTML = \`
          <div><strong>\${from}:</strong> \${message}</div>
          <div class="timestamp">\${new Date(timestamp).toLocaleTimeString()}</div>
        \`;
        
        messageList.appendChild(messageEl);
        messageList.scrollTop = messageList.scrollHeight;
        
        // Limit to last 10 messages
        while (messageList.children.length > 10) {
          messageList.removeChild(messageList.firstChild);
        }
      }
    `
  },
  render: ({ receiverId = string("Receiver-1") }: any, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h4', {}, `📨 Message Receiver (${receiverId})`),
      h('div', { class: classes!.messageList, id: `messages-${receiverId}` },
        h('div', { style: 'color: #64748b; font-style: italic; text-align: center; padding: 2rem;' },
          'Waiting for messages...'
        )
      )
    )
  )
} as any);

// 6. Complex State Orchestrator - Coordinates multiple reactive systems
defineComponent("state-orchestrator", {
  styles: {
    container: { padding: '2rem', background: 'linear-gradient(135deg, var(--theme-bg, #ffffff) 0%, var(--theme-secondary, #f1f5f9) 100%)', border: '2px dashed var(--theme-primary, #3b82f6)', borderRadius: '15px', margin: '2rem 0', textAlign: 'center' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' },
    stat: { padding: '1rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    statValue: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--theme-primary, #3b82f6)' },
    statLabel: { color: 'var(--theme-text, #64748b)', fontSize: '0.9rem', marginTop: '0.5rem' },
    button: { padding: '0.75rem 1.5rem', background: 'var(--theme-primary, #3b82f6)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', margin: '0.5rem' }
  },
  stateSubscriptions: {
    "counter-network": `
      const counterStat = this.querySelector('#counter-stat');
      if (counterStat) {
        counterStat.textContent = value.toString();
      }
    `,
    "theme": `
      const themeStat = this.querySelector('#theme-stat');
      if (themeStat) {
        themeStat.textContent = value.charAt(0).toUpperCase() + value.slice(1);
      }
    `
  },
  eventListeners: {
    "message-sent": `
      const event = arguments[0];
      const messageStat = this.querySelector('#message-stat');
      if (messageStat) {
        const current = parseInt(messageStat.textContent) || 0;
        messageStat.textContent = (current + 1).toString();
      }
    `
  },
  onMount: `
    // Initialize stats with current state
    const counterValue = window.StateManager?.getState('counter-network') || 0;
    const themeValue = window.StateManager?.getState('theme') || 'light';
    
    const counterStat = this.querySelector('#counter-stat');
    const themeStat = this.querySelector('#theme-stat');
    
    if (counterStat) counterStat.textContent = counterValue.toString();
    if (themeStat) themeStat.textContent = themeValue.charAt(0).toUpperCase() + themeValue.slice(1);
  `,
  render: ({}, api: any, classes: any) => (
    h('div', { class: classes!.container },
      h('h3', {}, '🎛️ State Orchestrator'),
      h('p', {}, 'Monitors and coordinates all reactive systems in real-time.'),
      
      h('div', { class: classes!.statsGrid },
        h('div', { class: classes!.stat },
          h('div', { class: classes!.statValue, id: 'counter-stat' }, '0'),
          h('div', { class: classes!.statLabel }, 'Counter Network Value')
        ),
        h('div', { class: classes!.stat },
          h('div', { class: classes!.statValue, id: 'theme-stat' }, 'Light'),
          h('div', { class: classes!.statLabel }, 'Current Theme')
        ),
        h('div', { class: classes!.stat },
          h('div', { class: classes!.statValue, id: 'message-stat' }, '0'),
          h('div', { class: classes!.statLabel }, 'Messages Broadcast')
        )
      ),
      
      h('div', { style: 'margin-top: 1.5rem;' },
        h('button', { 
          class: classes!.button,
          onclick: `
            window.StateManager?.publish('counter-network', 0);
            const messageStat = this.querySelector('#message-stat');
            if (messageStat) messageStat.textContent = '0';
          `
        }, 'Reset All State'),
        h('button', { 
          class: classes!.button,
          onclick: `
            const event = new CustomEvent('message-sent', {
              detail: { 
                from: 'Orchestrator', 
                message: 'System status: All reactive systems operational!', 
                timestamp: new Date().toISOString() 
              },
              bubbles: true
            });
            document.dispatchEvent(event);
          `
        }, 'Broadcast Status')
      )
    )
  )
} as any);

console.log("✅ Advanced Reactive System examples loaded - 6 components demonstrating hybrid reactivity");
