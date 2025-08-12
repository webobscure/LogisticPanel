// UiModal.jsx
import React from "react";
import '../ui.css'
export default function UiModal({ title, children, onClose }) {
  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className="ui-modal modal-form" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="ui-modal-title">{title}</h3>}
        <div className="ui-modal-content">{children}</div>
        <button className="ui-modal-close" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}
