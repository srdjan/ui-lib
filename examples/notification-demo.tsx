/** @jsx h */
// deno-lint-ignore-file verbatim-module-syntax
import {
  createNotification,
  defineComponent,
  dispatchEvent,
  h,
  string,
} from "../index.ts";

/**
 * 🔔 Notification System - Demonstrates Tier 3: DOM Events
 *
 * Shows component-to-component communication via custom DOM events
 * with structured payloads.
 */
defineComponent("notification-trigger", {
  styles: {
    triggerPanel: `{
      background: white;
      border-radius: 12px;
      padding: 2rem;
      border: 1px solid #dee2e6;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }`,

    triggerTitle: `{
      font-size: 1.5rem;
      color: #495057;
      margin-bottom: 1rem;
      font-weight: bold;
    }`,

    buttonGrid: `{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }`,

    notifyButton: `{
      padding: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }`,

    successButton: `{
      background: #28a745;
      color: white;
    }`,

    warningButton: `{
      background: #ffc107;
      color: #212529;
    }`,

    errorButton: `{
      background: #dc3545;
      color: white;
    }`,

    infoButton: `{
      background: #17a2b8;
      color: white;
    }`,
  },

  render: (
    { _channelId = string("notifications") },
    _api,
    classes,
  ) => {
    // channelId reserved for future targeting; using global document listener now

    return (
      <div class={classes!.triggerPanel}>
        <h3 class={classes!.triggerTitle}>🔔 DOM Event Communication</h3>
        <p>
          Click buttons to send notifications via DOM events to other
          components:
        </p>

        <div class={classes!.buttonGrid}>
          <button
            type="button"
            class={`${classes!.notifyButton} ${classes!.successButton}`}
            onclick={createNotification("Saved!", "success", 2500)}
          >
            ✅ Simple
          </button>

          <button
            type="button"
            class={`${classes!.notifyButton} ${classes!.successButton}`}
            onclick={dispatchEvent("show-notification", {
              type: "success",
              title: "Success!",
              message: "Operation completed successfully",
              duration: 3000,
            })}
          >
            ✅ Success
          </button>

          <button
            type="button"
            class={`${classes!.notifyButton} ${classes!.warningButton}`}
            onclick={dispatchEvent("show-notification", {
              type: "warning",
              title: "Warning!",
              message: "Please check your input",
              duration: 4000,
            })}
          >
            ⚠️ Warning
          </button>

          <button
            type="button"
            class={`${classes!.notifyButton} ${classes!.errorButton}`}
            onclick={dispatchEvent("show-notification", {
              type: "error",
              title: "Error!",
              message: "Something went wrong",
              duration: 5000,
            })}
          >
            ❌ Error
          </button>

          <button
            type="button"
            class={`${classes!.notifyButton} ${classes!.infoButton}`}
            onclick={dispatchEvent("show-notification", {
              type: "info",
              title: "Info",
              message: "Here is some helpful information",
              duration: 3000,
            })}
          >
            ℹ️ Info
          </button>
        </div>

        <p style="color: #666; font-size: 0.875rem; margin-top: 1rem;">
          📡 These buttons dispatch custom DOM events that notification
          components listen for. No direct coupling between components!
        </p>
      </div>
    );
  },
});

/**
 * 📢 Notification Display - Listens for DOM events and shows notifications
 */
defineComponent("notification-display", {
  styles: {
    notificationContainer: `{
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 1000;
      pointer-events: none;
    }`,

    notification: `{
      background: white;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-left: 4px solid #007bff;
      min-width: 300px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      pointer-events: auto;
    }`,

    notificationVisible: `{
      opacity: 1;
      transform: translateX(0);
    }`,

    notificationSuccess: `{
      border-left-color: #28a745;
    }`,

    notificationWarning: `{
      border-left-color: #ffc107;
    }`,

    notificationError: `{
      border-left-color: #dc3545;
    }`,

    notificationInfo: `{
      border-left-color: #17a2b8;
    }`,

    notificationTitle: `{
      font-weight: bold;
      margin-bottom: 0.25rem;
      color: #495057;
    }`,

    notificationMessage: `{
      color: #666;
      font-size: 0.875rem;
      margin: 0;
    }`,
  },

  // Listener managed globally in examples/index.html

  render: (
    {
      maxNotifications = string("5"),
    },
    _api,
    classes,
  ) => {
    const max = typeof maxNotifications === "string"
      ? parseInt(maxNotifications) || 5
      : 5;

    return (
      <div
        class={classes!.notificationContainer}
        data-max-notifications={max}
        data-class-notification={classes!.notification}
        data-class-visible={classes!.notificationVisible}
        data-class-success={classes!.notificationSuccess}
        data-class-warning={classes!.notificationWarning}
        data-class-error={classes!.notificationError}
        data-class-info={classes!.notificationInfo}
        data-class-title={classes!.notificationTitle}
        data-class-message={classes!.notificationMessage}
      >
        {/* Notifications will be dynamically added here */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function(){
            if (document.__funcwcNotifyBound) return;
            document.__funcwcNotifyBound = true;
            document.addEventListener('funcwc:show-notification', function(e) {
              try {
                var detail = e.detail || {};
                var containers = document.querySelectorAll('[data-component="notification-display"]');
                containers.forEach(function(container) {
                  var notification = document.createElement('div');
                  notification.className = container.getAttribute('data-class-notification') || '';
                  var type = detail.type || 'info';
                  var typeClass = container.getAttribute('data-class-' + type) || '';
                  if (typeClass) notification.classList.add(typeClass);
                  var title = document.createElement('div');
                  title.className = container.getAttribute('data-class-title') || '';
                  title.textContent = detail.title || '';
                  var message = document.createElement('p');
                  message.className = container.getAttribute('data-class-message') || '';
                  message.textContent = detail.message || '';
                  notification.appendChild(title);
                  notification.appendChild(message);
                  container.appendChild(notification);
                  setTimeout(function(){
                    var visible = container.getAttribute('data-class-visible') || '';
                    if (visible) notification.classList.add(visible);
                  }, 10);
                  var duration = parseInt(detail.duration) || 3000;
                  setTimeout(function(){
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(function(){ notification.remove(); }, 300);
                  }, duration);
                  var maxN = parseInt(container.getAttribute('data-max-notifications')) || 5;
                  while (container.children.length > maxN) container.removeChild(container.children[0]);
                });
              } catch (err) { console.warn('notification handler failed', err); }
            });
          })();
        `,
          }}
        >
        </script>
      </div>
    );
  },
});
