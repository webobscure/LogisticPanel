import React, { useState, useEffect } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import UiSelect from "../../components/ui/atoms/select";
import UiTable from "../../components/ui/atoms/table";
import Loader from "../../components/ui/molecules/Loader";

export default function UsersTable() {
  const API_URL = "https://dlm-agent.ru/api/v1";

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // 🔹 Фильтры поиска
  const [searchFilters, setSearchFilters] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    vehicle: "",
    carNumber: "",
    userType: "all",
    verified: "all",
  });

  // --- Фильтр пользователей ---
  const filterUsers = (usersList, filters) => {
    return usersList.filter((user) => {
      if (!user) return false;

      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const middleName = user.middleName || "";
      const vehicle = user.vehicle || "";
      const carNumber = user.carNumber || "";
      const userType = user.userType || "";
      const verifiedString = user.verified ? "true" : "false";

      return (
        firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
        lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
        middleName.toLowerCase().includes(filters.middleName.toLowerCase()) &&
        vehicle.toLowerCase().includes(filters.vehicle.toLowerCase()) &&
        carNumber.toLowerCase().includes(filters.carNumber.toLowerCase()) &&
        (filters.userType === "all" ||
          filters.userType === "" ||
          userType === filters.userType) &&
        (filters.verified === "all" ||
          filters.verified === "" ||
          verifiedString === filters.verified)
      );
    });
  };

  const userTypes = [
    { value: "водитель", label: "водитель" },
    { value: "логист", label: "логист" },
    { value: "руководитель", label: "руководитель" },
    { value: "механик", label: "механик" },
  ];

  const verifiedOptions = [
    { value: "all", label: "Все статусы верификации" },
    { value: "true", label: "Верифицирован" },
    { value: "false", label: "Не верифицирован" },
  ];

  // --- Изменение фильтров ---
  const handleFilterChange = (field, value) => {
    const newFilters = { ...searchFilters, [field]: value };
    setSearchFilters(newFilters);
    const newFiltered = filterUsers(users, newFilters);
    setFilteredUsers(newFiltered);
    setCurrentPage(1); // сброс на первую страницу при фильтрации
  };

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, userType: newRole } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(filterUsers(updatedUsers, searchFilters));
  };

  const handleVerificationToggle = (userId, verified) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, verified } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(filterUsers(updatedUsers, searchFilters));
  };
  const handleActivenToggle = (userId, active) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, active } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(filterUsers(updatedUsers, searchFilters));
  };
  const handleBanToggle = (userId) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const newBanned = !user.banned;
        return { ...user, banned: newBanned, verified: !newBanned };
      }
      return user;
    });
    setUsers(updatedUsers);
    setFilteredUsers(filterUsers(updatedUsers, searchFilters));
  };

  // --- Загрузка всех пользователей с API ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        const res = await fetch(`${API_URL}/user/all`, {
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

        const formatted = data.map((u) => ({
          id: u.id,
          firstName: u.name || "",
          lastName: u.surname || "",
          middleName: u.patronymic || "",
          vehicle: u.vehicles?.[0]?.brand || null,
          carNumber: u.vehicles?.[0]?.state_number || null,
          userType: u.roles?.[0] || "Не назначен", // для селекта
          roles: u.roles || [], // сохраняем массив ролей
          group: u.group || "—",
          verified: u.is_verified,
          banned: u.is_banned,
          telephone: u.phone,
          nickname: u.telegram_nickname,
          active: u.is_active
        }));

        setUsers(formatted);
        setFilteredUsers(formatted);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // --- Пагинация ---
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="users">
      {/* Форма поиска */}
      <div className="filter bg-card-light">
        <div className="filter-title">
          <FaSearch /> Поиск пользователей
        </div>
        <div className="filter-form user-form">
          <input
            type="text"
            placeholder="Фамилия"
            value={searchFilters.lastName}
            onChange={(e) => handleFilterChange("lastName", e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Имя"
            value={searchFilters.firstName}
            onChange={(e) => handleFilterChange("firstName", e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Отчество"
            value={searchFilters.middleName}
            onChange={(e) => handleFilterChange("middleName", e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="ТС"
            value={searchFilters.vehicle}
            onChange={(e) => handleFilterChange("vehicle", e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Номер машины"
            value={searchFilters.carNumber}
            onChange={(e) => handleFilterChange("carNumber", e.target.value)}
            className="filter-input"
          />

          <UiSelect
            options={[{ value: "all", label: "Все роли" }, ...userTypes]}
            value={searchFilters.userType}
            onChange={(val) => handleFilterChange("userType", val)}
            className="filter-select"
          />

          <UiSelect
            options={verifiedOptions}
            value={searchFilters.verified}
            onChange={(val) => handleFilterChange("verified", val)}
            className="filter-select"
          />
        </div>
      </div>

      {/* Статусы загрузки / ошибки */}
      {loading && <Loader />}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      {!loading && filteredUsers.length === 0 && (
        <p>Пользователи не найдены.</p>
      )}

      {/* Таблица пользователей */}
      {!loading && filteredUsers.length > 0 && (
        <div className="table-users bg-card-light">
          <div className="users-title">
            <FaUser
              size={24}
              style={{ marginRight: 8, verticalAlign: "middle" }}
            />
            <span className="title-text">
              Пользователи ({filteredUsers.length})
            </span>
          </div>
          <UiTable
            columns={[
              { header: "ID", render: (u) => `${u.id}` },
              {
                header: "ФИО",
                render: (u) => `${u.lastName} ${u.firstName} ${u.middleName}`,
              },
              {
                header: "Роль / Группа",
                render: (u) => {
                  const rolesText = Array.isArray(u.roles)
                    ? u.roles.join(", ")
                    : u.roles || "—";
                  const groupText = u.group || "—";
                  return `${groupText} / ${rolesText}`;
                },
              },
              {
                header: "Номер телефона",
                render: (u) => `${u.telephone}`,
              },
              {
                header: "Тг никнейм",
                render: (u) => `${ u.nickname || 'Не подключен'}`,
              },
              {
                header: "Верификация",
                render: (u) => (
                  <>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={u.verified}
                        onChange={(e) =>
                          handleVerificationToggle(u.id, e.target.checked)
                        }
                      />
                      <span className="slider" />
                    </label>
                    <span>{u.verified ? "Есть" : "Нет"}</span>
                  </>
                ),
              },
              {
                header: "Действия",
                render: (u) => (
                  <>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={u.banned}
                        onChange={() => handleBanToggle(u.id)}
                      />
                      <span className="slider" />
                    </label>
                    <span>{u.banned ? "Верифицировать" : "Забанить"}</span>
                  </>
                ),
              },
              {
                header: "Активен",
                render: (u) => (
                  <>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={u.active}
                        onChange={() => handleActivenToggle(u.id)}
                      />
                      <span className="slider" />
                    </label>
                    <span>{u.active ? "Активен" : "Оффлайн"}</span>
                  </>
                ),
              },
            ]}
            data={paginatedUsers}
          />

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
      )}
    </div>
  );
}
