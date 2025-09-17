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

  // пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
          fullName: report.user
            ? `${report.user.surname} ${report.user.name}`
            : "-",
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

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  const visibleReports = reports.filter((report) => !report.resolved);

  // пагинация
  const totalPages = Math.ceil(visibleReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = visibleReports.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="errorreport bg-card-light logist-panel__bottom-item">
      <div className="errorreport-title">
        <FiAlertTriangle /> Заявки о проблеме
      </div>

      <div className="errorreport-table">
        {paginatedReports.length === 0 ? (
          <p>Нет новых заявок о проблемах</p>
        ) : (
          <UiTable
            data={paginatedReports}
            columns={[
              { header: "ID", render: (r) => r.id },
              { header: "Тип проблемы", render: (r) => r.report_type },
              {
                header: "Статус",
                render: (r) => (
                  <>
                    <FaCircle color={r.status ? "green" : "red"} />{" "}
                    {r.status || "Новая"}
                  </>
                ),
              },
              { header: "Заявитель", render: (r) => r.fullName || "Не назначен" },
              { header: "Ответственный", render: (r) => r.resolver || "Не назначен" },
            ]}
            onRowClick={(row) => openModal(row)}
            rowStyle={{ cursor: "pointer" }}
          />
        )}
      </div>

      {/* пагинация */}
      {totalPages > 1 && (
        <div className="pagination" style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "10px" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ⬅️ Назад
          </button>
          <span>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Вперёд ➡️
          </button>

          {/* выбор количества на страницу */}
          <label>
            Показывать по:{" "}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // сбрасываем на первую страницу
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
      )}

      {isModalOpen && selectedReport && (
        <UiModal title={`Заявка #${selectedReport.id}`} onClose={closeModal}>
          <div className="modal-section">
            <p>
              <b>Тип проблемы:</b> {selectedReport.report_type}
            </p>
            <p>
              <b>Статус:</b>{" "}
              <span
                className="status-indicator"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontWeight: 600,
                }}
              >
                <FaCircle color={selectedReport.status ? "green" : "red"} />
                {selectedReport.status || "Новая"}
              </span>
            </p>
          </div>

          <div className="modal-section">
            <p>
              <b>Заявитель:</b> {selectedReport.fullName || "Не назначен"}
            </p>
            {selectedReport.phone && (
              <a
                href={`https://t.me/${selectedReport.phone}`}
                target="_blank"
                rel="noreferrer"
                className="modal-link"
              >
                Telegram
              </a>
            )}
          </div>

          <div className="modal-section">
            <p>
              <b>Ответственный:</b> {selectedReport.resolver || "Не назначен"}
            </p>
            {selectedReport.resolver && (
              <a
                href={`https://t.me/${selectedReport.resolver}`}
                target="_blank"
                rel="noreferrer"
                className="modal-link"
              >
                Telegram
              </a>
            )}
          </div>

          <div className="modal-section">
            <p>
              <b>Сообщение:</b>
            </p>
            <p className="modal-message">{selectedReport.message}</p>
          </div>

          {selectedReport.photos?.length > 0 && (
            <div className="modal-section">
              <p>
                <b>Фото:</b>
              </p>
              <div className="modal-photos">
                {selectedReport.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`Фото ${i}`}
                    className="modal-photo"
                  />
                ))}
              </div>
            </div>
          )}

          {selectedReport.documents?.length > 0 && (
            <div className="modal-section">
              <p>
                <b>Документы:</b>
              </p>
              <ul className="modal-documents">
                {selectedReport.documents.map((doc, i) => (
                  <li key={i}>
                    <a href={doc.url} target="_blank" rel="noreferrer">
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </UiModal>
      )}
    </div>
  );
}
