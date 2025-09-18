import React, { useEffect, useState } from "react";
import UiTable from "../ui/atoms/table";
import UiModal from "../ui/atoms/modal";
import { FaCheck, FaTimes, FaCircle, FaCar } from "react-icons/fa";

const API_URL = "https://dlm-agent.ru/api/v1";

export default function VehiclesPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        const res = await fetch(`${API_URL}/vehicle/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Ошибка ${res.status}: ${text}`);
        }

        const data = await res.json();
        const formatted = data.map((r) => ({
          ...r,
          fullName: r.user ? `${r.user.surname} ${r.user.name}` : "-",
          phone: r.user?.phone || "",
        }));
        setReports(formatted);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData(JSON.parse(JSON.stringify(vehicle)));
    setOriginalData(JSON.parse(JSON.stringify(vehicle)));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setFormData({});
    setOriginalData({});
    setIsModalOpen(false);
  };

  const setField = (path, value) => {
    if (!path.includes(".")) {
      setFormData((prev) => ({ ...prev, [path]: value }));
      return;
    }
    const keys = path.split(".");
    setFormData((prev) => {
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]] || typeof cur[keys[i]] !== "object")
          cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const getChangedFields = () => {
    const changed = {};
    const compare = (orig, current, prefix = "") => {
      Object.keys(current).forEach((key) => {
        const val = current[key];
        const origVal = orig ? orig[key] : undefined;

        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          compare(origVal, val, prefix ? `${prefix}.${key}` : key);
        } else if (val !== origVal) {
          changed[prefix ? `${prefix}.${key}` : key] = val ?? "";
        }
      });
    };
    compare(originalData, formData);
    changed.id = formData.id;
    return changed;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");
      if (!formData.id) throw new Error("Отсутствует id");

      const changedFields = getChangedFields();

      const query = new URLSearchParams();
      Object.entries(changedFields).forEach(([key, value]) => {
        query.append(key, value);
      });

      const res = await fetch(`${API_URL}/vehicle?${query.toString()}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка ${res.status}: ${text}`);
      }

      const updated = await res.json();
      const updatedWithHelpers = {
        ...updated,
        fullName: updated.user
          ? `${updated.user.surname} ${updated.user.name}`
          : "-",
        phone: updated.user?.phone || "",
      };

      setReports((prev) =>
        prev.map((r) => (r.id === updatedWithHelpers.id ? updatedWithHelpers : r))
      );

      closeModal();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card-light">
      <div className="errorreport-title">
        <FaCar /> Транспорт
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      {!loading && reports.length === 0 && <p>Нет данных</p>}

      {!loading && reports.length > 0 && (
        <UiTable
          data={reports}
          columns={[
            { header: "ID", render: (r) => r.id },
            {
              header: "Статус",
              render: (r) => (
                <>
                  <FaCircle
                    color={r.status === "Активна" ? "green" : "red"}
                  />{" "}
                  {r.status}
                </>
              ),
            },
            { header: "Тип", render: (r) => r.type || "-" },
            { header: "Название", render: (r) => r.name || r.brand || "-" },
            { header: "Номер", render: (r) => r.state_number || "-" },
            { header: "Водитель", render: (r) => r.fullName || "-" },
            { header: "Пробег", render: (r) => r.mileage ?? "-" },
            {
              header: "Глонасс",
              render: (r) =>
                r.glonass_id ? (
                  <FaCheck color="green" />
                ) : (
                  <FaTimes color="red" />
                ),
            },
          ]}
          onRowClick={(row) => openModal(row)} // 🔹 кликаем по строке
          rowStyle={{ cursor: "pointer" }}
        />
      )}

      {isModalOpen && selectedVehicle && (
        <UiModal
          title={`Транспорт #${selectedVehicle.id}`}
          onClose={closeModal}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            <label>
              Марка{" "}
              <input
                value={formData.brand ?? ""}
                onChange={(e) => setField("brand", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Название{" "}
              <input
                value={formData.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Гос. номер{" "}
              <input
                value={formData.state_number ?? ""}
                onChange={(e) => setField("state_number", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Тип{" "}
              <input
                value={formData.type ?? ""}
                onChange={(e) => setField("type", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Статус{" "}
              <input
                value={formData.status ?? ""}
                onChange={(e) => setField("status", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Glonass ID{" "}
              <input
                value={formData.glonass_id ?? ""}
                onChange={(e) => setField("glonass_id", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Пробег{" "}
              <input
                type="number"
                value={formData.mileage ?? ""}
                onChange={(e) =>
                  setField("mileage", e.target.value ? Number(e.target.value) : "")
                }
                className="filter-input"
              />
            </label>
            <label>
              Грузоподъемность{" "}
              <input
                type="number"
                value={formData.load_capacity ?? ""}
                onChange={(e) =>
                  setField(
                    "load_capacity",
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                className="filter-input"
              />
            </label>

            <label>
              Имя{" "}
              <input
                value={formData.user?.name ?? ""}
                onChange={(e) => setField("user.name", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Фамилия{" "}
              <input
                value={formData.user?.surname ?? ""}
                onChange={(e) => setField("user.surname", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Отчество{" "}
              <input
                value={formData.user?.patronymic ?? ""}
                onChange={(e) => setField("user.patronymic", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Телефон{" "}
              <input
                value={formData.user?.phone ?? ""}
                onChange={(e) => setField("user.phone", e.target.value)}
                className="filter-input"
              />
            </label>
            <label>
              Email{" "}
              <input
                value={formData.user?.email ?? ""}
                onChange={(e) => setField("user.email", e.target.value)}
                className="filter-input"
              />
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button onClick={closeModal} className="px-4 py-2 bg-gray-200">
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white"
              disabled={saving}
            >
              {saving ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>

          {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
        </UiModal>
      )}
    </div>
  );
}
