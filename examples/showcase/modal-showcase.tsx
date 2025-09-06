import { h } from "../../lib/jsx-runtime.ts";
import { Modal, modalClassNames } from "../../lib/layout/modal.tsx";

export const ModalShowcase = () => {
  return (
    <div>
      <h2>Modal Showcase</h2>
      <button
        type="button"
        onclick={`(function(){const overlay=document.getElementById('demo-modal'); if(!overlay) return; overlay.classList.add('${modalClassNames.overlayOpen}'); const dlg=overlay.querySelector('div'); if(dlg) dlg.classList.add('${modalClassNames.modalOpen}');})()`}
      >
        Open Modal
      </button>
      <Modal id="demo-modal" title="Demo Modal">
        <p>This is a demo modal. You can put any content you want here.</p>
      </Modal>
    </div>
  );
};
