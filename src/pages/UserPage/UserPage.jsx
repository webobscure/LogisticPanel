import { useState, useEffect } from "react";
import { FaSearch, FaUser } from "react-icons/fa";

import "./UserPage.css";

import UiSelect from "../../components/ui/atoms/select";
import UiTable from "../../components/ui/atoms/table";
import NavPanel from "../../components/ui/organisms/NavPanel";
import { Header } from "../../components/ui/molecules/Header";

export default function UserPage() {
const API_URL = "https://dlm-agent.ru/api/v1/users/me";

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    vehicle: "",
    carNumber: "",
    userType: "all",
    verified: "all",
  });

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

        const formatted = data.map(u => ({
          id: u.id,
          firstName: u.name || "",
          lastName: u.surname || "",
          middleName: u.patronymic || "",
          vehicle: u.vehicles?.[0]?.brand || null,
          carNumber: u.vehicles?.[0]?.state_number || null,
          userType: u.roles?.[0] || "Не назначен",
          verified: u.is_verified,
          banned: u.is_banned,
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

  const handleFilterChange = (field, value) => {
    const newFilters = { ...searchFilters, [field]: value };
    setSearchFilters(newFilters);
    setFilteredUsers(filterUsers(users, newFilters));
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

  return (
    <div className="admin-panel-container">
      <NavPanel />

      <div className="admin-panel-container__right">
        <Header title="Управление пользователями" />

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
                onChange={(e) =>
                  handleFilterChange("firstName", e.target.value)
                }
                className="filter-input"
              />
              <input
                type="text"
                placeholder="Отчество"
                value={searchFilters.middleName}
                onChange={(e) =>
                  handleFilterChange("middleName", e.target.value)
                }
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
                onChange={(e) =>
                  handleFilterChange("carNumber", e.target.value)
                }
                className="filter-input"
              />

              <UiSelect
                options={[{ value: "all", label: "Все роли" }, ...userTypes]}
                value={searchFilters.userType}
                onChange={(val) => handleFilterChange("userType", val)}
                placeholder=""
                className="filter-select"
              />

              <UiSelect
                options={verifiedOptions}
                value={searchFilters.verified}
                onChange={(val) => handleFilterChange("verified", val)}
                placeholder=""
                className="filter-select"
              />
            </div>
          </div>

          {/* Статусы загрузки / ошибки */}
          {loading && <p>Загрузка пользователей...</p>}
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
                  {
                    header: "ФИО",
                    render: (u) =>
                      `${u.lastName} ${u.firstName} ${u.middleName}`,
                  },
                  {
                    header: "ТС / Номер машины",
                    render: (u) => (
                      <>
                        {u.vehicle || "-"}
                        <br />
                        {u.carNumber || "-"}
                      </>
                    ),
                  },
                  {
                    header: "Роль",
                    render: (u) => (
                      <UiSelect
                        options={userTypes}
                        value={u.userType}
                        onChange={(val) => handleRoleChange(u.id, val)}
                        placeholder="Выберите роль"
                      />
                    ),
                  },
                  {
                    header: "Верификация",
                    render: (u) => (
                      <input
                        type="checkbox"
                        checked={u.verified}
                        onChange={(e) =>
                          handleVerificationToggle(u.id, e.target.checked)
                        }
                      />
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
                ]}
                data={filteredUsers}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
