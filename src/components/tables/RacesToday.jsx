import { useState, useEffect } from "react";
import { FaMap } from "react-icons/fa";
import UiSelect from "../ui/atoms/select";
import UiTable from "../ui/atoms/table";
import UiTableButton from "../ui/atoms/button";
import UiModal from "../ui/atoms/modal";
import Loader from "../ui/molecules/Loader";

const API_URL = "https://dlm-agent.ru/api/v1";

export default function RacesToday() {
  const [statusFilter, setStatusFilter] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const statuses = [
    { value: "Открыт", label: "Открыт" },
    { value: "В пути", label: "В пути" },
    { value: "Загружен", label: "Загружен" },
    { value: "Закрыт", label: "Закрыт" },
  ];

  const handleTime = (t) => {
    if (!t) return "";
    const dt = new Date(t);
    return dt.toISOString().slice(0, 16);
  };

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");

      const res = await fetch(`${API_URL}/logist-order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${await res.text()}`);
      const data = await res.json();

      const formatted = data.map((trip) => ({
        id: trip.id,
        status: trip.status,
        time: `${trip.loading_time} → ${trip.unloading_time}`,
        route: `${trip.loading_city ?? "-"}, ${trip.loading_street ?? "-"} → ${
          trip.unloading_city ?? "-"
        }, ${trip.unloading_street ?? "-"}`,
        customerName: trip.customer_name,
        customerContacts: trip.customer_contacts,
        comment: trip.comments,
        price: trip.price,
        driverOrder: trip.driver_order,
        createdAt: trip.created_at,
        loadingCountry: trip.loading_country,
        loadingCity: trip.loading_city,
        loadingStreet: trip.loading_street,
        loadingTime: trip.loading_time,
        unloadingCountry: trip.unloading_country,
        unloadingCity: trip.unloading_city,
        unloadingStreet: trip.unloading_street,
        unloadingTime: trip.unloading_time,
        weight: trip.weight,
        height: trip.height,
        width: trip.width,
        length: trip.length,
        vehicleId: trip.vehicle_id,
        driverId: trip.driver_id,
      }));

      setTrips(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/vehicle/all?status=active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVehicles(
        data.map((v) => ({
          value: v.id,
          label: `${v.brand} (${v.state_number})`,
          driverId: v.driver_id,
        }))
      );
    } catch (err) {
      console.error("Ошибка загрузки машин", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/user/all?role=driver`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrivers(
        data.map((d) => ({
          value: d.id,
          label: `${d.surname} ${d.name} (${d.phone})`,
        }))
      );
    } catch (err) {
      console.error("Ошибка загрузки водителей", err);
    }
  };

  const openTripDetails = (trip) => {
    setSelectedTrip(trip);
    fetchVehicles();
    fetchDrivers();
  };

  const closeModal = () => setSelectedTrip(null);

  const handleFieldChange = (field, value) => {
    setSelectedTrip((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <div className="racestoday bg-card-light">
      <div className="racestoday-block">
        <h1>
          <FaMap /> Список заказов (рейсов)
        </h1>
      </div>

      <div className="racestoday-filter">
        <UiSelect
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Выберите статус"
          options={statuses}
          title="Фильтры по статусу"
        />
      </div>

      <UiTable
        columns={[
          { header: "Маршрут", render: (t) => t.route },
          { header: "Статус", render: (t) => t.status },
          {
            header: "Водитель",
            render: (t) =>
              t.driverOrder
                ? `ID:${t.driverOrder.driver_id} (${t.driverOrder.status})`
                : "-",
          },
          { header: "Заказчик", render: (t) => t.customerName },
          { header: "Контакты", render: (t) => t.customerContacts },
          { header: "Комментарий", render: (t) => t.comment },
          { header: "Цена", render: (t) => t.price },
        ]}
        data={trips.filter(
          (trip) => statusFilter === "" || trip.status === statusFilter
        )}
        onRowClick={(t) => openTripDetails(t)}
      />

      {selectedTrip && (
        <UiModal title={`Рейс #${selectedTrip.id}`} onClose={closeModal}>
          <div className="details-container">
            {/* Погрузка */}
            <div className="details-section">
              <h4>Погрузка</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>Страна</label>
                  <input
                    className="ui-input"
                    value={selectedTrip.loadingCountry || ""}
                    onChange={(e) =>
                      handleFieldChange("loadingCountry", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Город</label>
                  <input
                    className="ui-input"
                    value={selectedTrip.loadingCity || ""}
                    onChange={(e) =>
                      handleFieldChange("loadingCity", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Улица</label>
                  <input
                    className="ui-input"
                    value={selectedTrip.loadingStreet || ""}
                    onChange={(e) =>
                      handleFieldChange("loadingStreet", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Время погрузки</label>
                  <input
                    type="datetime-local"
                    className="ui-input"
                    value={handleTime(selectedTrip.loadingTime)}
                    onChange={(e) =>
                      handleFieldChange("loadingTime", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Разгрузка */}
            <div className="details-section">
              <h4>Разгрузка</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>Страна</label>
                  <input
                    className="ui-input"
                    value={selectedTrip.unloadingCountry || ""}
                    onChange={(e) =>
                      handleFieldChange("unloadingCountry", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Город</label>
                  <input
                    className="ui-input"
                    value={selectedTrip.unloadingCity || ""}
                    onChange={(e) =>
                      handleFieldChange("unloadingCity", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Улица</label>
                  <input
                    className="ui-input"
                    value={selectedTrip.unloadingStreet || ""}
                    onChange={(e) =>
                      handleFieldChange("unloadingStreet", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Время разгрузки</label>
                  <input
                    type="datetime-local"
                    className="ui-input"
                    value={handleTime(selectedTrip.unloadingTime)}
                    onChange={(e) =>
                      handleFieldChange("unloadingTime", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Груз */}
            <div className="details-section">
              <h4>Груз</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>Вес (кг)</label>
                  <input
                    type="number"
                    className="ui-input"
                    value={selectedTrip.weight || ""}
                    onChange={(e) =>
                      handleFieldChange("weight", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Высота (мм)</label>
                  <input
                    type="number"
                    className="ui-input"
                    value={selectedTrip.height || ""}
                    onChange={(e) =>
                      handleFieldChange("height", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Ширина (мм)</label>
                  <input
                    type="number"
                    className="ui-input"
                    value={selectedTrip.width || ""}
                    onChange={(e) => handleFieldChange("width", e.target.value)}
                  />
                </div>
                <div className="details-item">
                  <label>Длина (мм)</label>
                  <input
                    type="number"
                    className="ui-input"
                    value={selectedTrip.length || ""}
                    onChange={(e) =>
                      handleFieldChange("length", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Заказчик */}
            <div className="details-section">
              <h4>Заказчик</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>Имя клиента</label>
                  <input
                    className="ui-input"
                    value={selectedTrip.customerName || ""}
                    onChange={(e) =>
                      handleFieldChange("customerName", e.target.value)
                    }
                  />
                </div>
                <div className="details-item">
                  <label>Контакты клиента</label>
                  <input
                    className="ui-input"
                    value={selectedTrip.customerContacts || ""}
                    onChange={(e) =>
                      handleFieldChange("customerContacts", e.target.value)
                    }
                  />
                </div>
                <div className="details-item" style={{ gridColumn: "span 2" }}>
                  <label>Комментарий</label>
                  <textarea
                    className="ui-input"
                    value={selectedTrip.comment || ""}
                    onChange={(e) =>
                      handleFieldChange("comment", e.target.value)
                    }
                  />
                </div>
                <div className="details-item" style={{ gridColumn: "span 2" }}>
                  <label>Стоимость</label>
                  <input
                    type="number"
                    step="0.01"
                    className="ui-input"
                    value={selectedTrip.price || ""}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Назначение */}
            <div className="details-section">
              <h4>Назначение</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>Машина</label>
                  <UiSelect
                    value={selectedTrip.vehicleId}
                    onChange={(val) => {
                      const v = vehicles.find((x) => x.value === val);
                      handleFieldChange("vehicleId", val);
                      if (v?.driverId)
                        handleFieldChange("driverId", v.driverId);
                    }}
                    options={vehicles}
                    placeholder="Выберите машину"
                  />
                </div>
                <div className="details-item">
                  <label>Водитель</label>
                  <UiSelect
                    value={selectedTrip.driverId}
                    onChange={(val) => handleFieldChange("driverId", val)}
                    options={drivers}
                    placeholder="Выберите водителя"
                  />
                </div>
              </div>
            </div>

            <div className="actions">
              <UiTableButton
                className="save-button"
                label="Сохранить изменения"
                onClick={() => console.log("сохранен", selectedTrip)}
              />
              <UiTableButton
                className="accept-button"
                label="Подтвердить доставку и закрыть"
                onClick={() => console.log("закрыт", selectedTrip)}
              />
              <UiTableButton
                className="deny-button"
                label="Отменить заказ"
                onClick={() => console.log("отменен", selectedTrip)}
              />
            </div>
          </div>
        </UiModal>
      )}
    </div>
  );
}
