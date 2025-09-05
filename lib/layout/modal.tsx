import { h } from "../jsx-runtime.ts";
import { css } from "../css-in-ts.ts";

export type ModalProps = {
  id: string;
  title: string;
  children: string;
  open?: boolean;
};

const styles = css({
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    opacity: 0,
    visibility: "hidden",
    transition: "opacity 0.3s ease, visibility 0.3s ease",
  },
  overlayOpen: {
    opacity: 1,
    visibility: "visible",
  },
  modal: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transform: "scale(0.95)",
    transition: "transform 0.3s ease",
  },
  modalOpen: {
    transform: "scale(1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "1rem",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  content: {
    marginTop: "1rem",
  },
});

export const Modal = (
  { id, title, children, open = false }: ModalProps,
): string => {
  const overlayClasses = `${styles.classMap.overlay} ${
    open ? styles.classMap.overlayOpen : ""
  }`;
  const modalClasses = `${styles.classMap.modal} ${
    open ? styles.classMap.modalOpen : ""
  }`;

  return (
    <div
      id={id}
      class={overlayClasses}
      data-modal-overlay
      aria-hidden={!open}
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      style={styles.css}
    >
      <div
        class={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
      >
        <div class={styles.classMap.header}>
          <h2 id={`${id}-title`} class={styles.classMap.title}>{title}</h2>
          <button
            type="button"
            class={styles.classMap.closeButton}
            aria-label="Close modal"
            // This is a placeholder for the toggle functionality
            onclick={`document.getElementById('${id}').classList.remove('${styles.classMap.overlayOpen}'); document.querySelector('#${id} [data-modal-overlay]').classList.remove('${styles.classMap.modalOpen}')`}
          >
            &times;
          </button>
        </div>
        <div class={styles.classMap.content}>
          {children}
        </div>
      </div>
    </div>
  );
};
