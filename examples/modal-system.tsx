/** @jsx h */
/// <reference path="../src/lib/jsx.d.ts" />
import {
  defineComponent,
  defineReactiveComponent,
  h,
  string,
  boolean,
  number,
} from "../src/index.ts";
import {
  dispatchEvent,
  listensFor,
  createNotification,
} from "../src/lib/reactive-helpers.ts";

// Modal Trigger - Buttons that open specific modals
defineComponent("modal-trigger", {
  styles: {
    trigger: {
      background: 'var(--theme-button-bg, #6f42c1)', color: 'var(--theme-button-text, white)', border: 'none',
      padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', margin: '0.25rem',
      transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    },
    triggerHover: { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(111, 66, 193, 0.3)' },
    triggerInfo: { background: '#17a2b8' },
    triggerSuccess: { background: '#28a745' },
    triggerWarning: { background: '#ffc107', color: '#212529' },
    triggerDanger: { background: '#dc3545' },
  },
  render: ({ 
    modalId = string("default"),
    buttonText = string("Open Modal"),
    modalTitle = string("Modal Title"),
    modalContent = string("Modal content goes here"),
    modalType = string("info"), // info, success, warning, danger
    icon = string("📝")
  }) => (
    <button 
      class={`trigger trigger-${modalType}`}
      hx-on:click={dispatchEvent("open-modal", {
        modalId,
        title: modalTitle,
        content: modalContent,
        type: modalType
      })}
      hx-on:mouseover="this.classList.add('trigger-hover')"
      hx-on:mouseout="this.classList.remove('trigger-hover')"
    >
      <span>{icon}</span>
      <span>{buttonText}</span>
    </button>
  )
});

// Universal Modal Component
defineReactiveComponent("modal", {
  eventListeners: {
    "open-modal": `
      if (event.detail.modalId === this.dataset.modalId) {
        // Update modal content
        this.querySelector('.modal-title').textContent = event.detail.title;
        this.querySelector('.modal-content').innerHTML = event.detail.content;
        
        // Update modal type
        const modal = this.querySelector('.modal');
        modal.className = 'modal modal-' + (event.detail.type || 'info');
        
        // Show modal
        this.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = this.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
        
        // Animate in
        this.style.opacity = '0';
        this.querySelector('.modal').style.transform = 'scale(0.7)';
        requestAnimationFrame(() => {
          this.style.opacity = '1';
          this.querySelector('.modal').style.transform = 'scale(1)';
        });
      }
    `,
    "close-modal": `
      if (event.detail.modalId === this.dataset.modalId) {
        // Animate out
        this.style.opacity = '0';
        this.querySelector('.modal').style.transform = 'scale(0.7)';
        
        setTimeout(() => {
          this.style.display = 'none';
          document.body.style.overflow = '';
        }, 200);
      }
    `,
    "close-all-modals": `
      // Close this modal regardless of ID
      this.style.opacity = '0';
      this.querySelector('.modal').style.transform = 'scale(0.7)';
      
      setTimeout(() => {
        this.style.display = 'none';
        document.body.style.overflow = '';
      }, 200);
    `
  },
  onMount: `
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.style.display === 'flex') {
        document.dispatchEvent(new CustomEvent('funcwc:close-modal', {
          detail: { modalId: this.dataset.modalId }
        }));
      }
    });
  `,
  styles: {
    overlay: {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)', display: 'none', alignItems: 'center', justifyContent: 'center', zIndex: '1000', padding: '1rem', opacity: '0', transition: 'opacity 0.2s ease',
    },
    modal: {
      background: 'var(--theme-card-bg, white)', border: '3px solid var(--theme-border, #ddd)', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', transform: 'scale(0.7)', transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    modalInfo: { borderColor: '#17a2b8' },
    modalSuccess: { borderColor: '#28a745' },
    modalWarning: { borderColor: '#ffc107' },
    modalDanger: { borderColor: '#dc3545' },
    closeBtn: {
      position: 'absolute', top: '1rem', right: '1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', transition: 'all 0.2s ease',
    },
    closeBtnHover: { background: '#c82333', transform: 'rotate(90deg)' },
    modalTitle: { color: 'var(--theme-text, #333)', margin: '0 2rem 1rem 0', fontSize: '1.5rem', fontWeight: 'bold' },
    modalContent: { color: 'var(--theme-text, #333)', lineHeight: '1.6', marginBottom: '2rem' },
    modalActions: { display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '2px solid var(--theme-border, #eee)' },
    actionBtn: { padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease' },
    primaryBtn: { background: 'var(--theme-button-bg, #007bff)', color: 'var(--theme-button-text, white)' },
    secondaryBtn: { background: 'var(--theme-border, #6c757d)', color: 'white' },
  },
  render: ({ 
    id = string("default"),
    title = string("Modal Title"),
    content = string("Modal content")
  }) => (
    <div 
      class="overlay"
      data-modal-id={id}
      hx-on:click={`
        if (event.target === this) {
          document.dispatchEvent(new CustomEvent('funcwc:close-modal', {
            detail: { modalId: this.dataset.modalId }
          }));
        }
      `}
    >
      <div class="modal modal-info">
        <button 
          class="close-btn"
          hx-on:click={dispatchEvent("close-modal", { modalId: id })}
          hx-on:mouseover="this.classList.add('close-btn-hover')"
          hx-on:mouseout="this.classList.remove('close-btn-hover')"
          title="Close modal"
        >
          ×
        </button>
        
        <h3 class="modal-title">{title}</h3>
        <div class="modal-content">{content}</div>
        
        <div class="modal-actions">
          <button 
            class="action-btn secondary-btn"
            hx-on:click={dispatchEvent("close-modal", { modalId: id })}
          >
            Cancel
          </button>
          <button 
            class="action-btn primary-btn"
            hx-on:click={`
              alert('Action confirmed!');
              document.dispatchEvent(new CustomEvent('funcwc:close-modal', {
                detail: { modalId: '${id}' }
              }));
            `}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
});

// Notification Sender - Triggers various types of notifications
defineComponent("notification-sender", {
  styles: {
    container: `{
      background: var(--theme-card-bg, #f8f9fa);
      border: 2px solid var(--theme-border, #ddd);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem 0;
    }`,
    title: `{
      color: var(--theme-text, #333);
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }`,
    inputGroup: `{
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }`,
    input: `{
      flex: 1;
      padding: 0.75rem;
      border: 2px solid var(--theme-border, #ddd);
      border-radius: 6px;
      font-size: 1rem;
      min-width: 200px;
      background: var(--theme-bg, white);
      color: var(--theme-text, #333);
    }`,
    sendBtn: `{
      background: #17a2b8;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }`,
    typeButtons: `{
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }`,
    typeButton: `{
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }`,
    infoBtn: `{ background: #17a2b8; color: white; }`,
    successBtn: `{ background: #28a745; color: white; }`,
    warningBtn: `{ background: #ffc107; color: #212529; }`,
    errorBtn: `{ background: #dc3545; color: white; }`,
    advanced: `{
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 2px solid var(--theme-border, #eee);
    }`,
    advancedTitle: `{
      color: var(--theme-text, #333);
      font-weight: bold;
      margin-bottom: 0.5rem;
    }`,
    presetButtons: `{
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }`
  },
  render: () => (
    <div class="container">
      <h4 class="title">
        <span>📢</span>
        <span>Notification System</span>
      </h4>
      
      <div class="input-group">
        <input 
          type="text" 
          class="input"
          placeholder="Enter your message..."
          id="notification-input"
        />
        <button 
          class="send-btn"
          hx-on:click={`
            const message = document.getElementById('notification-input').value;
            if (!message.trim()) {
              alert('Please enter a message!');
              return;
            }
            
            ${createNotification("message", "info", 3000)}
            document.getElementById('notification-input').value = '';
          `}
        >
          Send Info
        </button>
      </div>
      
      <div class="type-buttons">
        <button 
          class="type-button success-btn"
          hx-on:click={createNotification("✅ Success! Operation completed successfully.", "success", 3000)}
        >
          <span>✅</span> Success
        </button>
        <button 
          class="type-button error-btn"
          hx-on:click={createNotification("❌ Error! Something went wrong.", "error", 5000)}
        >
          <span>❌</span> Error
        </button>
        <button 
          class="type-button warning-btn"
          hx-on:click={createNotification("⚠️ Warning! Please check your input.", "warning", 4000)}
        >
          <span>⚠️</span> Warning
        </button>
        <button 
          class="type-button info-btn"
          hx-on:click={createNotification("ℹ️ Info: This is an informational message.", "info", 3000)}
        >
          <span>ℹ️</span> Info
        </button>
      </div>
      
      <div class="advanced">
        <div class="advanced-title">🎪 Advanced Examples:</div>
        <div class="preset-buttons">
          <button 
            class="type-button success-btn"
            hx-on:click={`
              // Sequential notifications
              ${createNotification("🚀 Starting process...", "info", 2000)}
              setTimeout(() => {
                ${createNotification("⏳ Processing data...", "warning", 2000)}
                setTimeout(() => {
                  ${createNotification("✅ Process completed!", "success", 3000)}
                }, 2000);
              }, 2000);
            `}
          >
            📊 Sequence
          </button>
          <button 
            class="type-button warning-btn"
            hx-on:click={`
              // Long notification
              ${createNotification("📖 This is a very long notification message that demonstrates how the system handles longer content gracefully with proper text wrapping and spacing.", "info", 6000)}
            `}
          >
            📖 Long Text
          </button>
          <button 
            class="type-button error-btn"
            hx-on:click={`
              // Multiple quick notifications
              setTimeout(() => { ${createNotification("🔢 Message 1 of 5", "success", 2000)} }, 500);
              setTimeout(() => { ${createNotification("🔢 Message 2 of 5", "success", 2000)} }, 1000);
              setTimeout(() => { ${createNotification("🔢 Message 3 of 5", "success", 2000)} }, 1500);
              setTimeout(() => { ${createNotification("🔢 Message 4 of 5", "success", 2000)} }, 2000);
              setTimeout(() => { ${createNotification("🔢 Message 5 of 5", "success", 2000)} }, 2500);
            `}
          >
            🔢 Burst
          </button>
        </div>
      </div>
    </div>
  )
});

// Toast Notification Display System
defineComponent("notification-display", {
  styles: {
    container: `{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      max-width: 350px;
      pointer-events: none;
    }`,
    toast: `{
      background: var(--theme-card-bg, white);
      border: 2px solid var(--theme-border, #ddd);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 0.75rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      pointer-events: auto;
      backdrop-filter: blur(10px);
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }`,
    toastEnter: `{
      transform: translateX(100%);
      opacity: 0;
    }`,
    toastShow: `{
      transform: translateX(0);
      opacity: 1;
    }`,
    toastExit: `{
      transform: translateX(100%);
      opacity: 0;
      margin-bottom: 0;
      padding-top: 0;
      padding-bottom: 0;
    }`,
    toastSuccess: `{ 
      border-color: #28a745;
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    }`,
    toastError: `{ 
      border-color: #dc3545;
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    }`,
    toastWarning: `{ 
      border-color: #ffc107;
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    }`,
    toastInfo: `{ 
      border-color: #17a2b8;
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
    }`,
    toastIcon: `{
      font-size: 1.5rem;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }`,
    toastMessage: `{
      flex: 1;
      color: var(--theme-text, #333);
      line-height: 1.4;
      font-weight: 500;
    }`,
    toastClose: `{
      background: none;
      border: none;
      color: var(--theme-text, #666);
      cursor: pointer;
      font-size: 1.3rem;
      font-weight: bold;
      padding: 0;
      margin-left: 0.5rem;
      opacity: 0.7;
      transition: opacity 0.2s ease;
      flex-shrink: 0;
    }`,
    toastCloseHover: `{
      opacity: 1;
    }`
  },
  render: () => (
    <div
      class="container"
      hx-on:show-notification={`
        const { message, type = 'info', duration = 3000 } = event.detail;
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type + ' toast-enter';
        
        // Toast content with icon
        const icons = {
          info: 'ℹ️',
          success: '✅',
          warning: '⚠️',
          error: '❌'
        };
        
        toast.innerHTML =
          '<div class="toast-icon">' + (icons[type] || icons.info) + '</div>' +
          '<div class="toast-message">' + message + '</div>' +
          '<button class="toast-close" onclick="this.parentElement.remove()">×</button>';
        
        // Add to container
        this.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
          toast.classList.remove('toast-enter');
          toast.classList.add('toast-show');
        });
        
        // Auto remove after duration
        const autoRemove = setTimeout(() => {
          if (toast.parentElement) {
            toast.classList.add('toast-exit');
            setTimeout(() => {
              if (toast.parentElement) toast.remove();
            }, 300);
          }
        }, duration);
        
        // Click to remove (clear auto-remove timeout)
        toast.addEventListener('click', (e) => {
          if (e.target.classList.contains('toast-close') || e.target === toast) {
            clearTimeout(autoRemove);
            toast.classList.add('toast-exit');
            setTimeout(() => {
              if (toast.parentElement) toast.remove();
            }, 300);
          }
        });
        
        // Limit number of toasts (remove oldest)
        const toasts = this.querySelectorAll('.toast');
        if (toasts.length > 5) {
          toasts[0].remove();
        }
      `}
    >
      {/* Notifications will be dynamically added here */}
    </div>
  )
});

// Modal Control Panel - Central control for all modals
defineComponent("modal-control-panel", {
  styles: {
    panel: `{
      background: var(--theme-card-bg, #f8f9fa);
      border: 2px solid var(--theme-border, #ddd);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem 0;
    }`,
    title: `{
      color: var(--theme-text, #333);
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }`,
    section: `{
      margin-bottom: 1.5rem;
    }`,
    sectionTitle: `{
      color: var(--theme-text, #333);
      font-weight: bold;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }`,
    buttonGroup: `{
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }`,
    controlBtn: `{
      background: var(--theme-border, #6c757d);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }`
  },
  render: () => (
    <div class="panel">
      <h4 class="title">
        <span>🎛️</span>
        <span>Modal Control Panel</span>
      </h4>
      
      <div class="section">
        <div class="section-title">📋 Information Modals:</div>
        <div class="button-group">
          <modal-trigger 
            modal-id="info-1"
            button-text="📄 Terms & Conditions"
            modal-title="Terms & Conditions"
            modal-content="<p>Welcome to our application! By using this service, you agree to our terms...</p><ul><li>Respect other users</li><li>Don't spam</li><li>Have fun!</li></ul>"
            modal-type="info"
            icon="📄"
          ></modal-trigger>
          
          <modal-trigger 
            modal-id="info-2"
            button-text="❓ Help & FAQ"
            modal-title="Help & FAQ"
            modal-content="<h4>Frequently Asked Questions:</h4><p><strong>Q: How do I use this?</strong><br/>A: Simply click buttons to see different examples!</p><p><strong>Q: Is this free?</strong><br/>A: Yes, completely free and open source.</p>"
            modal-type="info"
            icon="❓"
          ></modal-trigger>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">⚠️ Action Modals:</div>
        <div class="button-group">
          <modal-trigger 
            modal-id="confirm-1"
            button-text="🗑️ Delete Account"
            modal-title="Confirm Account Deletion"
            modal-content="<p><strong>⚠️ WARNING:</strong> This action cannot be undone!</p><p>Are you sure you want to permanently delete your account? All your data will be lost forever.</p>"
            modal-type="danger"
            icon="🗑️"
          ></modal-trigger>
          
          <modal-trigger 
            modal-id="confirm-2"
            button-text="💾 Save Changes"
            modal-title="Save Your Progress"
            modal-content="<p>You have unsaved changes. Would you like to save them now?</p><p>Your progress will be automatically saved to the cloud.</p>"
            modal-type="success"
            icon="💾"
          ></modal-trigger>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">🎛️ Modal Controls:</div>
        <div class="button-group">
          <button 
            class="control-btn"
            hx-on:click={dispatchEvent("close-all-modals")}
          >
            🚫 Close All Modals
          </button>
          
          <button 
            class="control-btn"
            hx-on:click={`
              // Demo: Open multiple modals in sequence
              ${dispatchEvent("open-modal", {
                modalId: "demo-1",
                title: "Step 1 of 3",
                content: "This is the first modal in a sequence...",
                type: "info"
              })}
              
              setTimeout(() => {
                ${dispatchEvent("close-modal", { modalId: "demo-1" })}
                setTimeout(() => {
                  ${dispatchEvent("open-modal", {
                    modalId: "demo-2", 
                    title: "Step 2 of 3",
                    content: "Moving to the second step...",
                    type: "warning"
                  })}
                  
                  setTimeout(() => {
                    ${dispatchEvent("close-modal", { modalId: "demo-2" })}
                    setTimeout(() => {
                      ${dispatchEvent("open-modal", {
                        modalId: "demo-3",
                        title: "Final Step", 
                        content: "Process completed successfully!",
                        type: "success"
                      })}
                    }, 500);
                  }, 1500);
                }, 500);
              }, 1500);
            `}
          >
            🔄 Modal Sequence Demo
          </button>
        </div>
      </div>
    </div>
  )
});

// Event Communication Demo - Shows how events propagate
defineComponent("event-demo", {
  styles: {
    demo: `{
      background: var(--theme-card-bg, #f8f9fa);
      border: 2px dashed var(--theme-border, #ddd);
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      text-align: center;
    }`,
    title: `{
      color: var(--theme-text, #333);
      font-weight: bold;
      margin-bottom: 1rem;
    }`,
    log: `{
      background: var(--theme-bg, white);
      border: 1px solid var(--theme-border, #ddd);
      border-radius: 4px;
      padding: 0.5rem;
      margin: 1rem 0;
      font-family: monospace;
      font-size: 0.8rem;
      max-height: 100px;
      overflow-y: auto;
      text-align: left;
    }`,
    clearBtn: `{
      background: var(--theme-border, #6c757d);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }`
  },
  render: ({}, api, classes) => h('div', { class: 'demo' }, [
    h('div', { class: 'title' }, '📡 Event Communication Demo'),
    h('p', {}, 'Watch the console log as events are dispatched and received:'),
    h('div', { 
      class: 'log',
      id: 'event-log',
      'hx-on:funcwc:demo-event': `
        const log = document.getElementById('event-log');
        const time = new Date().toLocaleTimeString();
        log.innerHTML += '<div>' + time + ': Received demo event - ' + JSON.stringify(event.detail) + '</div>';
        log.scrollTop = log.scrollHeight;
      `
    }, 'Event log will appear here...'),
    h('button', {
      class: 'clear-btn',
      'hx-on:click': `document.getElementById('event-log').innerHTML = 'Event log cleared...';`
    }, 'Clear Log'),
    h('br', {}),
    h('br', {}),
    h('button', {
      class: 'control-btn',
      style: 'background: #28a745; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; margin: 0.25rem;',
      'hx-on:click': `${dispatchEvent("demo-event", { message: "Hello from button!", timestamp: Date.now() })}`
    }, '📤 Send Demo Event')
  ])
});

// Hidden modals for demo purposes
defineComponent("demo-modals", {
  render: () => (
    <div>
      <modal id="info-1"></modal>
      <modal id="info-2"></modal>
      <modal id="confirm-1"></modal>
      <modal id="confirm-2"></modal>
      <modal id="demo-1"></modal>
      <modal id="demo-2"></modal>
      <modal id="demo-3"></modal>
    </div>
  )
});

console.log("✅ Modal/Notification System components registered");
