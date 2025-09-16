export default function UiTable({ columns, data, onRowClick, rowStyle }) {
  return (
    <table className="ui-table">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={row.id || rowIndex}
            onClick={() => onRowClick?.(row)}   // 🔹 обработчик клика
            style={{ cursor: onRowClick ? "pointer" : "default", ...rowStyle }}
          >
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                {col.render ? col.render(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
