import React, { useState } from "react";
import Header from "../../components/Header/Header";
import { FaUser } from "react-icons/fa";

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
    },
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchFilters, setSearchFilters] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    vehicle: "",
    carNumber: "",
    userType: "all",
    verified: "all",
  });

  const userTypes = ["водитель", "логист", "руководитель", "механик"];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...searchFilters, [field]: value };
    setSearchFilters(newFilters);

    const filtered = users.filter((user) => {
      if (!user) return false;

      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const middleName = user.middleName || "";
      const vehicle = user.vehicle || "";
      const carNumber = user.carNumber || "";
      const userType = user.userType || "";

      return (
        firstName.toLowerCase().includes(newFilters.firstName.toLowerCase()) &&
        lastName.toLowerCase().includes(newFilters.lastName.toLowerCase()) &&
        middleName
          .toLowerCase()
          .includes(newFilters.middleName.toLowerCase()) &&
        vehicle.toLowerCase().includes(newFilters.vehicle.toLowerCase()) &&
        carNumber.toLowerCase().includes(newFilters.carNumber.toLowerCase()) &&
        (newFilters.userType === "all" ||
          newFilters.userType === "" ||
          userType === newFilters.userType) &&
        (newFilters.verified === "all" ||
          newFilters.verified === "" ||
          user.verified.toString() === newFilters.verified)
      );
    });

    setFilteredUsers(filtered);
  };

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, userType: newRole } : user
    );
    setUsers(updatedUsers);

    // Apply current filters to updated data
    const filtered = updatedUsers.filter((user) => {
      if (!user) return false;

      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const middleName = user.middleName || "";
      const vehicle = user.vehicle || "";
      const carNumber = user.carNumber || "";
      const userType = user.userType || "";

      return (
        firstName
          .toLowerCase()
          .includes(searchFilters.firstName.toLowerCase()) &&
        lastName.toLowerCase().includes(searchFilters.lastName.toLowerCase()) &&
        middleName
          .toLowerCase()
          .includes(searchFilters.middleName.toLowerCase()) &&
        vehicle.toLowerCase().includes(searchFilters.vehicle.toLowerCase()) &&
        carNumber
          .toLowerCase()
          .includes(searchFilters.carNumber.toLowerCase()) &&
        (searchFilters.userType === "all" ||
          searchFilters.userType === "" ||
          userType === searchFilters.userType) &&
        (searchFilters.verified === "all" ||
          searchFilters.verified === "" ||
          user.verified.toString() === searchFilters.verified)
      );
    });
    setFilteredUsers(filtered);
  };

  const handleVerificationToggle = (userId, verified) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, verified } : user
    );
    setUsers(updatedUsers);

    // Apply current filters to updated data
    const filtered = updatedUsers.filter((user) => {
      if (!user) return false;

      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const middleName = user.middleName || "";
      const vehicle = user.vehicle || "";
      const carNumber = user.carNumber || "";
      const userType = user.userType || "";

      return (
        firstName
          .toLowerCase()
          .includes(searchFilters.firstName.toLowerCase()) &&
        lastName.toLowerCase().includes(searchFilters.lastName.toLowerCase()) &&
        middleName
          .toLowerCase()
          .includes(searchFilters.middleName.toLowerCase()) &&
        vehicle.toLowerCase().includes(searchFilters.vehicle.toLowerCase()) &&
        carNumber
          .toLowerCase()
          .includes(searchFilters.carNumber.toLowerCase()) &&
        (searchFilters.userType === "all" ||
          searchFilters.userType === "" ||
          userType === searchFilters.userType) &&
        (searchFilters.verified === "all" ||
          searchFilters.verified === "" ||
          user.verified.toString() === searchFilters.verified)
      );
    });
    setFilteredUsers(filtered);
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case "водитель":
        return "default";
      case "логист":
        return "secondary";
      case "руководитель":
        return "destructive";
      case "механик":
        return "outline";
      default:
        return "outline";
    }
  };
  return (
    <div className="admin-panel-container">
      <Header />
      <div className="admin-panel-container__right">
        <div className="users">
          <div className="users-title">
            <FaUser /> Пользователи ({users.length})
            <table
              border="1"
              cellPadding="8"
              style={{
                marginTop: 20,
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>ТС / Номер машины</th>
                  <th>Роль</th>
                  <th>Верификация</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{`${user.lastName} ${user.firstName} ${user.middleName}`}</td>
                    <td>{user.vehicle || "-"}<br/>{user.carNumber || "-"}</td>
                    <td><select
                        value={user.userType}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        <option value="водитель">водитель</option>
                        <option value="логист">логист</option>
                        <option value="руководитель">руководитель</option>
                        <option value="механик">механик</option>
                      </select></td>
                    
                    <td>
                      <input
                        type="checkbox"
                        checked={user.verified}
                        onChange={(e) =>
                          handleVerificationToggle(user.id, e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
