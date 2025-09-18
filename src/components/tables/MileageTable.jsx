import React, { useEffect, useState } from "react"; 
import UiTable from "../ui/atoms/table";
import { FaCashRegister, FaCheck, FaTimes, FaCircle } from "react-icons/fa";
import UiTableButton from "../ui/atoms/button";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"; 

export default function MileageTable() {
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Используем Date объекты ---
  const [dateFrom, setDateFrom] = useState(new Date("2025-09-10"));
  const [dateTo, setDateTo] = useState(new Date("2025-09-22"));

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const API_URL = "https://dlm-agent.ru/api/v1";
  registerLocale("ru", ru);

  // --- Форматируем дату в YYYY-MM-DD ---
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // --- Загрузка данных ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        const from = formatDate(dateFrom);
        const to = formatDate(dateTo);

        // 1. Получаем список машин
        const vehiclesRes = await fetch(`${API_URL}/vehicle/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!vehiclesRes.ok) throw new Error("Ошибка загрузки машин");
        const vehicles = await vehiclesRes.json();

        // 2. Получаем пробег
        const allRows = [];
        let rowId = 0;
        for (const vehicle of vehicles) {
          if (!vehicle.glonass_id) continue;

          const mileageRes = await fetch(
            `${API_URL}/glonass/vehicle-mileage?glonass_id=${vehicle.glonass_id}&from_datetime=${from}&to_datetime=${to}&sampling_interval=86400`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!mileageRes.ok) continue;
          const mileageJson = await mileageRes.json();
          for (const item of mileageJson) {
            item.periods.forEach((period) => {
              allRows.push({
                id: `${rowId++}`,
                status: vehicle.status,
                type: vehicle.type,
                name: item.name || vehicle.brand || "-",
                state_number: vehicle.state_number || "-",
                driver: vehicle.user
                  ? `${vehicle.user.name} ${vehicle.user.surname}`
                  : "-",
                mileage: period.mileage,
                glonass_id: vehicle.glonass_id,
              });
            });
          }
        }

        setData(allRows);
        setVisibleData(allRows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateFrom, dateTo]);

  // --- Пагинация ---
  const totalPages = Math.ceil(visibleData.length / perPage);
  const paginated = visibleData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // --- Скачать Excel ---
  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");

      const from = formatDate(dateFrom);
      const to = formatDate(dateTo);
      const url = `${API_URL}/glonass/vehicle-mileage/excel?from_datetime=${from}&to_datetime=${to}`;

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка ${res.status}: ${text}`);
      }

      const blob = await res.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = "Пробег.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (err) {
      alert("Ошибка при скачивании Excel: " + err.message);
    }
  };

  return (
    <div className="errorreport bg-card-light">
      <div className="errorreport-title">
        <FaCashRegister /> Пробег за период
      </div>

      <div
        className="filter-form user-form"
        style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}
      >
        <DatePicker
          selected={dateFrom}
          onChange={(date) => setDateFrom(date)}
          selectsStart
          startDate={dateFrom}
          endDate={dateTo}
          placeholderText="С"
          dateFormat="dd.MM.yyyy"
          className="filter-input"
          locale="ru"
        />
        <DatePicker
          selected={dateTo}
          onChange={(date) => setDateTo(date)}
          selectsEnd
          startDate={dateFrom}
          endDate={dateTo}
          minDate={dateFrom}
          placeholderText="По"
          dateFormat="dd.MM.yyyy"
          className="filter-input"
          locale="ru"
        />
      </div>

      {/* --- Таблица --- */}
      <div className="errorreport-table">
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
        {!loading && paginated.length === 0 ? (
          <p>Нет данных</p>
        ) : (
          <UiTable
            columns={[
              { header: "ID", render: (r) => r.id },
              {
                header: "Статус",
                render: (r) => (
                  <>
                    <FaCircle color={r.status === "Активна" ? "green" : "red"} /> {r.status}
                  </>
                ),
              },
              { header: "Тип", render: (r) => r.type },
              { header: "Название", render: (r) => r.name },
              { header: "Номер", render: (r) => r.state_number },
              { header: "Водитель", render: (r) => r.driver },
              { header: "Пробег", render: (r) => r.mileage },
              {
                header: "Глонасс",
                render: (r) => (r.glonass_id ? <FaCheck color="green" /> : <FaTimes color="red" />),
              },
            ]}
            data={paginated}
          />
        )}

{ totalPages.length < 10 ? (
          <>
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
         <div className="button-top">
         <UiTableButton
           label="Скачать Excel"
           style={{ width: "100%", margin: "0 auto" }}
           onClick={downloadExcel}
         />
       </div>
          </>
        ) : ( 
        <div className="button-top">
          <UiTableButton
            label="Скачать Excel"
            style={{ width: "100%", margin: "0 auto" }}
            onClick={downloadExcel}
          />
        </div>) 
        }
      </div>
    </div>
  );
}
