import React, { useEffect, useState } from "react";
import UiTable from "../ui/atoms/table";
import UiTableButton from "../ui/atoms/button";
import { FaCashRegister } from "react-icons/fa";

export default function UsersSalaryTable() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedUserPayments, setSelectedUserPayments] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = "https://dlm-agent.ru/api/v1";

  // --- загрузка выплат ---
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        const res = await fetch(`${API_URL}/user-payment/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Ошибка ${res.status}: ${text}`);
        }

        const data = await res.json();

        // --- Подгружаем роли через API /user?id=... ---
        const userCache = new Map();
        const uniqueUserIds = [...new Set(data.map((p) => p.user?.id))];

        await Promise.all(
          uniqueUserIds.map(async (id) => {
            try {
              const userRes = await fetch(`${API_URL}/user?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (userRes.ok) {
                const userArr = await userRes.json();
                userCache.set(id, userArr[0] || null);
              } else {
                userCache.set(id, null);
              }
            } catch {
              userCache.set(id, null);
            }
          })
        );

        const merged = data.map((p) => {
          const user = userCache.get(p.user?.id) || p.user;
          const fullName = user
            ? `${user.surname || ""} ${user.name || ""} ${user.patronymic || ""}`.trim()
            : "—";
          const roles = user?.roles ? user.roles.join(", ") : "—";
          const vehicle = user?.vehicle
            ? `${user.vehicle.type} ${user.vehicle.state_number}`
            : "—";

          return {
            id: p.id,
            userId: user?.id,
            fullName,
            roles,
            vehicle,
            amount: p.amount,
            description: p.description,
            date: p.create_dt,
          };
        });

        setPayments(merged);
        setFilteredPayments(merged);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // --- фильтр по датам ---
  useEffect(() => {
    if (!dateFrom && !dateTo) {
      setFilteredPayments(payments);
      return;
    }
    const from = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
    const to = dateTo ? new Date(dateTo + "T23:59:59") : null;

    const filtered = payments.filter((p) => {
      const d = new Date(p.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [dateFrom, dateTo, payments]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginated = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (userId) => {
    const userPayments = payments.filter((p) => p.userId === userId);
    setSelectedUserPayments(userPayments);
    setIsModalOpen(true);
  };

  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");

      let url = `${API_URL}/user-payment/excel/all`;
      const params = [];
      if (dateFrom) params.push(`from=${dateFrom}`);
      if (dateTo) params.push(`to=${dateTo}`);
      if (params.length) url += `?${params.join("&")}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Ошибка ${res.status}`);

      const blob = await res.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = "Зарплаты сотрудников.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (err) {
      alert("Ошибка при скачивании Excel: " + err.message);
    }
  };

  return (
    <div className="errorreport bg-card-light">
      <div className="errorreport-title">
        <FaCashRegister /> Зарплата сотрудников
      </div>

      {/* Фильтр по дате */}
      <div className="filter-form user-form" style={{ marginBottom: "20px" }}>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="filter-input" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="filter-input"/>
      </div>

      {/* Таблица */}
      <div className="errorreport-table">
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && filteredPayments.length === 0 ? (
          <p>Нет данных</p>
        ) : (
          <UiTable
            columns={[
              { header: "ID юзера", render: (p) => p.userId },
              { header: "ФИО", render: (p) => p.fullName },
              { header: "Роль", render: (p) => p.roles },
              { header: "Авто", render: (p) => p.vehicle },
              { header: "Сумма", render: (p) => `${p.amount} ₽` },
            ]}
            data={paginated}
            onRowClick={(row) => openModal(row.userId)}
            rowStyle={{ cursor: "pointer" }}
          />
        )}

        {/* Пагинация */}
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Назад
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Вперёд
          </button>
        </div>

        {/* Excel */}
        <div className="button-top">
          <UiTableButton label="Скачать Excel" onClick={downloadExcel} />
        </div>
      </div>

      {/* --- Модалка --- */}
{isModalOpen && selectedUserPayments && (
  <div
    className="modal-overlay"
    onClick={() => setIsModalOpen(false)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    }}
  >
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        width: "500px",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <button
        onClick={() => setIsModalOpen(false)}
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          background: "transparent",
          border: "none",
          fontSize: "25px",
          fontWeight: "bold",
          color: "red",
          cursor: "pointer",
        }}
        aria-label="Закрыть"
      >
        ×
      </button>

      <h2 style={{ marginBottom: "10px" }}>
        {selectedUserPayments[0].fullName}
      </h2>

      <p
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "5px",
          color: "#333",
        }}
      >
        Роль: {selectedUserPayments[0].roles}
      </p>

      <p
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#28a745",
        }}
      >
        Всего к выплате:{" "}
        {selectedUserPayments
          .reduce((sum, p) => sum + (p.amount || 0), 0)
          .toFixed(2)}{" "}
        ₽
      </p>

      {selectedUserPayments.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #eee",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>
            {new Date(p.date).toLocaleString("ru-RU")}
          </p>
          <p style={{ margin: "5px 0", fontSize: "18px", color: "#007bff" }}>
            {p.amount} ₽
          </p>
          <p style={{ margin: "5px 0", color: "#555" }}>
            {p.description || "Без описания"}
          </p>
        </div>
      ))}

      <button
        onClick={() => setIsModalOpen(false)}
        style={{
          marginTop: "15px",
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Закрыть
      </button>
    </div>
  </div>
)}

    </div>
  );
}
