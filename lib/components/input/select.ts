// Select component - Dropdown selection with search and multi-select support
import { css } from "../../css-in-ts.ts";
import { componentTokens } from "../../themes/component-tokens.ts";
import type { BaseComponentProps, ComponentSize } from "../types.ts";

export type SelectVariant = "default" | "filled" | "flushed" | "unstyled";

export type SelectOption = {
  readonly value: string | number;
  readonly label: string;
  readonly disabled?: boolean;
  readonly group?: string;
};

export type SelectProps = BaseComponentProps & {
  readonly variant?: SelectVariant;
  readonly size?: ComponentSize;
  readonly placeholder?: string;
  readonly value?: string | number | (string | number)[];
  readonly defaultValue?: string | number | (string | number)[];
  readonly multiple?: boolean;
  readonly searchable?: boolean;
  readonly clearable?: boolean;
  readonly required?: boolean;
  readonly readOnly?: boolean;
  readonly autoFocus?: boolean;
  readonly name?: string;
  readonly id?: string;
  readonly "aria-label"?: string;
  readonly "aria-describedby"?: string;
  readonly options: SelectOption[];
  readonly error?: boolean;
  readonly errorMessage?: string;
  readonly helpText?: string;
  readonly maxHeight?: string;
  readonly onChange?: string;
  readonly onFocus?: string;
  readonly onBlur?: string;
  readonly onSearch?: string;
};

/**
 * Select component with advanced features like search and multi-select
 *
 * @example
 * ```tsx
 * // Basic select
 * Select({
 *   placeholder: "Choose an option",
 *   options: [
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" },
 *   ]
 * })
 *
 * // Searchable multi-select
 * Select({
 *   multiple: true,
 *   searchable: true,
 *   clearable: true,
 *   options: countries,
 *   placeholder: "Select countries"
 * })
 *
 * // Grouped options
 * Select({
 *   options: [
 *     { value: "us", label: "United States", group: "North America" },
 *     { value: "ca", label: "Canada", group: "North America" },
 *     { value: "uk", label: "United Kingdom", group: "Europe" },
 *   ]
 * })
 * ```
 */
export function Select(props: SelectProps): string {
  const {
    variant = "default",
    size = "md",
    placeholder = "Select an option",
    value,
    defaultValue,
    multiple = false,
    searchable = false,
    clearable = false,
    required = false,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    name,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    options = [],
    error = false,
    errorMessage,
    helpText,
    maxHeight = "200px",
    className = "",
    onChange,
    onFocus,
    onBlur,
    onSearch,
  } = props;

  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${selectId}-listbox`;
  const searchId = `${selectId}-search`;

  // Group options if they have group property
  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || "__ungrouped";
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  const styles = css({
    wrapper: {
      position: "relative",
      width: "100%",
    },

    select: {
      position: "relative",
      width: "100%",
      border: "1px solid",
      borderColor: error
        ? componentTokens.colors.error[300]
        : componentTokens.colors.gray[300],
      borderRadius: componentTokens.radius.md,
      fontSize: componentTokens.typography.sizes.sm,
      fontWeight: componentTokens.typography.weights.normal,
      lineHeight: componentTokens.typography.lineHeights.tight,
      color: componentTokens.colors.gray[900],
      backgroundColor: componentTokens.colors.surface.input,
      cursor: disabled ? "not-allowed" : "pointer",
      transition:
        `all ${componentTokens.animation.duration.normal} ${componentTokens.animation.easing.out}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",

      // Size variants
      ...(size === "sm" && {
        height: componentTokens.component.input.height.sm,
        padding: `0 ${componentTokens.spacing[2]} 0 ${
          componentTokens.spacing[3]
        }`,
        fontSize: componentTokens.typography.sizes.sm,
      }),
      ...(size === "md" && {
        height: componentTokens.component.input.height.md,
        padding: `0 ${componentTokens.spacing[2]} 0 ${
          componentTokens.spacing[3]
        }`,
        fontSize: componentTokens.typography.sizes.sm,
      }),
      ...(size === "lg" && {
        height: componentTokens.component.input.height.lg,
        padding: `0 ${componentTokens.spacing[3]} 0 ${
          componentTokens.spacing[4]
        }`,
        fontSize: componentTokens.typography.sizes.base,
      }),

      // Variant styles
      ...(variant === "default" && {
        backgroundColor: componentTokens.colors.surface.input,
        borderColor: error
          ? componentTokens.colors.error[300]
          : componentTokens.colors.gray[300],
      }),

      ...(variant === "filled" && {
        backgroundColor: componentTokens.colors.gray[50],
        borderColor: "transparent",
      }),

      ...(variant === "flushed" && {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderRadius: 0,
        borderBottom: `2px solid ${
          error
            ? componentTokens.colors.error[300]
            : componentTokens.colors.gray[300]
        }`,
      }),

      ...(variant === "unstyled" && {
        backgroundColor: "transparent",
        border: "none",
        borderRadius: 0,
        padding: 0,
      }),

      // States
      "&:hover:not([data-disabled])": {
        borderColor: error
          ? componentTokens.colors.error[400]
          : componentTokens.colors.gray[400],
      },

      "&[data-focus='true']": {
        outline: "none",
        borderColor: error
          ? componentTokens.colors.error[500]
          : componentTokens.colors.primary[500],
        boxShadow: error
          ? `0 0 0 3px ${componentTokens.colors.error[100]}`
          : `0 0 0 3px ${componentTokens.colors.primary[100]}`,
      },

      "&[data-disabled='true']": {
        backgroundColor: componentTokens.colors.gray[100],
        borderColor: componentTokens.colors.gray[200],
        color: componentTokens.colors.gray[500],
        cursor: "not-allowed",
      },
    },

    placeholder: {
      color: componentTokens.colors.gray[400],
      flex: 1,
      textAlign: "left",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    value: {
      flex: 1,
      textAlign: "left",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    multiValue: {
      display: "flex",
      flexWrap: "wrap",
      gap: componentTokens.spacing[1],
      flex: 1,
      alignItems: "center",
      minHeight: "1.5rem",
    },

    tag: {
      display: "inline-flex",
      alignItems: "center",
      gap: componentTokens.spacing[1],
      padding: `${componentTokens.spacing[1]} ${componentTokens.spacing[2]}`,
      backgroundColor: componentTokens.colors.primary[100],
      color: componentTokens.colors.primary[800],
      borderRadius: componentTokens.radius.sm,
      fontSize: componentTokens.typography.sizes.xs,
      fontWeight: componentTokens.typography.weights.medium,
    },

    tagRemove: {
      cursor: "pointer",
      color: componentTokens.colors.primary[600],
      "&:hover": {
        color: componentTokens.colors.primary[800],
      },
    },

    indicators: {
      display: "flex",
      alignItems: "center",
      gap: componentTokens.spacing[1],
      marginLeft: componentTokens.spacing[2],
      flexShrink: 0,
    },

    clearButton: {
      cursor: "pointer",
      color: componentTokens.colors.gray[400],
      padding: componentTokens.spacing[1],
      borderRadius: componentTokens.radius.sm,
      "&:hover": {
        color: componentTokens.colors.gray[600],
        backgroundColor: componentTokens.colors.gray[100],
      },
    },

    chevron: {
      color: componentTokens.colors.gray[400],
      transform: "rotate(0deg)",
      transition:
        `transform ${componentTokens.animation.duration.fast} ${componentTokens.animation.easing.out}`,
      "&[data-open='true']": {
        transform: "rotate(180deg)",
      },
    },

    listbox: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      zIndex: 50,
      marginTop: componentTokens.spacing[1],
      backgroundColor: "white",
      border: `1px solid ${componentTokens.colors.gray[200]}`,
      borderRadius: componentTokens.radius.md,
      boxShadow: componentTokens.shadows.lg,
      maxHeight,
      overflowY: "auto",
      display: "none",
      "&[data-open='true']": {
        display: "block",
      },
    },

    search: {
      width: "100%",
      padding: componentTokens.spacing[3],
      border: "none",
      borderBottom: `1px solid ${componentTokens.colors.gray[200]}`,
      fontSize: componentTokens.typography.sizes.sm,
      "&:focus": {
        outline: "none",
      },
      "&::placeholder": {
        color: componentTokens.colors.gray[400],
      },
    },

    optionsList: {
      maxHeight: "inherit",
      overflowY: "auto",
    },

    group: {
      padding: `${componentTokens.spacing[2]} ${componentTokens.spacing[3]} ${
        componentTokens.spacing[1]
      }`,
      fontSize: componentTokens.typography.sizes.xs,
      fontWeight: componentTokens.typography.weights.semibold,
      color: componentTokens.colors.gray[500],
      textTransform: "uppercase",
      letterSpacing: componentTokens.typography.letterSpacing.wider,
      backgroundColor: componentTokens.colors.gray[50],
      borderBottom: `1px solid ${componentTokens.colors.gray[200]}`,
    },

    option: {
      padding: componentTokens.spacing[3],
      cursor: "pointer",
      fontSize: componentTokens.typography.sizes.sm,
      color: componentTokens.colors.gray[900],
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",

      "&:hover": {
        backgroundColor: componentTokens.colors.gray[50],
      },

      "&[data-selected='true']": {
        backgroundColor: componentTokens.colors.primary[50],
        color: componentTokens.colors.primary[900],
      },

      "&[data-disabled='true']": {
        color: componentTokens.colors.gray[400],
        cursor: "not-allowed",
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },

    checkIcon: {
      color: componentTokens.colors.primary[600],
    },

    emptyState: {
      padding: componentTokens.spacing[6],
      textAlign: "center",
      color: componentTokens.colors.gray[500],
      fontSize: componentTokens.typography.sizes.sm,
    },

    helpText: {
      fontSize: componentTokens.typography.sizes.xs,
      color: componentTokens.colors.gray[600],
      marginTop: componentTokens.spacing[1],
    },

    errorText: {
      fontSize: componentTokens.typography.sizes.xs,
      color: componentTokens.colors.error[600],
      marginTop: componentTokens.spacing[1],
      display: "flex",
      alignItems: "center",
      gap: componentTokens.spacing[1],
    },
  });

  // Selected values logic
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );

  // Build display value
  let displayContent;
  if (selectedOptions.length === 0) {
    displayContent =
      `<span class="${styles.classMap.placeholder}">${placeholder}</span>`;
  } else if (multiple) {
    const tags = selectedOptions.map((option) =>
      `<span class="${styles.classMap.tag}">
        ${option.label}
        ${
        !disabled && !readOnly
          ? `<span class="${styles.classMap.tagRemove}" onclick="removeTag('${option.value}')">&times;</span>`
          : ""
      }
       </span>`
    ).join("");
    displayContent = `<div class="${styles.classMap.multiValue}">${tags}</div>`;
  } else {
    displayContent = `<span class="${styles.classMap.value}">${
      selectedOptions[0].label
    }</span>`;
  }

  // Build options list
  const optionsHtml = Object.entries(groupedOptions).map(
    ([group, groupOptions]) => {
      const groupHeader = group !== "__ungrouped"
        ? `<div class="${styles.classMap.group}">${group}</div>`
        : "";

      const optionsHtml = groupOptions.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const checkIcon = multiple && isSelected
          ? `<span class="${styles.classMap.checkIcon}">✓</span>`
          : "";

        return `
        <div 
          class="${styles.classMap.option}" 
          data-value="${option.value}"
          data-selected="${isSelected}"
          data-disabled="${option.disabled || false}"
          onclick="selectOption('${option.value}', ${multiple})"
        >
          <span>${option.label}</span>
          ${checkIcon}
        </div>
      `;
      }).join("");

      return groupHeader + optionsHtml;
    },
  ).join("");

  const searchInput = searchable
    ? `<input 
        id="${searchId}" 
        class="${styles.classMap.search}" 
        type="text" 
        placeholder="Search options..."
        oninput="filterOptions(this.value)"
       />`
    : "";

  const clearButton = clearable && selectedOptions.length > 0 && !disabled
    ? `<div class="${styles.classMap.clearButton}" onclick="clearSelection()">✕</div>`
    : "";

  // JavaScript functionality
  const selectScript = `
    <script>
      (function() {
        const selectWrapper = document.getElementById('${selectId}');
        const select = selectWrapper.querySelector('[data-select]');
        const listbox = document.getElementById('${listboxId}');
        const chevron = selectWrapper.querySelector('[data-chevron]');
        let isOpen = false;
        
        function toggleDropdown() {
          if (${disabled} || ${readOnly}) return;
          
          isOpen = !isOpen;
          listbox.setAttribute('data-open', isOpen);
          chevron.setAttribute('data-open', isOpen);
          select.setAttribute('data-focus', isOpen);
          
          if (isOpen && ${searchable}) {
            const searchInput = document.getElementById('${searchId}');
            setTimeout(() => searchInput?.focus(), 50);
          }
        }
        
        function selectOption(value, multiple) {
          const currentValue = ${JSON.stringify(selectedValues)};
          let newValue;
          
          if (multiple) {
            const index = currentValue.indexOf(value);
            if (index > -1) {
              newValue = currentValue.filter(v => v !== value);
            } else {
              newValue = [...currentValue, value];
            }
          } else {
            newValue = value;
            toggleDropdown(); // Close dropdown for single select
          }
          
          // Trigger change event
          ${onChange ? `(${onChange})(newValue);` : ""}
          
          // Update UI (this would normally be handled by state management)
          // For demo purposes, we'll just console.log
          console.log('Selected:', newValue);
        }
        
        function removeTag(value) {
          selectOption(value, true); // Remove from multi-select
        }
        
        function clearSelection() {
          const newValue = ${multiple} ? [] : null;
          ${onChange ? `(${onChange})(newValue);` : ""}
          console.log('Cleared selection');
        }
        
        function filterOptions(searchTerm) {
          const options = listbox.querySelectorAll('[data-value]');
          options.forEach(option => {
            const label = option.textContent.toLowerCase();
            const matches = label.includes(searchTerm.toLowerCase());
            option.style.display = matches ? 'flex' : 'none';
          });
          
          ${onSearch ? `(${onSearch})(searchTerm);` : ""}
        }
        
        // Event listeners
        select.addEventListener('click', toggleDropdown);
        select.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
          }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (!selectWrapper.contains(e.target)) {
            isOpen = false;
            listbox.setAttribute('data-open', false);
            chevron.setAttribute('data-open', false);
            select.setAttribute('data-focus', false);
          }
        });
        
        // Make functions globally accessible for inline handlers
        window.selectOption = selectOption;
        window.removeTag = removeTag;
        window.clearSelection = clearSelection;
        window.filterOptions = filterOptions;
      })();
    </script>
  `;

  // Build help/error text
  const helpTextElement = helpText && !error
    ? `<div class="${styles.classMap.helpText}">${helpText}</div>`
    : "";

  const errorTextElement = error && errorMessage
    ? `<div class="${styles.classMap.errorText}">⚠️ ${errorMessage}</div>`
    : "";

  return `
    <div id="${selectId}" class="${styles.classMap.wrapper}">
      <div 
        class="${styles.classMap.select} ${className}"
        data-select
        data-disabled="${disabled}"
        role="combobox"
        aria-expanded="false"
        aria-haspopup="listbox"
        aria-labelledby="${selectId}"
        ${ariaLabel ? `aria-label="${ariaLabel}"` : ""}
        ${ariaDescribedBy ? `aria-describedby="${ariaDescribedBy}"` : ""}
        ${required ? 'aria-required="true"' : ""}
        ${error ? 'aria-invalid="true"' : ""}
        tabindex="${disabled ? -1 : 0}"
      >
        ${displayContent}
        <div class="${styles.classMap.indicators}">
          ${clearButton}
          <div class="${styles.classMap.chevron}" data-chevron>▼</div>
        </div>
      </div>
      
      <div 
        id="${listboxId}" 
        class="${styles.classMap.listbox}"
        role="listbox"
        aria-labelledby="${selectId}"
        ${multiple ? 'aria-multiselectable="true"' : ""}
        data-open="false"
      >
        ${searchInput}
        <div class="${styles.classMap.optionsList}">
          ${
    optionsHtml ||
    `<div class="${styles.classMap.emptyState}">No options available</div>`
  }
        </div>
      </div>
      
      ${helpTextElement}
      ${errorTextElement}
    </div>
    ${selectScript}
  `.trim();
}
