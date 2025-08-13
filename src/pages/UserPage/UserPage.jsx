import { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";

import "./UserPage.css";

import UiSelect from "../../components/ui/atoms/select";
import UiTable from "../../components/ui/atoms/table";
import NavPanel from "../../components/ui/organisms/NavPanel";

export default function UserPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: "Иван",
      lastName: "Иванов",
      middleName: "Иванович",
      vehicle: "ТС-001",
      carNumber: "А123БВ",
      userType: "водитель",
      verified: true,
      banned: false,
    },
    {
      id: 2,
      firstName: "Петр",
      lastName: "Петров",
      middleName: "Петрович",
      vehicle: "ТС-002",
      carNumber: "В456ГД",
      userType: "водитель",
      verified: true,
      banned: false,
    },
    {
      id: 3,
      firstName: "Алексей",
      lastName: "Смирнов",
      middleName: "Александрович",
      vehicle: null,
      carNumber: null,
      userType: "механик",
      verified: true,
      banned: false,
    },
    {
      id: 4,
      firstName: "Мария",
      lastName: "Козлова",
      middleName: "Сергеевна",
      vehicle: null,
      carNumber: null,
      userType: "логист",
      verified: false,
      banned: false,
    },
    {
      id: 5,
      firstName: "Дмитрий",
      lastName: "Сидоров",
      middleName: "Владимирович",
      vehicle: null,
      carNumber: null,
      userType: "руководитель",
      verified: true,
      banned: false,
    },
  ]);

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

  const [filteredUsers, setFilteredUsers] = useState(users);

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
        <div className="users">
          {/* Форма поиска */}
          <div className="filter bg-card-light">
            <div className="filter-title">
              <FaSearch /> Поиск пользователей
            </div>
            <div className="filter-form">
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

          {/* Таблица пользователей */}
          <div className="table-users bg-card-light">
            <div className="users-title">
              <FaUser
                size={24}
                style={{ marginRight: 8, verticalAlign: "middle" }}
              />
              <span className="title-text">Пользователи ({users.length})</span>
            </div>
            <UiTable
              columns={[
                {
                  header: "ФИО",
                  render: (u) => `${u.lastName} ${u.firstName} ${u.middleName}`,
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
        </div>
      </div>
    </div>
  );
}
