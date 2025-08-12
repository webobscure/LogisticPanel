import React, { useState } from "react";
import { FaCircle, FaImage, FaPhone } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import "./ErrorReport.css"; // Подключаем стили
import UiTable from "../../ui/atoms/table";
import UiTableButton from "../../ui/atoms/button";
import UiModal from "../../ui/atoms/modal";

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
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length
    );
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
        <UiTable
          columns={[
            { header: "ФИО", render: (r) => r.name },
            { header: "Дата и время", render: (r) => r.datetime },
            {
              header: "Фотографии",
              render: (r) => (
                <UiTableButton
                  label={`${r.photos.length} фото`}
                  onClick={() => openPhotoGallery(r.photos)}
                  icon={FaImage}
                />
              ),
            },
            { header: "Документы", render: (r) => r.documents.join(", ") },
            {
              header: "Действия",
              render: (r) => (
                <UiTableButton
                  label="Связаться"
                  icon={FaPhone}
                  href={`tel:${r.phone}`}
                />
              ),
            },
            {
              header: "Статус",
              render: () => (
                <>
                  <FaCircle color="red" /> Не решено
                </>
              ),
            },
          ]}
          data={visibleReports}
        />
      </div>

      {/* Модалка для фото */}
      {isModalOpen && (
        <UiModal title="Фотографии" onClose={closeModal}>
          <img
            src={selectedPhotos[currentPhotoIndex]}
            alt="Фото"
            className="modal-photo"
          />
          <div className="modal-controls">
            <UiTableButton label="Назад" onClick={prevPhoto} />
            <UiTableButton label="Вперёд" onClick={nextPhoto} />
          </div>
        </UiModal>
      )}
    </div>
  );
}
