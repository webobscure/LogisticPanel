import React, { useState } from "react";
import UiSelect from "../../ui/atoms/select";
import "./PlanTO.css";

export default function PlanTO() {
  const [scheduledMaintenance, setScheduledMaintenance] = useState([
    {
      id: 1,
      vehicle: "ТС-004",
      carNumber: "З012ИК",
      date: "2024-01-16",
      type: "Плановое ТО-1: проверка жидкостей, тормозов",
      status: "назначено",
    },
    {
      id: 2,
      vehicle: "ТС-005",
      carNumber: "Л345МН",
      date: "2024-01-17",
      type: "Плановое ТО-2: полная диагностика",
      status: "не назначено",
    },
    {
      id: 3,
      vehicle: "ТС-006",
      carNumber: "О678ПР",
      date: "2024-01-15",
      type: "ТО-3: замена фильтров, масла",
      status: "выполнено",
    },
  ]);

  const [filteredMaintenance, setFilteredMaintenance] =
    useState(scheduledMaintenance);
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState("");
  const [isAddMaintenanceDialogOpen, setIsAddMaintenanceDialogOpen] =
    useState(false);

  const [newMaintenanceRequest, setNewMaintenanceRequest] = useState({
    vehicle: "",
    carNumber: "",
    date: "",
    type: "",
  });

  const statuses = [
    { value: "", label: "Все" },
    { value: "назначено", label: "назначено" },
    { value: "не назначено", label: "не назначено" },
    { value: "выполнено", label: "выполнено" },
  ];

  // Обновление статуса ТО
  const handleMaintenanceStatusChange = (maintenanceId, newStatus) => {
    const updatedMaintenance = scheduledMaintenance.map((maintenance) =>
      maintenance.id === maintenanceId
        ? { ...maintenance, status: newStatus }
        : maintenance
    );
    setScheduledMaintenance(updatedMaintenance);
    applyMaintenanceStatusFilter(updatedMaintenance, maintenanceStatusFilter);
  };

  // Фильтрация
  const applyMaintenanceStatusFilter = (maintenance, filter) => {
    if (!filter) {
      setFilteredMaintenance(maintenance);
    } else {
      setFilteredMaintenance(
        maintenance.filter((item) => item.status === filter)
      );
    }
  };

  const handleMaintenanceFilterChange = (filter) => {
    setMaintenanceStatusFilter(filter);
    applyMaintenanceStatusFilter(scheduledMaintenance, filter);
  };

  // Добавление нового ТО
  const handleAddMaintenanceRequest = () => {
    if (
      newMaintenanceRequest.vehicle.trim() &&
      newMaintenanceRequest.date.trim() &&
      newMaintenanceRequest.type.trim()
    ) {
      const maxId =
        scheduledMaintenance.length > 0
          ? Math.max(...scheduledMaintenance.map((m) => m.id || 0))
          : 0;
      const maintenance = {
        id: maxId + 1,
        ...newMaintenanceRequest,
        status: "не назначено",
      };
      const updatedMaintenance = [...scheduledMaintenance, maintenance];
      setScheduledMaintenance(updatedMaintenance);
      applyMaintenanceStatusFilter(updatedMaintenance, maintenanceStatusFilter);
      setNewMaintenanceRequest({
        vehicle: "",
        carNumber: "",
        date: "",
        type: "",
      });
      setIsAddMaintenanceDialogOpen(false);
    }
  };

  return (
    <div className="planto bg-card-light">
      <div className="planto-header">
        <h1>Плановое ТО</h1>
        <button onClick={() => setIsAddMaintenanceDialogOpen(true)}>
          Добавить ТО
        </button>
      </div>

      {/* Фильтр */}
      <div>
        <UiSelect
          value={maintenanceStatusFilter}
          onChange={handleMaintenanceFilterChange}
          options={statuses}
          placeholder="Выберите статус"
          title="Фильтры по статусу"
        />
      </div>

      {/* Таблица */}
      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: 20, width: "100%" }}
      >
        <thead>
          <tr>
            <th>ТС</th>
            <th>Номер машины</th>
            <th>Дата</th>
            <th>Тип ТО</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaintenance.map((maintenance) => (
            <tr key={maintenance.id}>
              <td>{maintenance.vehicle}</td>
              <td>{maintenance.carNumber}</td>
              <td>{maintenance.date}</td>
              <td>{maintenance.type}</td>
              <td className="table-status">
                <UiSelect
                  value={maintenance.status}
                  onChange={(e) =>
                    handleMaintenanceStatusChange(
                      maintenance.id,
                      e.target.value
                    )
                  }
                  options={statuses}
                  placeholder="Выберите статус"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модальное окно */}
      {isAddMaintenanceDialogOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить новое ТО</h2>
            <input
              type="text"
              placeholder="ТС"
              value={newMaintenanceRequest.vehicle}
              onChange={(e) =>
                setNewMaintenanceRequest({
                  ...newMaintenanceRequest,
                  vehicle: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Номер машины"
              value={newMaintenanceRequest.carNumber}
              onChange={(e) =>
                setNewMaintenanceRequest({
                  ...newMaintenanceRequest,
                  carNumber: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={newMaintenanceRequest.date}
              onChange={(e) =>
                setNewMaintenanceRequest({
                  ...newMaintenanceRequest,
                  date: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Тип ТО"
              value={newMaintenanceRequest.type}
              onChange={(e) =>
                setNewMaintenanceRequest({
                  ...newMaintenanceRequest,
                  type: e.target.value,
                })
              }
            />
            <div className="modal-buttons">
              <button onClick={handleAddMaintenanceRequest}>Сохранить</button>
              <button onClick={() => setIsAddMaintenanceDialogOpen(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Стили */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          min-width: 300px;
          max-width: 400px;
        }
        .modal input {
          width: 100%;
          margin: 5px 0;
          padding: 8px;
          box-sizing: border-box;
        }
        .modal-buttons {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }
        .modal-buttons button {
          flex: 1;
          padding: 8px;
        }
      `}</style>
    </div>
  );
}
