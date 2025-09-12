import "./AdminPage.css";
import Chart from "react-apexcharts";
import { FaTelegramPlane, FaWrench, FaUserCog } from "react-icons/fa";

import { TopBlock } from "../../components/ui/organisms/TopBlock";
import { TotalWorkload } from "../../components/ui/molecules/TotalWorkload";
import { InfoItem } from "../../components/ui/molecules/InfoItem";
import UiTableButton from "../../components/ui/atoms/button";
import NavPanel from "../../components/ui/organisms/NavPanel";
import { Header } from "../../components/ui/molecules/Header";
import ErrorReport from "../../components/tables/ErrorReport/ErrorReport";
import UsersTable from "../../components/tables/UsersTable";
import VehiclesTable from "../../components/tables/VehiclesTable";
import UsersSalaryTable from "../../components/tables/UsersSalaryTable";
import DriversSalaryTable from "../../components/tables/DriversSalaryTable";
import ProbegTable from "../../components/tables/ProbegTable";

export default function AdminPage() {
  // ===== Линейный график =====
  const lineOptions = {
    chart: { toolbar: { show: false }, foreColor: "#000" },
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
    chart: { toolbar: { show: false }, foreColor: "#000" },
    labels: ["Загружено", "Простой", "На СТО"],
    colors: ["#00E5FF", "#D57DFF", "#FF4B4B"],
    legend: { position: "bottom" },
  };
  const donutSeries = [15, 5, 3];

  // ===== Столбчатый график =====
  const barOptions = {
    chart: { toolbar: { show: false }, foreColor: "#000" },
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
        <NavPanel />

        <div className="admin-panel-container__right">
          <Header title="Панель руководителя" />
          <UsersTable />
          <VehiclesTable />
          <ErrorReport />
          <UsersSalaryTable />
          <DriversSalaryTable />
          <ProbegTable />
          {/* <TopBlock>
            <TotalWorkload />
            <InfoItem
              title="Месячный доход"
              value="1.2М"
              text="₽"
              description="+12% к прошлому месяцу"
              iconType="income"
              iconColor="gold"
            />
            <InfoItem
              title="Эффективность"
              value="92"
              text="%"
              description="Средняя по парку"
              iconType="efficiency"
              iconColor="violet"
            />
          </TopBlock>
          <div className="diagrams">
            <div className="diagrams-item bg-card-light">
              <h3>Динамика по месяцам</h3>
              <Chart
                options={lineOptions}
                series={lineSeries}
                type="line"
                height={300}
              />
            </div>

            <div className="diagrams-item  bg-card-light">
              <h3>Распределение ТС</h3>
              <Chart
                options={donutOptions}
                series={donutSeries}
                type="donut"
                height={300}
              />
            </div>

            <div className="diagrams-item  bg-card-light">
              <h3>Эффективность водителей</h3>
              <Chart
                options={barOptions}
                series={barSeries}
                type="bar"
                height={300}
              />
            </div>

            <section className="diagrams-item bg-card-light">
              <h3>Доходность по ТС</h3>
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
                      padding: "15px",
                      borderRadius: "15px",
                      margin: "10px",
                    }}
                    className="bg-card-light"
                  >
                    <div 
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px"
                      }}
                    >
                      <strong>{item.id}</strong>
                      <span style={{ color: "#00E5FF" }}>60 ₽/км</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <div style={{ textAlign: "left" }}>
                        <div>Пробег:</div>
                        <div className="income-card__km">{item.km} км</div>
                      </div>

                      <div style={{ textAlign: "left", marginLeft: "auto" }}>
                        <div>Доход:</div>
                        <div className="income-card__income">{item.income.toLocaleString()} ₽</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              padding: "20px",
              flexDirection: "column",
            }}
          >
            <div className="card-container">
              <h3
                style={{
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaWrench /> Затраты на ТО/Ремонт
              </h3>
              <div className="card-block">
                <div className="card">
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 'bold',
                      color: "#1c1d59ff",
                      textAlign: "center",
                    }}
                  >
                    {maintenanceData.lastMonth.toLocaleString()} ₽
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      opacity: 0.7,
                      textAlign: "center",
                    }}
                  >
                    Последний месяц
                  </div>
                </div>
                <div className="card">
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 'bold',
                      color: "#1c1d59ff",
                      textAlign: "center",
                    }}
                  >
                    {maintenanceData.avgExpenses.toLocaleString()} ₽
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      opacity: 0.7,
                      textAlign: "center",
                    }}
                  >
                    Средние расходы
                  </div>
                </div>
              </div>
            </div>

            <div className="card-container">
              <h3
                style={{
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaUserCog /> KPI сотрудников
              </h3>
            <div className="card-container kpi-container">
              <div className="card ">
                <h3
                  style={{
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaUserCog /> Водители
                </h3>
                {drivers.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className="bg-card-light "
                  >
                    <div>
                      <strong>{d.name}</strong>
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        {d.trips} рейсов • {d.rate.toLocaleString()} ₽/рейс
                      </div>
                    </div>
                    <UiTableButton
                      label="Telegram"
                      icon={FaTelegramPlane}
                      href={d.telegram}
                    />
                  </div>
                ))}
              </div>

              <div className="card">
                <h3
                  style={{
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaWrench /> Механики
                </h3>
                {mechanics.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className="bg-card-light "
                  >
                    <div>
                      <strong>{m.name}</strong>
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        ТО: {m.to} • Ремонты: {m.repairs} • {m.time}
                      </div>
                    </div>
                    <UiTableButton
                      label="Telegram"
                      icon={FaTelegramPlane}
                      href={m.telegram}
                    />
                  </div>
                ))}
              </div>
              
            </div>
            </div>
          </div>
           */}
        </div>
      </div>
    </>
  );
}
