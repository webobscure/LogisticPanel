import React from "react";
import "../ui.css";
export default function UiSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  style = {},
  title
}) {
  return (
    <div className="filter-container">
      {title && <h1>{title}</h1>}
      <select
        className={`ui-select ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "6px 10px",
          border: "1px solid #ccc",
          "border-radius": "4px",
          "font-size": "14px",
          background: "white",
          cursor: "pointer",
          ...style,
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
