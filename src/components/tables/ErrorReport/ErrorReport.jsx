import React, { useState } from "react";
import { FaCircle, FaImage, FaPhone } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import "./ErrorReport.css"; // Подключаем стили

export default function ErrorReport() {
  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Иванов Иван Иванович",
      datetime: "2024-01-15 14:30",
      photos: ["photo1.jpg", "photo2.jpg"],
      documents: ["report.pdf"],
      resolved: false,
      phone: "+79998887766",
    },
    {
      id: 2,
      name: "Петров Петр Петрович",
      datetime: "2024-01-15 16:45",
      photos: ["incident.jpg"],
      documents: ["insurance.docx", "statement.pdf"],
      resolved: false,
      phone: "+79997776655",
    },
    {
      id: 3,
      name: "Сидоров Сидор Сидорович",
      datetime: "2024-01-14 10:20",
      photos: [],
      documents: ["maintenance.pdf"],
      resolved: true,
      phone: "+79996665544",
    },
  ]);

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPhotoGallery = (photos) => {
    if (photos.length > 0) {
      setSelectedPhotos(photos);
      setCurrentPhotoIndex(0);
      setIsModalOpen(true);
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhotos([]);
  };

  const visibleReports = reports.filter((report) => !report.resolved);

  return (
    <div className="errorreport bg-card-light">
      <div className="errorreport-title">
        <FiAlertTriangle /> Заявки о проблеме
      </div>
      <div className="errorreport-table">
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Дата и время</th>
              <th>Фотографии</th>
              <th>Документы</th>
              <th>Действия</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {visibleReports.map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.datetime}</td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => openPhotoGallery(report.photos)}
                  >
                    <FaImage /> {report.photos.length} фото
                  </button>
                </td>
                <td>{report.documents.join(", ")}</td>
                <td>
                  <a className="btn-primary" href={`tel:${report.phone}`}>
                    <FaPhone /> Связаться
                  </a>
                </td>
                <td>
                  <FaCircle color="red" /> Не решено
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка для фото */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Фотографии</h3>
            <img
              src={selectedPhotos[currentPhotoIndex]}
              alt="Фото"
              className="modal-photo"
            />
            <div className="modal-controls">
              <button onClick={prevPhoto}>Назад</button>
              <button onClick={nextPhoto}>Вперёд</button>
            </div>
            <button className="modal-close" onClick={closeModal}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
