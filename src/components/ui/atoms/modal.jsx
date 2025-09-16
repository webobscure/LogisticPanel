import React from "react";
import '../ui.css';

export default function UiModal({ title, children, onClose }) {
  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className="ui-modal modal-form" onClick={(e) => e.stopPropagation()}>
        <header className="ui-modal-header">
          {title && <h3 className="ui-modal-title">{title}</h3>}
          <button className="ui-modal-close" onClick={onClose} aria-label="Закрыть модалку">
            ✖
          </button>
        </header>
        <div className="ui-modal-content">{children}</div>
      </div>
    </div>
  );
}
