import "./AdminPage.css";
import Chart from "react-apexcharts";
import { FaTelegramPlane, FaWrench, FaUserCog } from "react-icons/fa";

import { CardHeader } from "../../components/ui/atoms/cardHeader";
import { CardValue } from "../../components/ui/atoms/cardValue";
import { CardLabel } from "../../components/ui/atoms/cardLabel";
import { Card } from "../../components/ui/atoms/Card";
import Header from "../../components/Header/Header";
import { TotalWorkload } from "../../components/ui/molecules/TotalWorkload";
import { MonthlyIncome } from "../../components/ui/molecules/MonthlyIncome";
import { TotalEfficiency } from "../../components/ui/molecules/TotalEfficiency";
import { TopBlock } from "../../components/ui/organisms/TopBlock";

export default function AdminPage() {

  
  // ===== Линейный график =====
  const lineOptions = {
    chart: { toolbar: { show: false }, foreColor: "#fff" },
    stroke: { curve: "smooth", width: 2 },
    grid: { borderColor: "rgba(255,255,255,0.1)" },
    xaxis: { categories: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"] },
    colors: ["#00E5FF", "#D57DFF"],
    legend: { position: "top" },
  };
  const lineSeries = [
    {
      name: "Загружено",
      data: [900000, 980000, 1100000, 1020000, 1150000, 1180000],
    },
    { name: "Простой", data: [10000, 11000, 9000, 9500, 10500, 10000] },
  ];

  // ===== Кольцевая диаграмма =====
  const donutOptions = {
    chart: { toolbar: { show: false }, foreColor: "#fff" },
    labels: ["Загружено", "Простой", "На СТО"],
    colors: ["#00E5FF", "#D57DFF", "#FF4B4B"],
    legend: { position: "bottom" },
  };
  const donutSeries = [15, 5, 3];

  // ===== Столбчатый график =====
  const barOptions = {
    chart: { toolbar: { show: false }, foreColor: "#fff" },
    plotOptions: { bar: { horizontal: false, columnWidth: "40%" } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Иванов И.И.", "Петров П.П.", "Сидоров С.С.", "Козлов К.К."],
    },
    colors: ["#00E5FF"],
  };
  const barSeries = [{ name: "Эффективность", data: [95, 88, 96, 85] }];

  // ===== Данные для карточек =====
  const cars = [
    { id: "TC-001", km: 1250, income: 75000 },
    { id: "TC-002", km: 980, income: 58800 },
    { id: "TC-003", km: 900, income: 54000 },
  ];

  const maintenanceData = {
    lastMonth: 45000,
    avgExpenses: 38500,
  };

  const drivers = [
    { name: "Иванов Иван Иванович", trips: 12, rate: 5250, telegram: "#" },
    { name: "Петров Петр Петрович", trips: 15, rate: 4800, telegram: "#" },
    { name: "Сидоров Сидор Сидорович", trips: 10, rate: 5500, telegram: "#" },
  ];

  const mechanics = [
    {
      name: "Смирнов Алексей",
      to: 8,
      repairs: 5,
      time: "2ч 30мин",
      telegram: "#",
    },
    {
      name: "Козлов Дмитрий",
      to: 12,
      repairs: 3,
      time: "1ч 45мин",
      telegram: "#",
    },
  ];

  const titleStyle = {
    marginBottom: "15px",
    fontSize: "16px",
    fontWeight: "bold",
  };
  return (
    <> 
      <div className="admin-panel-container">
        <Header />
        <div className="admin-panel-container__right">
          <TopBlock />
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

            {/* Кольцевая диаграмма */}
            <div className="diagrams-item">
              <h3>Распределение ТС</h3>
              <Chart
                options={donutOptions}
                series={donutSeries}
                type="donut"
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

            {/* Карточки с данными */}
            <div className="diagrams-item">
              <h3 style={titleStyle}>Доходность по ТС</h3>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                {cars.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "#0F1620",
                      padding: "15px",
                      display: "flex",
                      justifyContent: "space-between",
                      borderRadius: "15px",
                      margin: "10px",
                    }}
                    className="border-glow"
                  >
                    <div className="diagrams-item__table">
                      <strong>{item.id}</strong>
                      <div className="diagrams-item__table-block">
                        <div className="flex-col">
                          Пробег:
                          <br /> {item.km} км
                        </div>
                        <div className="flex-col">
                          Доход:
                          <br /> {item.income.toLocaleString()} ₽
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ alignSelf: "baseline", color: "#00E5FF" }}
                      className="diagrams-item__table-rate"
                    >
                      60 ₽/км
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", padding: "20px", flexDirection:"column" }}>
            {/* Затраты */}
            <div
              className="card-container"
            >
               <h3
                  style={{
                    color: "#0ff",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaWrench /> Затраты на ТО/Ремонт
                </h3>
              <div className="card-block">
              <div className="card">
               
               <div style={{ fontSize: "28px", color: "#c77dff", textAlign: "center" }}>
                 {maintenanceData.lastMonth.toLocaleString()} ₽
               </div>
               <div style={{ fontSize: "14px", opacity: 0.7,  textAlign: "center" }}>
                 Последний месяц
               </div>
             </div>
             <div className="card">
               <div style={{ fontSize: "28px", color: "#c77dff",  textAlign: "center" }}>
                 {maintenanceData.avgExpenses.toLocaleString()} ₽
               </div>
               <div style={{ fontSize: "14px", opacity: 0.7,  textAlign: "center" }}>
                 Средние расходы
               </div>
             </div>
              </div>
            </div>

            {/* KPI блоки */}
            <div
             className="card-container kpi-container"
            >
              {/* Водители */}
              <div className="card">
                <h3
                  style={{
                    color: "#0ff",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaUserCog /> KPI водителей
                </h3>
                {drivers.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#1a1a1a",
                      padding: "10px",
                      borderRadius: "8px",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{d.name}</strong>
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        {d.trips} рейсов • {d.rate.toLocaleString()} ₽/рейс
                      </div>
                    </div>
                    <a
                      href={d.telegram}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: "#0ff2",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        textDecoration: "none",
                        color: "#fff",
                      }}
                    >
                      <FaTelegramPlane /> Telegram
                    </a>
                  </div>
                ))}
              </div>

              {/* Механики */}
              <div  className="card">
                <h3
                  style={{
                    color: "#0ff",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaWrench /> KPI механиков
                </h3>
                {mechanics.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#1a1a1a",
                      padding: "10px",
                      borderRadius: "8px",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{m.name}</strong>
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        ТО: {m.to} • Ремонты: {m.repairs} • {m.time}
                      </div>
                    </div>
                    <a
                      href={m.telegram}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: "#0ff2",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        textDecoration: "none",
                        color: "#fff",
                      }}
                    >
                      <FaTelegramPlane /> Telegram
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
