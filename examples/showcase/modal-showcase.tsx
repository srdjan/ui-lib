import { h } from "../../lib/jsx-runtime.ts";
import { Modal } from "../../lib/layout/modal.tsx";

export const ModalShowcase = () => {
  return (
    <div>
      <h2>Modal Showcase</h2>
      <button
        type="button"
        onclick={`document.getElementById('demo-modal').classList.add('overlay-open-state-class'); document.querySelector('#demo-modal > div').classList.add('modal-open-state-class')`}
      >
        Open Modal
      </button>
      <Modal id="demo-modal" title="Demo Modal">
        <p>This is a demo modal. You can put any content you want here.</p>
      </Modal>
    </div>
  );
};
