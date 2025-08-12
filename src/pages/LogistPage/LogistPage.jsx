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
import ErrorReport from "../../components/tables/ErrorReport/ErrorReport";
import RacesToday from "../../components/tables/RacesToday";
import { TopBlock } from "../../components/ui/organisms/TopBlock";
import { InfoItem } from "../../components/ui/molecules/InfoItem";

export default function LogistPage() {
  // ===== Линейный график =====
  const lineOptions = {
    chart: { toolbar: { show: false }, foreColor: "#000" },
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
    chart: { toolbar: { show: false }, foreColor: "#000" },
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

  return (
    <div className="admin-panel-container">
      <Header />

      <div className="admin-panel-container__right">
        <TopBlock>
          <InfoItem 
            title='Активные рейсы' value='15'
            description='Сейчас в движении' 
            iconType='activeTrips' iconColor='green'
          />
          <InfoItem 
            title='На базе' value='8'
            description='Готовы к отправке' 
            iconType='based' iconColor='black'
          />
          <InfoItem 
            title='Проблемные' value='2'
            description='Требуют внимания' 
            iconType='issues' iconColor='red'
          />
        </TopBlock>

        <div className="diagrams ">
          {/* Линейный график */}
          <div className="diagrams-item bg-card-light">
            <h3>Динамика по месяцам</h3>
            <Chart
              options={lineOptions}
              series={lineSeries}
              type="line"
              height={300}
            />
          </div>

          {/* Столбчатый график */}
          <div className="diagrams-item bg-card-light">
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
            flexDirection: "column",
          }}
          className="bg-card-light"
        >
          {/* Затраты */}
          <div className="card-container  ">
            <h3
              style={{
                color: "#000",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaClock /> Детализация по маршрутам
            </h3>
            <div className="card-block four ">
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
        <RacesToday />
        <ErrorReport />
      </div>
    </div>
  );
}
