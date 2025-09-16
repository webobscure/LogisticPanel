import "./LogistPage.css";

import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import RacesToday from "../../components/tables/RacesToday";
import NavPanel from "../../components/ui/organisms/NavPanel";
import VehiclesTable from "../../components/tables/VehiclesTable";
import { Header } from "../../components/ui/molecules/Header";

export default function LogistPage() {
  const [donutSeries, setDonutSeries] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://dlm-agent.ru/api/v1";

  // ===== Кольцевая диаграмма =====
  const donutOptions = {
    chart: { toolbar: { show: false }, foreColor: "#000" },
    labels: ["Загружено", "Простой", "На СТО"],
    colors: ["#00E5FF", "#D57DFF", "#FF4B4B"],
    legend: { position: "bottom" },
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");
        const res = await fetch(`${API_URL}/logist-order/stats/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Ошибка загрузки статистики");
        const data = await res.json(); // массив заказов

        // считаем по статусам
        let loaded = 0;
        let idle = 0;
        let service = 0;

        data.forEach((order) => {
          if (order.status === "Открыт") {
            loaded++;
          } else if (order.status === "Простой") {
            idle++;
          } else if (order.status === "На СТО") {
            service++;
          }
        });

        setDonutSeries([loaded, idle, service]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const ChartBlock = () => (
    <div className="diagrams-item bg-card-light">
      <h3>Распределение ТС</h3>
      {loading ? (
        <div className="chart-loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <Chart
          options={donutOptions}
          series={donutSeries}
          type="donut"
          height={300}
        />
      )}
    </div>
  );

  return (
    <div className="admin-panel-container">
      <NavPanel />

      <div className="admin-panel-container__right">
        <Header title="Панель логиста" />
        <RacesToday />
        <VehiclesTable />

        <section className="diagrams">
          <ChartBlock />
          <ChartBlock />
        </section>
      </div>
    </div>
  );
}
