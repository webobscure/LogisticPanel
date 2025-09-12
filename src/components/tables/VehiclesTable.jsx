import React, { useEffect, useState } from "react";
import UiTable from "../ui/atoms/table";
import { FiAlertTriangle } from "react-icons/fi";
import { FaCar, FaCheck, FaCircle, FaTimes } from "react-icons/fa";

export default function VehiclesTable() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://dlm-agent.ru/api/v1";

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        const res = await fetch(`${API_URL}/vehicle/all`, {
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

        // Добавляем полное имя пользователя
        const formatted = data.map((report) => {
          const fullName = report.user
            ? `${report.user.surname} ${report.user.name}`
            : "-";
          const phone = report.user.phone;
          return { ...report, fullName, phone };
        });
        setReports(formatted);

        setReports(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const visibleVehicles = reports.filter((report) => !report.resolved);
  return (
    <div className="errorreport bg-card-light">
      <div className="errorreport-title">
        <FaCar /> Список машин
      </div>

      <div className="errorreport-table">
        {visibleVehicles.length === 0 ? (
          <p>Нет новых заявок о проблемах</p>
        ) : (
          <UiTable
            columns={[
              { header: "ID", render: (r) => r.id },
              {
                header: "Статус",
                render: (r) => (
                  <>
                    <FaCircle color={r.status ? "green" : "red"} /> {r.status}
                  </>
                ),
              },
              { header: "Тип ", render: (r) => r.type },
              { header: "Название ", render: (r) => r.name || "-" },
              { header: "Номер", render: (r) => r.state_number || "-" },
              {
                header: "Водитель",
                render: (r) => r.fullName || "Не назначен",
              },
              { header: "Пробег", render: (r) => r.mileage || "0" },
              { header: "Глонасс", render: (r) => r.glonass_id ? <FaCheck /> : <FaTimes />  },

            ]}
            data={visibleVehicles}
          />
        )}
      </div>
    </div>
  );
}
