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
          width: "100%",          // растягиваем на всю ширину контейнера
          padding: "10px 12px",   // одинаковый паддинг как у input
          borderRadius: "6px",    // радиус как у input
          fontSize: "0.95rem",    // размер шрифта как у input
          border: "1.5px solid #ddd",
          background: "white",
          cursor: "pointer",
          boxSizing: "border-box",
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
