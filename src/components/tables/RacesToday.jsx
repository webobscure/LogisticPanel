import React, { useState } from "react";
import { FaMap, FaPlus } from "react-icons/fa";
import UiSelect from "../ui/atoms/select";
import UiTable from "../ui/atoms/table";
import UiTableButton from "../ui/atoms/button";
import UiModal from "../ui/atoms/modal";

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
      prev.map((trip) =>
        trip.id === id ? { ...trip, status: newStatus } : trip
      )
    );
  };

  const closeModal = () => setSelectedTrip(null);

  // ВАЖНО: Отменяем дефолтное поведение формы
  const handleAddTrip = (e) => {
    e.preventDefault();

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
    <div className="racestoday bg-card-light">
      <div className="racestoday-block">
        <h1>
          <FaMap /> Рейсы на сегодня
        </h1>
        <UiTableButton
          label="Добавить ТО"
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
          { header: "Водитель", render: (t) => t.driver },
          { header: "ТС", render: (t) => t.vehicle },
          { header: "Маршрут", render: (t) => t.route },
          { header: "Дата", render: (t) => t.date },
          {
            header: "Статус",
            className: "table-status",
            render: (t) => (
              <UiSelect
                value={t.status}
                onChange={(val) => handleStatusChange(t.id, val)}
                placeholder="Выберите статус"
                options={statuses}
              />
            ),
          },
          {
            header: "Кнопка",
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
            <UiModal
              title="Добавить рейс"
              onClose={() => setIsAddTripDialogOpen(false)}
            >
              <form className="modal-form" onSubmit={handleAddTrip}>
                <input
                  type="text"
                  placeholder="Водитель"
                  value={newTrip.driver}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, driver: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Телеграм"
                  value={newTrip.telegram}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, telegram: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="ТС"
                  value={newTrip.vehicle}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, vehicle: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Госномер"
                  value={newTrip.carNumber}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, carNumber: e.target.value })
                  }
                />
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
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, date: e.target.value })
                  }
                  required
                />
                <input
                  type="datetime-local"
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
                />
                <button type="submit" className="ui-table-button">
                  Сохранить
                </button>
              </form>
            </UiModal>
          </div>
        </div>
      )}

      {/* Модальное окно информации */}
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
            label="Закрыть"
            onClick={closeModal}
            style={{ marginTop: 24, width: "100%" }}
          />
        </UiModal>
      )}
    </div>
  );
}
