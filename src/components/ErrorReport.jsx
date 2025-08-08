import React, { useState } from 'react'
import { FaCircle, FaImage, FaPhone } from 'react-icons/fa'
import { FiAlertTriangle } from 'react-icons/fi'

export default function ErrorReport() {
    const [reports, setReports] = useState([
        {
          id: 1,
          name: "Иванов Иван Иванович",
          datetime: "2024-01-15 14:30",
          photos: ["photo1.jpg", "photo2.jpg"],
          documents: ["report.pdf"],
          resolved: false,
        },
        {
          id: 2,
          name: "Петров Петр Петрович",
          datetime: "2024-01-15 16:45",
          photos: ["incident.jpg"],
          documents: ["insurance.docx", "statement.pdf"],
          resolved: false,
        },
        {
          id: 3,
          name: "Сидоров Сидор Сидорович",
          datetime: "2024-01-14 10:20",
          photos: [],
          documents: ["maintenance.pdf"],
          resolved: true,
        },
      ]);
    
      const [selectedPhotos, setSelectedPhotos] = useState([]);
      const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    
      const handleResolvedChange = (reportId, resolved) => {
        setReports((prev) =>
          prev.map((report) =>
            report.id === reportId ? { ...report, resolved } : report
          )
        );
      };
    
      const openPhotoGallery = (photos) => {
        if (photos && photos.length > 0) {
          setSelectedPhotos(photos);
          setCurrentPhotoIndex(0);
        }
      };
    
      const nextPhoto = () => {
        if (selectedPhotos.length > 0) {
          setCurrentPhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
        }
      };
    
      const prevPhoto = () => {
        if (selectedPhotos.length > 0) {
          setCurrentPhotoIndex(
            (prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length
          );
        }
      };
    
      const visibleReports = reports.filter((report) => report && !report.resolved);
  return (
    <div className="errorreport">
          <div className="errorreport-title">
            <FiAlertTriangle /> Заявки о проблеме
          </div>
          <div className="errorreport-table">
            <table
              border="1"
              cellPadding="8"
              style={{
                marginTop: 20,
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
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
                    <td><FaImage /> {report.photos.length} фото</td>
                    <td>{report.documents}</td>
                    <td>
                      <button><FaPhone /> Связаться</button>
                    </td>
                    <td><FaCircle /> Решено</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  )
}
