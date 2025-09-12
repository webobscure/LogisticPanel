import React, { useEffect, useState } from "react";
import UiTable from "../ui/atoms/table";
import { FaCashRegister } from "react-icons/fa";

export default function DriversSalaryTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");


   // 🔹 Пагинация
   const [currentPage, setCurrentPage] = useState(1);
   const usersPerPage = 10;

  const API_URL = "https://dlm-agent.ru/api/v1";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        const res = await fetch(`${API_URL}/user-salary/drivers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Ошибка ${res.status}: ${text}`);
        }

        const data = await res.json();

        const formatted = data.map((u) => {
          const fullName = `${u.surname || ""} ${u.name || ""} ${
            u.patronymic || ""
          }`.trim();

          const roles = Array.isArray(u.roles) ? u.roles.join(", ") : u.roles;

          const totalSalary = u.salary
            ? Object.values(u.salary)
                .filter((val) => typeof val === "number")
                .reduce((acc, val) => acc + val, 0)
            : 0;

          return {
            id: u.id,
            fullName,
            roles,
            totalSalary,
            date: u.salary?.date || null, // ⚡ сюда нужна дата из API
          };
        });

        setUsers(formatted);
        setFilteredUsers(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔎 фильтр по дате
  useEffect(() => {
    if (!dateFrom && !dateTo) {
      setFilteredUsers(users);
      return;
    }

    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    const filtered = users.filter((u) => {
      if (!u.date) return false;
      const d = new Date(u.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });

    setFilteredUsers(filtered);
  }, [dateFrom, dateTo, users]);
// --- Пагинация ---
const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
const paginatedUsers = filteredUsers.slice(
  (currentPage - 1) * usersPerPage,
  currentPage * usersPerPage
);

  return (
    <div className="errorreport bg-card-light">
      <div className="errorreport-title">
        <FaCashRegister /> Зарплата водителей
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
        {!loading && filteredUsers.length === 0 ? (
          <p>Нет данных</p>
        ) : (
          <UiTable
            columns={[
              { header: "ID", render: (u) => u.id },
              { header: "ФИО", render: (u) => u.fullName || "—" },
              { header: "Роли", render: (u) => u.roles || "—" },
              {
                header: "Выплачено за период",
                render: (u) => `${u.totalSalary} ₽`,
              },
             
            ]}
            data={paginatedUsers}
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
    </div>
  );
}
