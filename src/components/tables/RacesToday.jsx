import React, { useState } from "react";
import { FaMap, FaPlus } from "react-icons/fa";
import UiSelect from "../ui/atoms/select";

export default function RacesToday() {
  const [statusFilter, setStatusFilter] = useState("");
  const [trips, setTrips] = useState([
    {
      id: 1,
      driver: "Иванов И.И.",
      telegram: "@ivanov_driver",
      vehicle: "ТС-001",
      carNumber: "А123БВ",
      routeStart: "Москва",
      routeEnd: "Спб",
      route: "Москва → Спб",
      date: "2024-01-15",
      status: "в пути",
      comment: "Обычный рейс",
      customerContacts: "+7 123 456 7890",
      loadingDateTime: "2024-01-15T08:00",
    },
    {
      id: 2,
      driver: "Петров П.П.",
      telegram: "@petrov_driver",
      vehicle: "ТС-002",
      carNumber: "В456ГД",
      routeStart: "Спб",
      routeEnd: "Москва",
      route: "Спб → Москва",
      date: "2024-01-15",
      status: "ожидает",
      comment: "Срочная доставка",
      customerContacts: "+7 098 765 4321",
      loadingDateTime: "2024-01-15T14:30",
    },
  ]);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);

  const [newTrip, setNewTrip] = useState({
    driver: "",
    telegram: "",
    vehicle: "",
    carNumber: "",
    routeStart: "",
    routeEnd: "",
    date: "",
    status: "ожидает",
    comment: "",
    customerContacts: "",
    loadingDateTime: "",
  });

  const statuses = [
    { value: "в пути", label: "В пути" },
    { value: "ожидает", label: "В ожидании" },
    { value: "проблемный", label: "Проблемный" },
  ];

  const handleStatusChange = (id, newStatus) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === id ? { ...trip, status: newStatus } : trip))
    );
  };

  const closeModal = () => setSelectedTrip(null);

  const handleAddTrip = () => {
    if (
      newTrip.driver.trim() &&
      newTrip.vehicle.trim() &&
      newTrip.routeStart.trim() &&
      newTrip.routeEnd.trim() &&
      newTrip.date.trim()
    ) {
      const maxId = trips.length > 0 ? Math.max(...trips.map((t) => t.id)) : 0;
      const trip = {
        id: maxId + 1,
        ...newTrip,
        route: `${newTrip.routeStart} → ${newTrip.routeEnd}`,
      };
      setTrips([...trips, trip]);
      setIsAddTripDialogOpen(false);
      setNewTrip({
        driver: "",
        telegram: "",
        vehicle: "",
        carNumber: "",
        routeStart: "",
        routeEnd: "",
        date: "",
        status: "ожидает",
        comment: "",
        customerContacts: "",
        loadingDateTime: "",
      });
    }
  };

  return (
    <div className="racestoday bg-card-light ">
      <div className="racestoday-block">
        <h1>
          <FaMap /> Рейсы на сегодня
        </h1>
        <button onClick={() => setIsAddTripDialogOpen(true)}>
          <FaPlus /> Добавить новый рейс
        </button>
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

      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Водитель</th>
            <th>ТС</th>
            <th>Маршрут</th>
            <th>Дата</th>
            <th className="table-status">Статус</th>
            <th>Кнопка</th>
          </tr>
        </thead>
        <tbody>
          {trips
            .filter((trip) => statusFilter === "" || trip.status === statusFilter)
            .map((trip) => (
              <tr key={trip.id}>
                <td>{trip.driver}</td>
                <td>{trip.vehicle}</td>
                <td>{trip.route}</td>
                <td>{trip.date}</td>
                <td className="table-status">
                   <UiSelect
          value={trip.status}
          onChange={(e) => handleStatusChange(trip.id, e.target.value)}
          placeholder="Выберите статус"
          options={statuses}
        />
                 
                </td>
                <td>
                  <button onClick={() => setSelectedTrip(trip)}>Информация</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Модалка добавления рейса */}
      {isAddTripDialogOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsAddTripDialogOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
              minWidth: 400,
              maxWidth: "90%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Добавить новый рейс</h3>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              <input
                type="text"
                placeholder="Водитель"
                value={newTrip.driver}
                onChange={(e) => setNewTrip({ ...newTrip, driver: e.target.value })}
              />
              <input
                type="text"
                placeholder="Телеграм"
                value={newTrip.telegram}
                onChange={(e) => setNewTrip({ ...newTrip, telegram: e.target.value })}
              />
              <input
                type="text"
                placeholder="ТС"
                value={newTrip.vehicle}
                onChange={(e) => setNewTrip({ ...newTrip, vehicle: e.target.value })}
              />
              <input
                type="text"
                placeholder="Госномер"
                value={newTrip.carNumber}
                onChange={(e) => setNewTrip({ ...newTrip, carNumber: e.target.value })}
              />
              <input
                type="text"
                placeholder="Начало маршрута"
                value={newTrip.routeStart}
                onChange={(e) => setNewTrip({ ...newTrip, routeStart: e.target.value })}
              />
              <input
                type="text"
                placeholder="Конец маршрута"
                value={newTrip.routeEnd}
                onChange={(e) => setNewTrip({ ...newTrip, routeEnd: e.target.value })}
              />
              <input
                type="date"
                value={newTrip.date}
                onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
              />
              <input
                type="datetime-local"
                value={newTrip.loadingDateTime}
                onChange={(e) => setNewTrip({ ...newTrip, loadingDateTime: e.target.value })}
              />
              <textarea
                placeholder="Комментарий"
                value={newTrip.comment}
                onChange={(e) => setNewTrip({ ...newTrip, comment: e.target.value })}
              />
              <input
                type="text"
                placeholder="Контакты клиента"
                value={newTrip.customerContacts}
                onChange={(e) => setNewTrip({ ...newTrip, customerContacts: e.target.value })}
              />
            </div>

            <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
              <button onClick={handleAddTrip}>Добавить</button>
              <button onClick={() => setIsAddTripDialogOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно информации */}
      {selectedTrip && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 8,
              minWidth: 300,
              maxWidth: "90%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Детали рейса</h3>
            <p>
              <strong>Водитель:</strong> {selectedTrip.driver}
            </p>
            <p>
              <strong>Телеграм:</strong> {selectedTrip.telegram}
            </p>
            <p>
              <strong>ТС:</strong> {selectedTrip.vehicle} ({selectedTrip.carNumber})
            </p>
            <p>
              <strong>Маршрут:</strong> {selectedTrip.route}
            </p>
            <p>
              <strong>Дата:</strong> {selectedTrip.date}
            </p>
            <p>
              <strong>Статус:</strong> {selectedTrip.status}
            </p>
            <p>
              <strong>Комментарий:</strong> {selectedTrip.comment}
            </p>
            <p>
              <strong>Контакты клиента:</strong> {selectedTrip.customerContacts}
            </p>
            <p>
              <strong>Дата и время загрузки:</strong> {selectedTrip.loadingDateTime}
            </p>

            <button onClick={closeModal} style={{ marginTop: 10 }}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
