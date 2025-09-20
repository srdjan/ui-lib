/**
 * Item Component - Generic reusable item display
 * Can be used for todo items, list items, cards, user cards, etc.
 */

import { h } from "../../simple.tsx";

// Simple CSS styles for the item component
const itemStyles = `
.item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.15s ease;
  position: relative;
  container-type: inline-size;
}

.item:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.item:focus-within {
  outline: 2px solid #bfdbfe;
  outline-offset: 2px;
}

.item.completed {
  opacity: 0.7;
  text-decoration: line-through;
  background-color: #f3f4f6;
}

.item.selected {
  background-color: #eff6ff;
  border-color: #bfdbfe;
}

.item.priority-high {
  border-left: 4px solid #ef4444;
}

.item.priority-medium {
  border-left: 4px solid #f59e0b;
}

.item.priority-low {
  border-left: 4px solid #10b981;
}

@container (max-width: 300px) {
  .item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.item-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

@container (max-width: 300px) {
  .item-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}

.item-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.item-icon svg,
.item-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.item-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.25;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-metadata {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

@container (max-width: 300px) {
  .item-metadata {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}

.item-metadata .dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.5;
}

.item-badges {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.item-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.item-badge.primary {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.item-badge.success {
  background-color: #dcfce7;
  color: #166534;
}

.item-badge.warning {
  background-color: #fef3c7;
  color: #92400e;
}

.item-badge.danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.item-badge.neutral {
  background-color: #f3f4f6;
  color: #6b7280;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

@container (max-width: 300px) {
  .item-actions {
    align-self: stretch;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
}

.item-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: transparent;
  color: #6b7280;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  min-width: 2rem;
  min-height: 2rem;
}

.item-action:hover {
  background-color: #f9fafb;
  color: #111827;
}

.item-action:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.item-action.danger {
  color: #ef4444;
}

.item-action.danger:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.item-action.primary {
  color: #3b82f6;
}

.item-action.primary:hover {
  background-color: #eff6ff;
  color: #2563eb;
}
`;

export function Item({
  id = "",
  title = "",
  description = "",
  icon = "",
  timestamp = "",
  badges = [],
  actions = [],
  variant = "default",
  size = "md",
  priority = "",
  completed = false,
  selected = false,
}: {
  id?: string;
  title?: string;
  description?: string;
  icon?: string;
  timestamp?: string;
  badges?: Array<{ text: string; variant?: string }>;
  actions?: Array<{ text: string; action: string; variant?: string }>;
  variant?: "default" | "completed" | "selected" | "priority";
  size?: "sm" | "md" | "lg";
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  selected?: boolean;
}) {
  const classes = [
    "item",
    variant === "completed" || completed ? "completed" : "",
    variant === "selected" || selected ? "selected" : "",
    priority ? `priority-${priority}` : "",
  ].filter(Boolean).join(" ");

  // Render icon
  const iconHtml = icon ? `
    <div class="item-icon">
      ${icon}
    </div>
  ` : "";

  // Render badges
  const badgesHtml = badges.length > 0 ? `
    <div class="item-badges">
      ${badges.map(badge => `
        <span class="item-badge ${badge.variant || 'neutral'}">
          ${badge.text}
        </span>
      `).join("")}
    </div>
  ` : "";

  // Render metadata
  const metadataHtml = timestamp ? `
    <div class="item-metadata">
      <span>${timestamp}</span>
    </div>
  ` : "";

  // Render actions
  const actionsHtml = actions.length > 0 ? `
    <div class="item-actions">
      ${actions.map(action => `
        <button type="button" class="item-action ${action.variant || 'default'}" onclick="${action.action}">
          ${action.text}
        </button>
      `).join("")}
    </div>
  ` : "";

  return `
    <div
      ${id ? `id="${id}"` : ''}
      class="${classes}"
      data-component="item"
      data-variant="${variant}"
      data-size="${size}"
      ${priority ? `data-priority="${priority}"` : ''}
      data-completed="${completed.toString()}"
      data-selected="${selected.toString()}"
    >
      <style>${itemStyles}</style>
      <div class="item-content">
        ${iconHtml}
        <div class="item-main">
          ${title ? `<h3 class="item-title">${title}</h3>` : ''}
          ${description ? `<p class="item-description">${description}</p>` : ''}
          ${metadataHtml}
          ${badgesHtml}
        </div>
      </div>
      ${actionsHtml}
    </div>
  `;
}