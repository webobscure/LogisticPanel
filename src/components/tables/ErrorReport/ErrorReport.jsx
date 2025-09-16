import React, { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import UiTable from "../../ui/atoms/table";
import UiModal from "../../ui/atoms/modal";
import Loader from "../../ui/molecules/Loader";

const API_URL = "https://dlm-agent.ru/api/v1";

export default function ErrorReport() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
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
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();

        const formatted = data.map((report) => ({
          ...report,
          fullName: report.user ? `${report.user.surname} ${report.user.name}` : "-",
          phone: report.user?.phone || "-",
        }));
        setReports(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const handleStatusChange = (e) => {
    setSelectedReport({ ...selectedReport, status: e.target.value });
  };

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  const visibleReports = reports.filter((report) => !report.resolved);

  return (
    <div className="errorreport bg-card-light logist-panel__bottom-item">
      <div className="errorreport-title">
        <FiAlertTriangle /> Заявки о проблеме
      </div>

      <div className="errorreport-table">
        {visibleReports.length === 0 ? (
          <p>Нет новых заявок о проблемах</p>
        ) : (
          <UiTable
            data={visibleReports}
            columns={[
              {
                header: "ID",
                render: (r) => (
                  <div style={{ cursor: "pointer" }} onClick={() => openModal(r)}>
                    {r.id}
                  </div>
                ),
              },
              {
                header: "Тип проблемы",
                render: (r) => (
                  <div style={{ cursor: "pointer" }} onClick={() => openModal(r)}>
                    {r.report_type}
                  </div>
                ),
              },
              {
                header: "Статус",
                render: (r) => (
                  <div style={{ cursor: "pointer" }} onClick={() => openModal(r)}>
                    <FaCircle color={r.status ? "green" : "red"} /> {r.status}
                  </div>
                ),
              },
              {
                header: "Заявитель",
                render: (r) => (
                  <div style={{ cursor: "pointer" }} onClick={() => openModal(r)}>
                    {r.fullName || "Не назначен"}
                  </div>
                ),
              },
              {
                header: "Ответственный",
                render: (r) => (
                  <div style={{ cursor: "pointer" }} onClick={() => openModal(r)}>
                    {r.resolver || "Не назначен"}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      {isModalOpen && selectedReport && (
        <UiModal title={`Заявка #${selectedReport.id}`} onClose={closeModal}>
          <p><b>ID:</b> {selectedReport.id}</p>
          <p><b>Тип проблемы:</b> {selectedReport.report_type}</p>
          <p>
            <b>Статус:</b>{" "}
            <select value={selectedReport.status} onChange={handleStatusChange}>
              <option value="new">Новая</option>
              <option value="in_progress">В работе</option>
              <option value="resolved">Решена</option>
            </select>
          </p>
          <p>
            <b>Заявитель:</b> {selectedReport.fullName}{" "}
            {selectedReport.phone && (
              <a href={`https://t.me/${selectedReport.phone}`} target="_blank" rel="noreferrer">
                Telegram
              </a>
            )}
          </p>
          <p>
            <b>Ответственный:</b> {selectedReport.resolver}{" "}
            {selectedReport.resolver && (
              <a href={`https://t.me/${selectedReport.resolver}`} target="_blank" rel="noreferrer">
                Telegram
              </a>
            )}
          </p>
          <p><b>Сообщение:</b> {selectedReport.message}</p>

          {selectedReport.photos?.length > 0 && (
            <div>
              <p><b>Фото:</b></p>
              {selectedReport.photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Фото ${i}`}
                  style={{ width: "100%", marginBottom: 10 }}
                />
              ))}
            </div>
          )}

          {selectedReport.documents?.length > 0 && (
            <div>
              <p><b>Документы:</b></p>
              {selectedReport.documents.map((doc, i) => (
                <a key={i} href={doc.url} target="_blank" rel="noreferrer" style={{ display: "block" }}>
                  {doc.name}
                </a>
              ))}
            </div>
          )}
        </UiModal>
      )}
    </div>
  );
}
