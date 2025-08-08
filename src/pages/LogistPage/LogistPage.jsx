import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Chart from "react-apexcharts";
import {
  FaTelegramPlane,
  FaWrench,
  FaUserCog,
  FaTimes,
  FaTimesCircle,
  FaClock,
  FaMapMarked,
  FaPlus,
  FaMap,
  FaPhone,
  FaCircle,
  FaImage,
} from "react-icons/fa";
import "./LogistPage.css";
import { FiAlertTriangle } from "react-icons/fi";
import ErrorReport from "../../components/ErrorReport";

export default function LogistPage() {
  // ===== Линейный график =====
  const lineOptions = {
    chart: { toolbar: { show: false }, foreColor: "#fff" },
    stroke: { curve: "smooth", width: 2 },
    grid: { borderColor: "rgba(255,255,255,0.1)" },
    xaxis: { categories: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] },
    colors: ["#00E5FF", "#D57DFF"],
    legend: { position: "top" },
  };
  const lineSeries = [
    {
      name: "Рейсы",
      data: [45, 52, 48, 58, 61, 43, 38],
    },
    { name: "Эффективность", data: [89, 92, 87, 94, 96, 85, 82] },
  ];

  // ===== Столбчатый график =====
  const barOptions = {
    chart: { toolbar: { show: false }, foreColor: "#fff" },
    plotOptions: { bar: { horizontal: false, columnWidth: "40%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Москва-СПб",
        "Москва-Казань",
        "СПб-Новгород",
        "Москва-Тула",
      ],
    },
    colors: ["#00E5FF"],
  };
  const barSeries = [{ name: "Эффективность", data: [94, 89, 97, 92] }];

  const detailsData = [
    {
      name: "Москва-СПб",
      races: 25,
      time: "8.5ч",
      rate: "94%",
    },
    {
      name: "Москва-Казань",
      races: 18,
      time: "12ч",
      rate: "89%",
    },
    {
      name: "СПб-Новгород",
      races: 15,
      time: "3.2ч",
      rate: "97%",
    },
    {
      name: "Москва-Тула",
      races: 22,
      time: "2.8ч",
      rate: "92%",
    },
  ];

  const [trips, setTrips] = useState([
    {
      id: 1,
      firstName: "Иван",
      lastName: "Иванов",
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
      firstName: "Петр",
      lastName: "Петров",
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
    {
      id: 3,
      firstName: "Сергей",
      lastName: "Сидоров",
      driver: "Сидоров С.С.",
      telegram: "@sidorov_driver",
      vehicle: "ТС-003",
      carNumber: "Г789ЕЖ",
      routeStart: "Москва",
      routeEnd: "Казань",
      route: "Москва → Казань",
      date: "2024-01-15",
      status: "проблемный",
      comment: "Требуется особое внимание",
      customerContacts: "+7 555 111 2233",
      loadingDateTime: "2024-01-15T10:15",
    },
  ]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const statuses = ["в пути", "ожидает", "проблемный"];

  // Обновляем статус конкретного рейса
  const handleStatusChange = (id, newStatus) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === id ? { ...trip, status: newStatus } : trip
      )
    );
  };

  // Закрыть попап
  const closeModal = () => setSelectedTrip(null);



  return (
    <div className="admin-panel-container">
      <Header />
      <div className="admin-panel-container__right">
        <div className="diagrams">
          {/* Линейный график */}
          <div className="diagrams-item">
            <h3>Динамика по месяцам</h3>
            <Chart
              options={lineOptions}
              series={lineSeries}
              type="line"
              height={300}
            />
          </div>

          {/* Столбчатый график */}
          <div className="diagrams-item">
            <h3>Эффективность водителей</h3>
            <Chart
              options={barOptions}
              series={barSeries}
              type="bar"
              height={300}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "20px",
            flexDirection: "column",
          }}
        >
          {/* Затраты */}
          <div className="card-container">
            <h3
              style={{
                color: "#0ff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaClock /> Детализация по маршрутам
            </h3>
            <div className="card-block four">
              {detailsData.map((d, i) => (
                <div key={i} className="card border-glow">
                  <div className="card-detail">
                    <div className="card-detail-title text-primary ">
                      {d.name}
                    </div>
                    <div className="card-detail-block">
                      <div className="card-detail-descr">
                        <span>Рейсы:</span>
                        <p>{d.races}</p>
                      </div>
                      <div className="card-detail-descr">
                        <span>Среднее время:</span>
                        <p>{d.time}</p>
                      </div>
                      <div className="card-detail-descr">
                        <span>Эффективность:</span>
                        <p className="text-primary">{d.rate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="racestoday">
          <div className="racestoday-block">
            <h1>
              <FaMap /> Рейсы на сегодня
            </h1>
            <button>
              <FaPlus /> Добавить новый рейс
            </button>
          </div>
          <div className="racestoday-filter">
            <h1>Фильтры по статусу</h1>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Все статусы</option>
              <option value="в пути">В пути</option>
              <option value="ожидает">Ожидает</option>
              <option value="проблемный">Проблемный</option>
            </select>
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
                <th>Статус</th>
                <th>Кнопка</th>
              </tr>
            </thead>
            <tbody>
              {trips
                .filter(
                  (trip) => statusFilter === "" || trip.status === statusFilter
                )
                .map((trip) => (
                  <tr key={trip.id}>
                    <td>{trip.driver}</td>
                    <td>{trip.vehicle}</td>
                    <td>{trip.route}</td>
                    <td>{trip.date}</td>
                    <td>
                      <select
                        value={trip.status}
                        onChange={(e) =>
                          handleStatusChange(trip.id, e.target.value)
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => setSelectedTrip(trip)}>
                        Информация
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Модальное окно с информацией */}
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
                onClick={(e) => e.stopPropagation()} // чтобы клик внутри не закрывал
              >
                <h3>Детали рейса</h3>
                <p>
                  <strong>Водитель:</strong> {selectedTrip.driver}
                </p>
                <p>
                  <strong>Телеграм:</strong> {selectedTrip.telegram}
                </p>
                <p>
                  <strong>ТС:</strong> {selectedTrip.vehicle} (
                  {selectedTrip.carNumber})
                </p>
                <p>
                  <strong>Маршрут:</strong> {selectedTrip.routeStart} →{" "}
                  {selectedTrip.routeEnd}
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
                  <strong>Контакты клиента:</strong>{" "}
                  {selectedTrip.customerContacts}
                </p>
                <p>
                  <strong>Дата и время загрузки:</strong>{" "}
                  {selectedTrip.loadingDateTime}
                </p>

                <button onClick={closeModal} style={{ marginTop: 10 }}>
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
        <ErrorReport />
      </div>
    </div>
  );
}
