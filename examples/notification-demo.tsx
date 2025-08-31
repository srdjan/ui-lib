/** @jsx h */
import { defineComponent, h, string, dispatchEvent, createNotification } from "../index.ts";

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
    {
      channelId = string("notifications"),
    },
    api,
    classes,
  ) => {
    const channel = typeof channelId === "string" ? channelId : "notifications";

    return (
      <div class={classes!.triggerPanel}>
        <h3 class={classes!.triggerTitle}>🔔 DOM Event Communication</h3>
        <p>
          Click buttons to send notifications via DOM events to other
          components:
        </p>

        <div class={classes!.buttonGrid}>
          <button
            class={`${classes!.notifyButton} ${classes!.successButton}`}
            onclick={createNotification("Saved!", "success", 2500)}
          >
            ✅ Simple
          </button>

          <button
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
    api,
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
      </div>
    );
  },
});
