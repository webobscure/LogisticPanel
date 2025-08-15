import React, { useState, useEffect } from "react";
import { FaMap, FaPlus } from "react-icons/fa";
import UiSelect from "../ui/atoms/select";
import UiTable from "../ui/atoms/table";
import UiTableButton from "../ui/atoms/button";
import UiModal from "../ui/atoms/modal";

const API_URL = "http://91.197.97.68:33333/api/v1";

export default function RacesToday() {
  const [statusFilter, setStatusFilter] = useState("");
  const [trips, setTrips] = useState([]);
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

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка ${res.status}: ${text}`);
      }

      const data = await res.json();

      const formatted = data.map((trip) => ({
        id: trip.id,
        status: trip.status,
        loadingTime: trip.loading_time,
        loadingAddress: trip.loading_address,
        unloadingTime: trip.unloading_time,
        unloadingAddress: trip.unloading_address,
        customerContacts: trip.customer_contacts,
        comments: trip.comments,
        price: trip.price,
        drivers: trip.driver_orders.map((d) => ({
          id: d.id,
          driverId: d.driver_id,
          status: d.status,
          createDt: d.create_dt,
          updateDt: d.update_dt,
        })),
        // Добавляем поля для модалки
        driver: trip.driver_name || "-",
        telegram: trip.driver_telegram || "-",
        vehicle: trip.vehicle_name || "-",
        carNumber: trip.car_number || "-",
        route: `${trip.loading_address ?? "-"} → ${trip.unloading_address ?? "-"}`,
        date: trip.date,
        comment: trip.comments,
        loadingDateTime: trip.loading_time,
      }));

      setTrips(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const user_id = localStorage.getItem("currentUser");
      if (!token) throw new Error("Нет токена");
  
      if (!newTrip.routeStart || !newTrip.routeEnd || !newTrip.loadingDateTime || !newTrip.date) {
        alert("Заполните все обязательные поля");
        return;
      }
  
      const params = new URLSearchParams({
        user_id, // или текущий пользователь
        status: newTrip.status || "Открыт",
        loading_time: newTrip.loadingDateTime + "T00:00:00",
        loading_address: newTrip.routeStart,
        unloading_time: newTrip.date + "T00:00:00",
        unloading_address: newTrip.routeEnd,
        customer_contacts: newTrip.customerContacts || "Не указано",
        comments: newTrip.comment || "",
        price: newTrip.price ? String(newTrip.price) : "0",
      });
  
      const res = await fetch(`${API_URL}/logist-order?${params.toString()}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        status: "Открыт",
        comment: "",
        customerContacts: "",
        loadingDateTime: "",
        price: null,
      });
    } catch (err) {
      alert(err.message);
    }
  };
  
  

  useEffect(() => {
    fetchAllOrders();
    // Загружаем текущего пользователя
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  const closeModal = () => setSelectedTrip(null);

  const handleStatusChange = (id, newStatus) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, status: newStatus } : trip
      )
    );
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Вы уверены, что хотите удалить рейс?")) return;
  
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");
  
      const res = await fetch(`${API_URL}/logist-order?order_id=${tripId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (res.status === 403) {
        throw new Error("У вас нет прав на удаление этого рейса");
      }
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка ${res.status}: ${text}`);
      }
  
      // Обновляем список рейсов после удаления
      await fetchAllOrders();
      setSelectedTrip(null);
      alert("Рейс успешно удалён");
    } catch (err) {
      alert(err.message);
    }
  };
  

  if (loading) return <p>Загрузка...</p>;
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
          {
            header: "Маршрут",
            render: (t) => t.route,
          },
          { header: "Статус", render: (t) => t.status },
          {
            header: "Водители",
            render: (t) =>
              t.drivers.map((d) => `ID:${d.driverId} (${d.status})`).join(", "),
          },
          { header: "Контакты", render: (t) => t.customerContacts },
          { header: "Комментарий", render: (t) => t.comment },
          { header: "Цена", render: (t) => t.price },
          {
            header: "Действие",
            render: (t) => (
              <UiTableButton
                label="Информация"
                onClick={() => setSelectedTrip(t)}
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
            <button type="submit">Сохранить</button>
          </form>
        </UiModal>
      )}

      {selectedTrip && (
        <UiModal title="Детали рейса" onClose={closeModal}>
          <div className="details-container">
            <section className="details-section">
              <h4 className="details-section-title">Детали водителя</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>Водитель:</label>
                  <p>{selectedTrip.driver}</p>
                </div>
                <div className="details-item">
                  <label>Телеграм:</label>
                  <p>{selectedTrip.telegram}</p>
                </div>
              </div>
            </section>

            <section className="details-section">
              <h4 className="details-section-title">Детали рейса</h4>
              <div className="details-grid">
                <div className="details-item">
                  <label>ТС:</label>
                  <p>{selectedTrip.vehicle}</p>
                </div>
                <div className="details-item">
                  <label>Номер машины:</label>
                  <p>{selectedTrip.carNumber}</p>
                </div>
                <div className="details-item">
                  <label>Маршрут:</label>
                  <p>{selectedTrip.route}</p>
                </div>
                <div className="details-item">
                  <label>Дата:</label>
                  <p>{selectedTrip.date}</p>
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
                  <label>Контакты клиента:</label>
                  <p>{selectedTrip.customerContacts}</p>
                </div>
                <div className="details-item">
                  <label>Дата и время загрузки:</label>
                  <p>{selectedTrip.loadingDateTime}</p>
                </div>
              </div>
            </section>
          </div>

            <UiTableButton
              label="Удалить рейс"
              onClick={() => handleDeleteTrip(selectedTrip.id)}
              style={{
                marginTop: 12,
                marginLeft: 15,
                backgroundColor: "#e74c3c",
                color: "#fff",
                width: "100%",
              }}
            />

          <UiTableButton
            label="Закрыть"
            onClick={closeModal}
            style={{ marginTop: 12, width: "100%" }}
          />
        </UiModal>
      )}
    </div>
  );
}
