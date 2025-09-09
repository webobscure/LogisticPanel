import React, { useState, useEffect } from "react";
import { FaMap, FaPlus } from "react-icons/fa";
import UiSelect from "../ui/atoms/select";
import UiTable from "../ui/atoms/table";
import UiTableButton from "../ui/atoms/button";
import UiModal from "../ui/atoms/modal";
import Loader from "../ui/molecules/Loader";

const API_URL = "https://dlm-agent.ru/api/v1";

export default function RacesToday() {
  const [statusFilter, setStatusFilter] = useState("");
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);

  // Тут храним текущего пользователя
  const [currentUser, setCurrentUser] = useState({ role: "user" }); // пример, role может быть "admin"

  const [newTrip, setNewTrip] = useState({
    routeStart: "",
    routeEnd: "",
    date: "",
    status: "Открыт",
    comment: "",
    customerContacts: "",
    loadingDateTime: "",
    vehicleId: null,
    driverId: null,
  });

  const statuses = [
    { value: "Открыт", label: "Открыт" },
    { value: "В пути", label: "В пути" },
    { value: "Загружен", label: "Загружен" },
    { value: "Закрыт", label: "Закрыт" },
  ];
  const handleTime = (t) => {
    if (!t) return "-"; // <--- вот это решает проблему
    const dt = new Date(t);
    const day = String(dt.getDate()).padStart(2, "0");
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const year = dt.getFullYear();
    // const hours = String(dt.getHours()).padStart(2, "0");
    // const minutes = String(dt.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} `;
  };

  // 🚩 fetchAllOrders теперь не грузит водителей
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");

      const res = await fetch(`${API_URL}/logist-order/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${await res.text()}`);

      const data = await res.json();

      const formatted = data.map((trip) => ({
        id: trip.id,
        status: trip.status,
        // дата/время
        time: `${handleTime(trip.loading_time)} → ${handleTime(
          trip.unloading_time
        )}`,
        // маршрут
        route: `${trip.loading_city ?? "-"}, ${trip.loading_street ?? "-"} → ${
          trip.unloading_city ?? "-"
        }, ${trip.unloading_street ?? "-"}`,
        // заказчик
        customerName: trip.customer_name,
        customerContacts: trip.customer_contacts,
        // комментарии и цена
        comment: trip.comments,
        price: trip.price,
        // водитель (один, может быть null)
        driverOrder: trip.driver_order,
        // для детального просмотра
        loadingDateTime: trip.loading_time,
        unloadingDateTime: trip.unloading_time,
      }));

      setTrips(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Получаем подробности водителя
  const fetchDriverInfo = async (driverId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/user?id=${driverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      return data[0]; // API возвращает массив
    } catch (err) {
      console.error("Ошибка при загрузке водителя:", err);
      return null;
    }
  };

  // Получаем информацию о транспортном средстве
  const fetchVehicleInfo = async (vehicleId) => {
    if (!vehicleId) return null;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/vehicle?id=${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      return data[0];
    } catch (err) {
      console.error("Ошибка при загрузке ТС:", err);
      return null;
    }
  };

  // Загружаем детали рейса и водителей
  const openTripDetails = async (trip) => {
  try {
    // Нормализуем в массив
    const orders = Array.isArray(trip.driverOrders)
      ? trip.driverOrders
      : trip.driver_order
      ? [trip.driver_order]
      : [];

    const detailedDrivers = await Promise.all(
      orders.map(async (d) => {
        const driver = await fetchDriverInfo(d.driver_id);
        const vehicle = await fetchVehicleInfo(driver?.vehicles?.[0]?.id);

        return {
          id: d.id,
          driverId: d.driver_id,
          status: d.status,
          time: `${handleTime(d.loading_time)} → ${handleTime(
            d.unloading_time
          )}`,
          name: driver ? `${driver.surname} ${driver.name}` : "-",
          phone: driver?.phone || "-",
          telegram: driver?.telegram_nickname || "-",
          vehicle: vehicle?.brand || "-",
          carNumber: vehicle?.state_number || "-",
        };
      })
    );

    setSelectedTrip({ ...trip, drivers: detailedDrivers });
  } catch (err) {
    console.error("Ошибка при загрузке деталей рейса:", err);
  }
};


  useEffect(() => {
    fetchAllOrders();
    // Загружаем текущего пользователя
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  const closeModal = () => setSelectedTrip(null);

  // Загрузка списка машин
  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/vehicle/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка загрузки машин");
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      alert("Не удалось загрузить машины");
    }
  };

  const openAddTripModal = () => {
    fetchVehicles();
    setIsAddTripDialogOpen(true);
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const user_id = localStorage.getItem("currentUser");
      if (!token) throw new Error("Нет токена");

      if (
        !newTrip.routeStart ||
        !newTrip.routeEnd ||
        !newTrip.loadingDateTime ||
        !newTrip.date ||
        !newTrip.vehicleId
      ) {
        alert("Заполните все обязательные поля");
        return;
      }

      // Получаем водителя по выбранной машине
      const vehicle = vehicles.find((v) => v.id === newTrip.vehicleId);
      const driverId = vehicle?.driver_id;
      if (!driverId)
        throw new Error("Для выбранной машины не назначен водитель");

      const params = new URLSearchParams({
        user_id,
        status: newTrip.status,
        loading_time: newTrip.loadingDateTime + "T00:00:00",
        loading_address: newTrip.routeStart,
        unloading_time: newTrip.date + "T00:00:00",
        unloading_address: newTrip.routeEnd,
        customer_contacts: newTrip.customerContacts || "Не указано",
        comments: newTrip.comment || "",
        price: newTrip.price ? String(newTrip.price) : "0",
        vehicle_id: newTrip.vehicleId,
        driver_id: driverId,
      });

      const res = await fetch(`${API_URL}/logist-order?${params.toString()}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка ${res.status}: ${text}`);
      }

      await fetchAllOrders();
      setIsAddTripDialogOpen(false);
      setNewTrip({
        routeStart: "",
        routeEnd: "",
        date: "",
        loadingDateTime: "",
        status: "Открыт",
        comment: "",
        customerContacts: "",
        price: null,
        vehicleId: null,
        driverId: null,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <div className="racestoday bg-card-light">
      <div className="racestoday-block">
        <h1>
          <FaMap /> Рейсы на сегодня
        </h1>
        <UiTableButton
          label="Добавить рейс"
          icon={FaPlus}
          onClick={() => setIsAddTripDialogOpen(true)}
        />
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
          {
            header: "Действие",
            render: (t) => (
              <UiTableButton
                label="Информация"
                onClick={() => openTripDetails(t)}
              />
            ),
          },
        ]}
        data={trips.filter(
          (trip) => statusFilter === "" || trip.status === statusFilter
        )}
      />

      {isAddTripDialogOpen && (
        <UiModal
          title="Добавить рейс"
          onClose={() => setIsAddTripDialogOpen(false)}
        >
          <form className="modal-form" onSubmit={handleAddTrip}>
            <input
              type="text"
              placeholder="Начало маршрута"
              value={newTrip.routeStart}
              onChange={(e) =>
                setNewTrip({ ...newTrip, routeStart: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Конец маршрута"
              value={newTrip.routeEnd}
              onChange={(e) =>
                setNewTrip({ ...newTrip, routeEnd: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={newTrip.date}
              onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
              required
            />
            <input
              type="date"
              value={newTrip.loadingDateTime}
              onChange={(e) =>
                setNewTrip({ ...newTrip, loadingDateTime: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Комментарий"
              value={newTrip.comment}
              onChange={(e) =>
                setNewTrip({ ...newTrip, comment: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Контакты клиента"
              value={newTrip.customerContacts}
              onChange={(e) =>
                setNewTrip({ ...newTrip, customerContacts: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Цена"
              value={newTrip.price || ""}
              onChange={(e) =>
                setNewTrip({ ...newTrip, price: Number(e.target.value) })
              }
              required
            />

            <UiSelect
              options={vehicles.map((v) => ({
                value: v.id,
                label: `${v.brand} (${v.state_number})`,
              }))}
              value={newTrip.vehicleId}
              onChange={(val) => setNewTrip({ ...newTrip, vehicleId: val })}
              placeholder="Выберите ТС"
              required
            />

            <button type="submit">Сохранить</button>
          </form>
        </UiModal>
      )}

      {selectedTrip && (
        <UiModal title="Детали рейса" onClose={closeModal}>
          <div className="details-container">
             {selectedTrip.drivers?.length > 0 && (
              <section className="details-section">
                <h4 className="details-section-title">Детали водителя</h4>
                <div className="details-grid">
                  <div className="details-item">
                    <label>Водитель:</label>
                    <p>{selectedTrip.driver.name}</p>
                  </div>
                  <div className="details-item">
                    <label>Телефон:</label>
                    <p>{selectedTrip.driver.phone}</p>
                  </div>
                  <div className="details-item">
                    <label>Телеграм:</label>
                    <p>{selectedTrip.driver.telegram}</p>
                  </div>
                  <div className="details-item">
                    <label>ТС:</label>
                    <p>{selectedTrip.driver.vehicle}</p>
                  </div>
                  <div className="details-item">
                    <label>Номер машины:</label>
                    <p>{selectedTrip.driver.carNumber}</p>
                  </div>
                  <div className="details-item">
                    <label>Статус:</label>
                    <p>{selectedTrip.driver.status}</p>
                  </div>
                </div>
              </section>
            )}

            <section className="details-section">
              <h4 className="details-section-title">Детали рейса</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>Маршрут:</label>
                  <p>{selectedTrip.route}</p>
                </div>
                <div className="details-item">
                  <label>Дата:</label>
                  <p>{selectedTrip.time}</p>
                </div>
                <div className="details-item">
                  <label>Статус:</label>
                  <div className="status-badge">{selectedTrip.status}</div>
                </div>
                <div className="details-item">
                  <label>Комментарий:</label>
                  <p>{selectedTrip.comment}</p>
                </div>
              </div>
            </section>

            <section className="details-section">
              <h4 className="details-section-title">Детали заказчика</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>Имя клиента:</label>
                  <p>{selectedTrip.customerName}</p>
                </div>
                <div className="details-item">
                  <label>Контакты клиента:</label>
                  <p>{selectedTrip.customerContacts}</p>
                </div>
                <div className="details-item">
                  <label>Дата и время загрузки:</label>
                  <p>{handleTime(selectedTrip.loadingDateTime)}</p>
                </div>
              </div>
            </section>

            <UiTableButton
              label="Закрыть"
              onClick={closeModal}
              style={{ width: "100%", margin: "0 auto" }}
            />
          </div>
        </UiModal>
      )}
    </div>
  );
}
