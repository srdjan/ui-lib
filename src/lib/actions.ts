// Action types and renderer for declarative event handlers

// --- Action Type Definitions ---

export type ToggleClassAction = { type: 'toggleClass', className: string };
export type ToggleClassesAction = { type: 'toggleClasses', classNames: string[] };
export type UpdateCounterAction = { type: 'updateCounter', selector: string, delta: number };
export type UpdateParentCounterAction = { type: 'updateParentCounter', parentSelector: string, counterSelector: string, delta: number };
export type ResetCounterAction = { type: 'resetCounter', displaySelector: string, initialValue: number | string, containerSelector?: string };
export type SetTextAction = { type: 'setText', selector: string, value: string };
export type ToggleVisibilityAction = { type: 'toggleVisibility', selector: string };
export type UpdateInputAction = { type: 'updateInput', selector: string, value: string };
export type SyncCheckboxAction = { type: 'syncCheckbox', className: string };
export type ActivateTabAction = { type: 'activateTab', container: string, buttons: string, content: string, activeClass: string };
export type ToggleParentClassAction = { type: 'toggleParentClass', className: string };

export type ComponentAction = 
  | ToggleClassAction
  | ToggleClassesAction
  | UpdateCounterAction
  | UpdateParentCounterAction
  | ResetCounterAction
  | SetTextAction
  | ToggleVisibilityAction
  | UpdateInputAction
  | SyncCheckboxAction
  | ActivateTabAction
  | ToggleParentClassAction;

// --- Action Renderer ---

// These are the raw string-generating functions, moved from dom-helpers
const renderToggleClass = (a: ToggleClassAction) => `this.classList.toggle('${a.className}')`;
const renderToggleClasses = (a: ToggleClassesAction) => a.classNames.map(c => `this.classList.toggle('${c}')`).join(';');
const renderUpdateParentCounter = (a: UpdateParentCounterAction) => `const p=this.closest('${a.parentSelector}');if(p){const c=p.querySelector('${a.counterSelector}');if(c){const v=parseInt(c.textContent||0)+${a.delta};c.textContent=v;if(p.dataset)p.dataset.count=v;}}`.replace(/\s+/g, ' ');
const renderResetCounter = (a: ResetCounterAction) => `const C=this.closest('${a.containerSelector||'.counter'}');if(C){const D=C.querySelector('${a.displaySelector}');if(D)D.textContent='${a.initialValue}';if(C.dataset)C.dataset.count='${a.initialValue}'}`.replace(/\s+/g, ' ');
const renderActivateTab = (a: ActivateTabAction) => `const C=this.closest('${a.container}');if(!C)return;const K=this.dataset.tab;C.querySelectorAll('${a.buttons}').forEach(b=>b.classList.remove('${a.activeClass}'));this.classList.add('${a.activeClass}');C.querySelectorAll('${a.content}').forEach(c=>c.classList.remove('${a.activeClass}'));const A=C.querySelector(\"[data-tab='${K}']\");if(A)A.classList.add('${a.activeClass}');if(C.dataset)C.dataset.active=K;`.replace(/\s+/g, ' ');
const renderToggleParentClass = (a: ToggleParentClassAction) => `this.parentElement.classList.toggle('${a.className}')`;
const renderSyncCheckbox = (a: SyncCheckboxAction) => `this.closest('.todo,[data-todo]').classList.toggle('${a.className}',this.checked)`;

export const renderActionToString = (action: ComponentAction): string => {
  switch (action.type) {
    case "toggleClass": return renderToggleClass(action);
    case "toggleClasses": return renderToggleClasses(action);
    case "updateParentCounter": return renderUpdateParentCounter(action);
    case "resetCounter": return renderResetCounter(action);
    case "activateTab": return renderActivateTab(action);
    case "toggleParentClass": return renderToggleParentClass(action);
    case "syncCheckbox": return renderSyncCheckbox(action);
    // Add other cases here as needed
    default: return '';
  }
};
