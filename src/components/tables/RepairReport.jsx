import { useState } from "react";
import { FaMap, FaPlus } from "react-icons/fa";
import UiSelect from "../ui/atoms/select"; // путь к твоему селекту
import UiTable from "../ui/atoms/table";
import UiTableButton from "../ui/atoms/button";
import UiModal from "../ui/atoms/modal";

export default function RepairReport() {
  const [repairRequests, setRepairRequests] = useState([
    {
      id: 1,
      time: "09:30",
      vehicle: "ТС-001",
      carNumber: "А123БВ",
      description: "Проблемы с тормозами",
      status: "В ожидании",
    },
    {
      id: 2,
      time: "11:15",
      vehicle: "ТС-002",
      carNumber: "В456ГД",
      description: "Замена масла",
      status: "В работе",
    },
    {
      id: 3,
      time: "14:20",
      vehicle: "ТС-003",
      carNumber: "Г789ЕЖ",
      description: "Ремонт двигателя",
      status: "В работе",
    },
  ]);

  const [filteredRepairRequests, setFilteredRepairRequests] =
    useState(repairRequests);
  const [repairStatusFilter, setRepairStatusFilter] = useState("");
  const [isAddRepairDialogOpen, setIsAddRepairDialogOpen] = useState(false);

  const [newRepairRequest, setNewRepairRequest] = useState({
    time: "",
    vehicle: "",
    carNumber: "",
    description: "",
  });

  const statuses = [
    { value: "", label: "Все статусы" },
    { value: "В работе", label: "В работе" },
    { value: "В ожидании", label: "В ожидании" },
    { value: "Завершено", label: "Завершено" },
  ];

  const handleRepairStatusChange = (requestId, newStatus) => {
    const updatedRequests = repairRequests.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request
    );
    setRepairRequests(updatedRequests);
    applyRepairStatusFilter(updatedRequests, repairStatusFilter);
  };

  const applyRepairStatusFilter = (requests, filter) => {
    if (!filter) {
      setFilteredRepairRequests(requests);
    } else {
      setFilteredRepairRequests(
        requests.filter((request) => request.status === filter)
      );
    }
  };

  const handleRepairFilterChange = (filter) => {
    setRepairStatusFilter(filter);
    applyRepairStatusFilter(repairRequests, filter);
  };

  const handleAddRepairRequest = () => {
    if (
      newRepairRequest.time.trim() &&
      newRepairRequest.vehicle.trim() &&
      newRepairRequest.description.trim()
    ) {
      const maxId =
        repairRequests.length > 0
          ? Math.max(...repairRequests.map((r) => r.id || 0))
          : 0;
      const request = {
        id: maxId + 1,
        ...newRepairRequest,
        status: "В ожидании",
      };
      const updatedRequests = [...repairRequests, request];
      setRepairRequests(updatedRequests);
      applyRepairStatusFilter(updatedRequests, repairStatusFilter);
      setNewRepairRequest({
        time: "",
        vehicle: "",
        carNumber: "",
        description: "",
      });
      setIsAddRepairDialogOpen(false);
    }
  };

  return (
    <div className="racestoday bg-card-light">
      <div className="racestoday-block">
        <h1>
          <FaMap /> Заявки на ремонт
        </h1>
        <UiTableButton
          label="Добавить заявку"
          icon={FaPlus}
          onClick={() => setIsAddRepairDialogOpen(true)}
        />
      </div>

      {/* Фильтр по статусу */}
      <div className="racestoday-filter">
        <UiSelect
          value={repairStatusFilter}
          onChange={handleRepairFilterChange}
          options={statuses}
          placeholder="Выберите статус"
          title="Фильтры по статусу"
        />
      </div>

      {/* Таблица заявок */}
      <UiTable
        columns={[
          { header: "Время", render: (r) => r.time },
          { header: "ТС", render: (r) => r.vehicle },
          { header: "Номер машины", render: (r) => r.carNumber },
          { header: "Описание", render: (r) => r.description },
          {
            header: "Статус",
            className: "table-status",
            render: (r) => (
              <UiSelect
                value={r.status}
                onChange={(val) => handleRepairStatusChange(r.id, val)}
                options={statuses}
                placeholder="Выберите статус"
              />
            ),
          },
        ]}
        data={filteredRepairRequests}
      />

      {/* Модальное окно */}
      {isAddRepairDialogOpen && (
         <UiModal title="Добавить новую заявку" onClose={() => setIsAddRepairDialogOpen(false)}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="time"
          placeholder="Время"
          value={newRepairRequest.time}
          onChange={(e) =>
            setNewRepairRequest({ ...newRepairRequest, time: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="ТС"
          value={newRepairRequest.vehicle}
          onChange={(e) =>
            setNewRepairRequest({ ...newRepairRequest, vehicle: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Номер машины"
          value={newRepairRequest.carNumber}
          onChange={(e) =>
            setNewRepairRequest({ ...newRepairRequest, carNumber: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Описание"
          value={newRepairRequest.description}
          onChange={(e) =>
            setNewRepairRequest({ ...newRepairRequest, description: e.target.value })
          }
        />
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 20 }}>
          <UiTableButton label="Сохранить" onClick={handleAddRepairRequest} />
          <UiTableButton label="Отмена" onClick={() => setIsAddRepairDialogOpen(false)} />
        </div>
      </div>
    </UiModal>
      )}

      {/* Стили для модалки */}
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
