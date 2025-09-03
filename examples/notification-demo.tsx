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
  render: (
    { _channelId = string("notifications") },
    _api,
  ) => {
    // channelId reserved for future targeting; using global document listener now

    return (
      <div class="u-card u-p-4">
        <h3>🔔 DOM Event Communication</h3>
        <p>
          Click buttons to send notifications via DOM events to other
          components:
        </p>

        <div class="u-grid u-grid-auto-fit-250 u-gap-3 u-my-4">
          <button
            type="button"
            class="btn btn-success"
            onclick={createNotification("Saved!", "success", 2500)}
          >
            ✅ Simple
          </button>

          <button
            type="button"
            class="btn btn-success"
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
            class="btn btn-warning"
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
            class="btn btn-error"
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
            class="btn btn-info"
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

        <p class="u-mt-2 u-text-0 u-text-muted">
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
      top: var(--size-5);
      right: var(--size-5);
      z-index: 1000;
      pointer-events: none;
    }`,

    notification: `{
      background: var(--surface-1);
      border-radius: var(--radius-2);
      padding: var(--size-3);
      margin-bottom: var(--size-2);
      box-shadow: var(--shadow-3);
      border-left: var(--border-size-2) solid var(--brand);
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
      border-left-color: var(--green-6);
    }`,

    notificationWarning: `{
      border-left-color: var(--yellow-6);
    }`,

    notificationError: `{
      border-left-color: var(--red-6);
    }`,

    notificationInfo: `{
      border-left-color: var(--cyan-6);
    }`,

    notificationTitle: `{
      font-weight: var(--font-weight-7);
      margin-bottom: var(--size-1);
      color: var(--text-1);
    }`,

    notificationMessage: `{
      color: var(--text-2, var(--gray-7));
      font-size: var(--font-size-0);
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
        role="region"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Notifications"
      >
        {/* Notifications will be dynamically added here */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function(){
            if (document.__funcwcNotifyBound) return;
            document.__funcwcNotifyBound = true;
            document.addEventListener('ui-lib:show-notification', function(e) {
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
                  // Accessibility roles
                  var role = (detail.type === 'error') ? 'alert' : 'status';
                  notification.setAttribute('role', role);
                  notification.setAttribute('aria-live', 'polite');
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
