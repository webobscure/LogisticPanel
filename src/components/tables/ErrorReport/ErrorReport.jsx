import React, { useState, useEffect } from "react";
import { FaCircle, FaImage, FaPhone } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import UiTable from "../../ui/atoms/table";
import UiTableButton from "../../ui/atoms/button";
import UiModal from "../../ui/atoms/modal";

const API_URL = "https://dlm-agent.ru/api/v1";

export default function ErrorReport() {
  const [reports, setReports] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Нет токена");

        const res = await fetch(`${API_URL}/report/all`, {
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
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const openPhotoGallery = (photos) => {
    if (photos.length > 0) {
      setSelectedPhotos(photos);
      setCurrentPhotoIndex(0);
      setIsModalOpen(true);
    }
  };

  const nextPhoto = () =>
    setCurrentPhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
  const prevPhoto = () =>
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length
    );
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhotos([]);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  const visibleReports = reports.filter((report) => !report.resolved);

  return (
    <div className="errorreport bg-card-light">
      <div className="errorreport-title">
        <FiAlertTriangle /> Заявки о проблеме
      </div>

      <div className="errorreport-table">
        {visibleReports.length === 0 ? (
          <p>Нет новых заявок о проблемах</p>
        ) : (
          <UiTable
            columns={[
              { header: "ФИО", render: (r) => r.name || "Василий Пупкин" },
              { header: "Дата и время", render: (r) => r.create_dt },
              {
                header: "Фотографии",
                render: (r) => (
                  <UiTableButton
                    label={`${r.images.length} фото`}
                    onClick={() => openPhotoGallery(r.photos)}
                    icon={FaImage}
                  />
                ),
              },
              { header: "Документы", render: (r) => r.documents?.join(", ") || "Справка.doc" },
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
                render: (r) => (
                  <>
                    <FaCircle color={r.resolved ? "green" : "red"} />{" "}
                    {r.resolved ? "Решено" : "Не решено"}
                  </>
                ),
              },
            ]}
            data={visibleReports}
          />
        )}
      </div>

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
