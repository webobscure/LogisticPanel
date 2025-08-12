import React, { useState } from "react";
import UiSelect from "../../ui/atoms/select";
import "./PlanTO.css";
import UiTable from "../../ui/atoms/table";
import { FaPlus } from "react-icons/fa";
import UiTableButton from "../../ui/atoms/button";
import UiModal from "../../ui/atoms/modal";

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
        <UiTableButton
          label="Добавить ТО"
          icon={FaPlus}
          onClick={() => setIsAddMaintenanceDialogOpen(true)}
        />
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
      <UiTable
        columns={[
          { header: "ТС", render: (m) => m.vehicle },
          { header: "Номер машины", render: (m) => m.carNumber },
          { header: "Дата", render: (m) => m.date },
          { header: "Тип ТО", render: (m) => m.type },
          {
            header: "Статус",
            className: "table-status",
            render: (m) => (
              <UiSelect
                value={m.status}
                onChange={(val) => handleMaintenanceStatusChange(m.id, val)}
                options={statuses}
                placeholder="Выберите статус"
              />
            ),
          },
        ]}
        data={filteredMaintenance}
      />

      {/* Модальное окно */}
      {isAddMaintenanceDialogOpen && (
        <UiModal
          title="Добавить новое ТО"
          onClose={() => setIsAddMaintenanceDialogOpen(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <UiTableButton
                label="Сохранить"
                onClick={handleAddMaintenanceRequest}
              />
              <UiTableButton
                label="Отмена"
                onClick={() => setIsAddMaintenanceDialogOpen(false)}
              />
            </div>
          </div>
        </UiModal>
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
