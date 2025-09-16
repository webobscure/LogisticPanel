import React, { useEffect, useState } from "react";
import UiTable from "../ui/atoms/table";
import { FaCashRegister } from "react-icons/fa";
import UiTableButton from "../ui/atoms/button";

export default function UsersSalaryTable() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // 🔹 Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_URL = "https://dlm-agent.ru/api/v1";

  useEffect(() => {
    const fetchPaymentsAndUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        // 1. Загружаем выплаты
        const res = await fetch(`${API_URL}/user-payment/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Ошибка ${res.status}: ${text}`);
        }

        const paymentsData = await res.json();

        // 2. Собираем уникальные user_id
        const uniqueUserIds = [...new Set(paymentsData.map((p) => p.user_id))];

        // 3. Загружаем пользователей (кешируем)
        const userCache = new Map();

        await Promise.all(
          uniqueUserIds.map(async (id) => {
            try {
              const userRes = await fetch(`${API_URL}/user?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (userRes.ok) {
                const userArr = await userRes.json();
                const user = userArr[0]; // ⚡ API возвращает массив
                userCache.set(id, user);
              }
            } catch {
              userCache.set(id, null);
            }
          })
        );

        // 4. Объединяем выплаты с юзерами
        const merged = paymentsData.map((p) => {
          const user = userCache.get(p.user_id);

          const fullName = user
            ? `${user.surname || ""} ${user.name || ""} ${
                user.patronymic || ""
              }`.trim()
            : "—";

          const roles = Array.isArray(user?.roles)
            ? user.roles.join(", ")
            : user?.roles || "—";

          return {
            id: p.id,
            userId: p.user_id,
            fullName,
            roles,
            amount: p.amount,
            description: p.description,
            date: p.create_dt,
            vehicle: user?.vehicle?.state_number || "—",
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

  // 🔎 фильтр по дате
  useEffect(() => {
    if (!dateFrom && !dateTo) {
      setFilteredPayments(payments);
      return;
    }

    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    const filtered = payments.filter((p) => {
      if (!p.date) return false;
      const d = new Date(p.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });

    setFilteredPayments(filtered);
  }, [dateFrom, dateTo, payments]);

  // --- Пагинация ---
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginated = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="errorreport bg-card-light">
      <div className="errorreport-title">
        <FaCashRegister /> Зарплата сотрудников
      </div>

      {/* фильтр по дате */}
      <div className="filter-form user-form" style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="filter-input"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="filter-input"
        />
      </div>

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
          />
        )}
        {/* 🔹 Пагинация */}
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
        
      </div>
      <div className="button-top">
        <UiTableButton
                      label="Скачать Excel"
                      style={{ width: "100%", margin: "0 auto" }}
                    />
      </div>
    </div>
  );
}
