import React, { useEffect, useState } from "react";
import UiTable from "../ui/atoms/table";
import UiTableButton from "../ui/atoms/button";
import { FaCashRegister, FaCalendarAlt } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"; 



export default function UsersSalaryTable() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedUserPayments, setSelectedUserPayments] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = "https://dlm-agent.ru/api/v1";
  registerLocale("ru", ru); // регистрируем локаль

  // --- Загрузка выплат и пользователей ---
  useEffect(() => {
    const fetchPaymentsAndUsers = async () => {
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
        const paymentsData = await res.json();

        const uniqueUserIds = [...new Set(paymentsData.map((p) => p.user?.id))];
        const userCache = new Map();

        await Promise.all(
          uniqueUserIds.map(async (id) => {
            try {
              const userRes = await fetch(`${API_URL}/user?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (userRes.ok) {
                const userArr = await userRes.json();
                userCache.set(id, userArr[0]);
              }
            } catch {
              userCache.set(id, null);
            }
          })
        );

        const merged = paymentsData.map((p) => {
          const user = userCache.get(p.user?.id);
          const fullName = user
            ? `${user.surname || ""} ${user.name || ""} ${user.patronymic || ""}`.trim()
            : "—";
          return {
            id: p.id,
            userId: user?.id,
            fullName,
            roles: user?.roles?.join(", ") || "—",
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

    fetchPaymentsAndUsers();
  }, []);

  // --- Фильтр по датам ---
  useEffect(() => {
    if (!dateFrom && !dateTo) {
      setFilteredPayments(payments);
      return;
    }
    const filtered = payments.filter((p) => {
      if (!p.date) return false;
      const d = new Date(p.date);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    });
    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [dateFrom, dateTo, payments]);

  // --- Пагинация ---
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginated = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Модалка ---
  const openModal = (userId) => {
    const userPayments = payments.filter((p) => p.userId === userId);
    setSelectedUserPayments(userPayments);
    setIsModalOpen(true);
  };

  // --- Скачать Excel ---
  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");

      let url = `${API_URL}/user-payment/excel/all`;
      const params = [];
      if (dateFrom) params.push(`from=${dateFrom.toISOString().slice(0, 10)}`);
      if (dateTo) params.push(`to=${dateTo.toISOString().slice(0, 10)}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка ${res.status}: ${text}`);
      }

      const blob = await res.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = "Зарплата сотрудников.xlsx";
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

      {/* --- Фильтр по дате --- */}
      <div className="filter-form user-form" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <DatePicker
            selected={dateFrom}
            onChange={(date) => setDateFrom(date)}
            selectsStart
            startDate={dateFrom}
            endDate={dateTo}
            placeholderText="дд.мм.гггг"
            dateFormat="dd-mm-yyyy"
            className="filter-input"
            locale="ru"
          />
          <DatePicker
            selected={dateTo}
            onChange={(date) => setDateTo(date)}
            selectsEnd
            startDate={dateFrom}
            endDate={dateTo}
            minDate={dateFrom}
            placeholderText="дд.мм.гггг"
            dateFormat="dd-mm-yyyy"
            className="filter-input"
            locale="ru"
          />
      </div>

      {/* --- Таблица --- */}
      <div className="errorreport-table">
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
        {!loading && filteredPayments.length === 0 ? (
          <p>Нет данных</p>
        ) : (
          <UiTable
            columns={[
              { header: "ID юзера", render: (p) => p.userId },
              { header: "ФИО", render: (p) => p.fullName },
              { header: "Роли", render: (p) => p.roles },
              { header: "Сумма", render: (p) => `${p.amount} ₽` },
            ]}
            data={paginated}
            onRowClick={(row) => openModal(row.userId)}
            rowStyle={{ cursor: "pointer" }}
          />
        )}

        {/* --- Пагинация --- */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
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

        {/* --- Скачать Excel --- */}
        <div className="button-top">
          <UiTableButton
            label="Скачать Excel"
            style={{ width: "100%", margin: "0 auto" }}
            onClick={downloadExcel}
          />
        </div>
      </div>

      {/* --- Модалка --- */}
      {isModalOpen && selectedUserPayments && (
        <div
          className="modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="modal-close-btn"
            >
              ×
            </button>
            <h2>{selectedUserPayments[0].fullName}</h2>
            <p className="total-amount">
              Всего к выплате:{" "}
              {selectedUserPayments
                .reduce((sum, p) => sum + (p.amount || 0), 0)
                .toFixed(2)}{" "}
              ₽
            </p>
            {selectedUserPayments.map((p) => (
              <div key={p.id} className="payment-card">
                <p className="payment-date">{new Date(p.date).toLocaleString("ru-RU")}</p>
                <p className="payment-amount">{p.amount} ₽</p>
                <p className="payment-desc">{p.description || "Без описания"}</p>
              </div>
            ))}
            <button
              onClick={() => setIsModalOpen(false)}
              className="modal-close-action"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
