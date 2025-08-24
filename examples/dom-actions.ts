// Example-only DOM action helpers that return inline JS strings for handlers

/**
 * Increment/decrement a counter displayed inside a container element.
 * Updates both text content and an optional data-count attribute on the container.
 */
export const updateParentCounter = (
  parentSelector: string,
  counterSelector: string,
  delta: number,
): string =>
  `const p=this.closest('${parentSelector}');if(p){const c=p.querySelector('${counterSelector}');if(c){const v=parseInt(c.textContent||0)+${delta};c.textContent=v;if(p.dataset)p.dataset.count=v;}}`;

/**
 * Reset a counter to its initial value.
 */
export const resetCounter = (
  displaySelector: string,
  initialValue: number | string,
  containerSelector?: string,
): string =>
  `const C=this.closest('${containerSelector || '.counter'}');if(C){const D=C.querySelector('${displaySelector}');if(D)D.textContent='${initialValue}';if(C.dataset)C.dataset.count='${initialValue}'}`;

/**
 * Activate a tab button and the corresponding content panel.
 */
export const activateTab = (
  container: string,
  buttons: string,
  content: string,
  activeClass: string,
): string =>
  `const C=this.closest('${container}');if(!C)return;const K=this.dataset.tab;C.querySelectorAll('${buttons}').forEach(b=>b.classList.remove('${activeClass}'));this.classList.add('${activeClass}');C.querySelectorAll('${content}').forEach(c=>c.classList.remove('${activeClass}'));const A=C.querySelector("[data-tab='"+K+"']");if(A)A.classList.add('${activeClass}');if(C.dataset)C.dataset.active=K;`;

/**
 * Toggle a class on the parent element.
 */
export const toggleParentClass = (className: string): string =>
  `this.parentElement.classList.toggle('${className}')`;

/**
 * Sync a checkbox checked state to a class on the closest todo container.
 * This is tailored to the example markup (.todo or [data-todo]).
 */
export const syncCheckboxToClass = (className: string): string =>
  `this.closest('.todo,[data-todo]').classList.toggle('${className}',this.checked)`;

