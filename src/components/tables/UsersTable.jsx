import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaUser } from "react-icons/fa";
import UiTable from "../../components/ui/atoms/table";
import Loader from "../../components/ui/molecules/Loader";
import UiTableButton from "../ui/atoms/button";
import UiModal from "../ui/atoms/modal";

export default function UsersTable() {
  const API_URL = "https://dlm-agent.ru/api/v1";

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState({});
  // 🔹 модалки
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editUserId, setEditUserId] = useState(null);

  // 🔹 форма для нового юзера
  const [newUser, setNewUser] = useState({
    name: "",
    surname: "",
    patronymic: "",
    phone: "",
    password: "",
  });

  // 🔹 пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // --- загрузка пользователей ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");

      const res = await fetch(`${API_URL}/user/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);

      const data = await res.json();
      const formatted = data.map((u) => ({
        id: u.id,
        firstName: u.name || "",
        lastName: u.surname || "",
        patronymic: u.patronymic || "",
        vehicle: u.vehicles?.[0]?.brand || null,
        carNumber: u.vehicles?.[0]?.state_number || null,
        userType: u.roles?.[0] || "Не назначен",
        roles: u.roles || [],
        group: u.group || "—",
        verified: u.is_verified,
        banned: u.is_banned,
        telephone: u.phone,
        nickname: u.telegram_nickname,
        active: u.is_active,
      }));

      setUsers(formatted);
      setFilteredUsers(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- добавить нового ---
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams({
        name: newUser.name,
        surname: newUser.surname,
        patronymic: newUser.patronymic || "",
        phone: newUser.phone,
        password: newUser.password,
      });
  
      const res = await fetch(`${API_URL}/auth/register?${params.toString()}`, {
        method: "POST",
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail?.[0]?.msg || "Ошибка регистрации");
  
      alert("Пользователь успешно создан!");
      setShowAddModal(false);
      setNewUser({
        name: "",
        surname: "",
        patronymic: "",
        phone: "",
        password: "",
      });
      await fetchUsers(); // обновляем таблицу
    } catch (err) {
      alert(err.message);
    }
  };
  
  // --- функция нахождения изменённых полей ---
  const getChangedFields = () => {
    const changed = {};
    Object.keys(editForm).forEach((key) => {
      const val = editForm[key];
      const origVal = originalData[key];
      if (val !== origVal) {
        changed[key] = val ?? "";
      }
    });
    changed.id = editForm.id ?? editUserId; // id всегда обязателен
    return changed;
  };

  // --- сохранить изменения пользователя ---
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");

      const changedFields = getChangedFields();
      if (!changedFields.id) throw new Error("Нет id пользователя");

      // Формируем query string только из изменённых полей
      const params = new URLSearchParams();
      Object.entries(changedFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });

      const res = await fetch(`${API_URL}/user?${params.toString()}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.detail || data.message || "Ошибка обновления");

      setShowEditModal(false);
      setEditUserId(null);
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- открыть модалку редактирования ---
  const openEditModal = (user) => {
    setEditUserId(user.id);
    setEditForm({ ...user });
    setOriginalData({ ...user }); // сохраняем оригинал для сравнения
    setShowEditModal(true);
  };

  // --- пагинация ---
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="users">
      {loading && <Loader />}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      {!loading && filteredUsers.length > 0 && (
        <div className="table-users bg-card-light">
          <div className="users-title">
            <span className="title-text">
              <FaUser size={24} style={{ marginRight: 8 }} />
              Пользователи ({filteredUsers.length})
            </span>
            <UiTableButton
              label="Добавить пользователя"
              onClick={() => setShowAddModal(true)}
            />
          </div>

          <UiTable
            columns={[
              { header: "ID", render: (u) => `${u.id}` },
              {
                header: "ФИО",
                render: (u) => `${u.lastName} ${u.firstName} ${u.patronymic}`,
              },
              {
                header: "Роль / Группа",
                render: (u) => {
                  const rolesText = Array.isArray(u.roles)
                    ? u.roles.join(", ")
                    : u.roles || "—";
                  return `${u.group || "—"} / ${rolesText}`;
                },
              },
              { header: "Телефон", render: (u) => u.telephone },
              { header: "Тг ник", render: (u) => u.nickname || "Не подключен" },
              {
                header: "Верификация",
                render: (u) =>
                  u.verified ? (
                    <FaCheck color="green" />
                  ) : (
                    <FaTimes color="red" />
                  ),
              },
            ]}
            data={paginatedUsers}
            onRowClick={openEditModal}
          />

          {/* Пагинация */}
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

      {/* --- Модалка добавления --- */}
      {showAddModal && (
        <UiModal
          title="Добавить пользователя"
          onClose={() => setShowAddModal(false)}
        >
          <div className="users-form">
            <input
              placeholder="Фамилия"
              value={newUser.surname}
              onChange={(e) =>
                setNewUser({ ...newUser, surname: e.target.value })
              }
            />
            <input
              placeholder="Имя"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              placeholder="Отчество"
              value={newUser.patronymic}
              onChange={(e) =>
                setNewUser({ ...newUser, patronymic: e.target.value })
              }
            />
            <input
              placeholder="Телефон"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />
            <input
              placeholder="Пароль"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 12,
            }}
          >
            <UiTableButton label="Создать" onClick={handleRegister} />
            <UiTableButton
              label="Отмена"
              onClick={() => setShowAddModal(false)}
            />
          </div>
        </UiModal>
      )}

      {/* --- Модалка редактирования --- */}
      {showEditModal && editUserId && (
        <UiModal
          title="Редактировать пользователя"
          onClose={() => setShowEditModal(false)}
        >
          <div className="users-form">
            <input
              placeholder="Имя"
              value={editForm.firstName || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
            />
            <input
              placeholder="Фамилия"
              value={editForm.lastName || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
            />
            <input
              placeholder="Отчество"
              value={editForm.patronymic || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, patronymic: e.target.value })
              }
            />
            <input
              placeholder="Телефон"
              value={editForm.telephone || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, telephone: e.target.value })
              }
            />
            <input
              placeholder="Тг ник"
              value={editForm.nickname || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, nickname: e.target.value })
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 12,
            }}
          >
            <UiTableButton label="Сохранить" onClick={handleUpdateUser} />
            <UiTableButton
              label="Отмена"
              onClick={() => setShowEditModal(false)}
            />
          </div>
        </UiModal>
      )}
    </div>
  );
}
