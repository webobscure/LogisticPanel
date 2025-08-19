import React, { useState, useEffect } from "react";
import { FaCircle, FaImage, FaPhone } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import UiTable from "../../ui/atoms/table";
import UiTableButton from "../../ui/atoms/button";
import UiModal from "../../ui/atoms/modal";
import Loader from "../../ui/molecules/Loader";

const API_URL = "https://dlm-agent.ru/api/v1";

export default function ErrorReport() {
  const [reports, setReports] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Получаем ФИО пользователя по ID
  const fetchUserInfo = async (userId) => {
    if (!userId) return "-";
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/user?id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      const data = await res.json();
      const user = data[0];
      return user ? `${user.surname} ${user.name}` : "-";
    } catch (err) {
      console.error("Ошибка при загрузке пользователя:", err);
      return "-";
    }
  };

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

        // Добавляем полное имя пользователя
        const formatted = data.map((report) => {
          const fullName = report.user
            ? `${report.user.surname} ${report.user.name}`
            : "-";
          const phone = report.user.phone
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

  const openPhotoGallery = (photos) => {
    if (photos?.length > 0) {
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

  if (loading) return <Loader />;
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
              { header: "ФИО", render: (r) => r.fullName || "-" },
              {
                header: "Дата и время",
                render: (r) => {
                  const dt = new Date(r.create_dt);
                  const day = String(dt.getDate()).padStart(2, "0");
                  const month = String(dt.getMonth() + 1).padStart(2, "0");
                  const year = dt.getFullYear();
                  const hours = String(dt.getHours()).padStart(2, "0");
                  const minutes = String(dt.getMinutes()).padStart(2, "0");
                  return `${day}.${month}.${year} ${hours}:${minutes}`;
                },
              },
              {
                header: "Фотографии",
                render: (r) => (
                  <UiTableButton
                    label={`${r.images?.length || 0} фото`}
                    onClick={() => openPhotoGallery(r.images || [])}
                    icon={FaImage}
                  />
                ),
              },
              {
                header: "Документы",
                render: (r) => r.documents?.join(", ") || "-",
              },
              {
                header: "Действия",
                render: (r) => (
                  <UiTableButton
                    label="Связаться"
                    icon={FaPhone}
                    href={`tel:${r.user?.phone}`}
                  />
                ),
              },
              {
                header: "Статус",
                render: (r) => (
                  <>
                    <FaCircle color={r.status ? "green" : "red"} />{" "}
                    {r.status }
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
