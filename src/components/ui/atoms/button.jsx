export default function UiTableButton({ label, icon: Icon, onClick, href, className = "" }) {
  const content = (
    <>
      {Icon && <Icon style={{ marginRight: 6 }} />}
      {label}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`ui-table-button ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`ui-table-button ${className}`}>
      {content}
    </button>
  );
}
