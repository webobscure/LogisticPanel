export const Card = ({ children, className = "", style = {} }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        padding: "1rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};