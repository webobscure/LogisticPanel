import React, { useEffect, useState } from "react";
import UiTable from "../ui/atoms/table";
import { FaCashRegister, FaCheck, FaTimes, FaCircle } from "react-icons/fa";
import UiTableButton from "../ui/atoms/button";

export default function ProbegTable() {
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState("2025-09-10");
  const [dateTo, setDateTo] = useState("2025-09-22");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const API_URL = "https://dlm-agent.ru/api/v1";

  const formatDate = (date, endOfDay = false) => {
    if (!date) return null;
    const d = new Date(date);
    if (endOfDay) {
      d.setHours(23, 59, 59, 999);
    } else {
      d.setHours(0, 0, 0, 0);
    }
    const iso = d.toISOString();
    const [datePart, timePart] = iso.replace("Z", "").split("T");
    const [hh, mm, ssMs] = timePart.split(":");
    const [ss, ms] = ssMs.split(".");
    return `${datePart}T${hh}:${mm}:${ss}.${ms.padEnd(6, "0")}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        const from = formatDate(dateFrom, false);
        const to = formatDate(dateTo, true);

        // 1. Загружаем список машин
        const vehiclesRes = await fetch(`${API_URL}/vehicle/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const vehicles = await vehiclesRes.json();

        // 2. Загружаем пробег по каждому glonass_id
        const allRows = [];

        for (const vehicle of vehicles) {
          if (!vehicle.glonass_id) continue;

          const mileageRes = await fetch(
            `${API_URL}/glonass/vehicle-mileage?vehicle_id=${vehicle.glonass_id}&from_datetime=${from}&to_datetime=${to}&sampling_interval=86400`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const mileageJson = await mileageRes.json();

          // mileageJson → [{ vehicleId, name, periods: [...] }]
          for (const item of mileageJson) {
            item.periods.forEach((period, i) => {
              allRows.push({
                id: `${i}`,
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

  const totalPages = Math.ceil(visibleData.length / perPage);
  const paginated = visibleData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="errorreport bg-card-light">
      <div className="errorreport-title">
        <FaCashRegister /> Пробег за период
      </div>

      <div className="filter-form user-form" style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="filter-input"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="filter-input"
        />
      </div>

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
                    <FaCircle color={r.status === "Активна" ? "green" : "red"} />{" "}
                    {r.status}
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
                render: (r) => (r.glonass_id ? <FaCheck /> : <FaTimes />),
              },
            ]}
            data={paginated}
          />
        )}

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
                            />
              </div>
      </div>
    </div>
  );
}
