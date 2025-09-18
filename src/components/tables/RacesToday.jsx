import { useState, useEffect } from "react";
import { FaMap, FaPlus } from "react-icons/fa";
import UiSelect from "../ui/atoms/select";
import UiTable from "../ui/atoms/table";
import UiTableButton from "../ui/atoms/button";
import UiModal from "../ui/atoms/modal";
import Loader from "../ui/molecules/Loader";

const API_URL = "https://dlm-agent.ru/api/v1";

export default function RacesToday() {
  const [statusFilter, setStatusFilter] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [newTripModal, setNewTripModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const statuses = [
    { value: "Открыт", label: "Открыт" },
    { value: "В пути", label: "В пути" },
    { value: "Загружен", label: "Загружен" },
    { value: "Закрыт", label: "Закрыт" },
  ];

  const token = localStorage.getItem("accessToken");

  const handleTime = (t) => (t ? new Date(t).toISOString().slice(0, 16) : "");

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/logist-order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const formatted = data.map((trip) => ({
        id: trip.id,
        status: trip.status,
        time: `${trip.loading_time} → ${trip.unloading_time}`,
        route: `${trip.loading_city ?? "-"}, ${trip.loading_street ?? "-"} → ${
          trip.unloading_city ?? "-"
        }, ${trip.unloading_street ?? "-"}`,
        customerName: trip.customer_name,
        customerContacts: trip.customer_contacts,
        comment: trip.comments,
        price: trip.price,
        driverOrder: trip.driver_order,
        createdAt: trip.created_at,
        loadingCountry: trip.loading_country,
        loadingCity: trip.loading_city,
        loadingStreet: trip.loading_street,
        loadingTime: trip.loading_time,
        unloadingCountry: trip.unloading_country,
        unloadingCity: trip.unloading_city,
        unloadingStreet: trip.unloading_street,
        unloadingTime: trip.unloading_time,
        weight: trip.cargo_weight,
        height: trip.cargo_height,
        width: trip.cargo_width,
        length: trip.cargo_length,
        vehicleId: trip.vehicle_id,
        driverId: trip.driver_id,
      }));
      setTrips(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API_URL}/vehicle/all?status=active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVehicles(
        data.map((v) => ({
          value: v.id,
          label: `${v.brand} (${v.state_number})`,
          driverId: v.driver_id,
        }))
      );
    } catch (err) {
      console.error("Ошибка загрузки машин", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API_URL}/user/all?role=driver`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrivers(
        data.map((d) => ({
          value: d.id,
          label: `${d.surname} ${d.name} (${d.phone})`,
        }))
      );
    } catch (err) {
      console.error("Ошибка загрузки водителей", err);
    }
  };

  const openTripDetails = (trip) => {
    setSelectedTrip(trip);
    fetchVehicles();
    fetchDrivers();
  };
  const closeTripModal = () => setSelectedTrip(null);
  const openNewTripModal = () => {
    setNewTripModal(true);
    fetchVehicles();
    fetchDrivers();
  };
  const closeNewTripModal = () => setNewTripModal(false);

  const [newTrip, setNewTrip] = useState({
    status: "Открыт",
    loadingCountry: "Россия",
    unloadingCountry: "Россия",
    customerName: "",
    customerContacts: "",
    comment: "",
    price: 0,
    vehicleId: null,
    driverId: null,
    loadingCity: "",
    loadingStreet: "",
    loadingTime: "",
    unloadingCity: "",
    unloadingStreet: "",
    unloadingTime: "",
    weight: "",
    height: "",
    width: "",
    length: "",
  });

  const handleFieldChange = (field, value, isNew = false) => {
    if (isNew) setNewTrip((prev) => ({ ...prev, [field]: value }));
    else setSelectedTrip((prev) => ({ ...prev, [field]: value }));
  };

  const saveTrip = async () => {
    try {
      if (!selectedTrip?.id) return;
  
      if (!selectedTrip.customerName || !selectedTrip.customerContacts || !selectedTrip.price) {
        alert("Пожалуйста, заполните имя клиента, контакты и цену.");
        return;
      }
  
      const params = new URLSearchParams();
  
      // Добавляем только те параметры, которые есть
      if (selectedTrip.driverId) params.append("user_id", selectedTrip.driverId);
      if (selectedTrip.status) params.append("status", selectedTrip.status);
      if (selectedTrip.loadingTime) params.append("loading_time", selectedTrip.loadingTime);
      if (selectedTrip.loadingCountry) params.append("loading_country", selectedTrip.loadingCountry);
      if (selectedTrip.loadingCity) params.append("loading_city", selectedTrip.loadingCity);
      if (selectedTrip.loadingStreet) params.append("loading_street", selectedTrip.loadingStreet);
      if (selectedTrip.unloadingTime) params.append("unloading_time", selectedTrip.unloadingTime);
      if (selectedTrip.unloadingCountry) params.append("unloading_country", selectedTrip.unloadingCountry);
      if (selectedTrip.unloadingCity) params.append("unloading_city", selectedTrip.unloadingCity);
      if (selectedTrip.unloadingStreet) params.append("unloading_street", selectedTrip.unloadingStreet);
      if (selectedTrip.customerName) params.append("customer_name", selectedTrip.customerName);
      if (selectedTrip.customerContacts) params.append("customer_contacts", selectedTrip.customerContacts);
      if (selectedTrip.weight) params.append("cargo_weight", selectedTrip.weight);
      if (selectedTrip.height) params.append("cargo_height", selectedTrip.height);
      if (selectedTrip.width) params.append("cargo_width", selectedTrip.width);
      if (selectedTrip.length) params.append("cargo_length", selectedTrip.length);
      if (selectedTrip.comment) params.append("comments", selectedTrip.comment);
      if (selectedTrip.price) params.append("price", selectedTrip.price);
  
      const res = await fetch(`${API_URL}/logist-order?id=${selectedTrip.id}&${params.toString()}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${await res.text()}`);
      await fetchAllOrders();
      closeTripModal();
    } catch (err) {
      alert(`Ошибка сохранения: ${err.message}`);
    }
  };
  
  

  const createTrip = async () => {
    try {
      if (!newTrip.customerName || !newTrip.customerContacts || !newTrip.price) {
        alert("Пожалуйста, заполните имя клиента, контакты и цену.");
        return;
      }
  
      // Формируем query-параметры
      const params = new URLSearchParams({
        customer_name: newTrip.customerName,
        customer_contacts: newTrip.customerContacts,
        price: newTrip.price,
        status: newTrip.status || "Открыт",
        loading_time: newTrip.loadingTime || "",
        loading_country: newTrip.loadingCountry || "Россия",
        loading_city: newTrip.loadingCity || "",
        loading_street: newTrip.loadingStreet || "",
        unloading_time: newTrip.unloadingTime || "",
        unloading_country: newTrip.unloadingCountry || "Россия",
        unloading_city: newTrip.unloadingCity || "",
        unloading_street: newTrip.unloadingStreet || "",
        cargo_weight: newTrip.weight || "",
        cargo_height: newTrip.height || "",
        cargo_width: newTrip.width || "",
        cargo_length: newTrip.length || "",
        comments: newTrip.comment || "",
      });
  
      const res = await fetch(`${API_URL}/logist-order?${params.toString()}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${await res.text()}`);
      await fetchAllOrders();
      closeNewTripModal();
    } catch (err) {
      alert(`Ошибка создания рейса: ${err.message}`);
    }
  };
  
  

  const deleteTrip = async () => {
    if (!selectedTrip?.id) return;
    if (!confirm("Вы уверены, что хотите удалить рейс?")) return;
    try {
      const res = await fetch(`${API_URL}/logist-order?id=${selectedTrip.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${await res.text()}`);
      await fetchAllOrders();
      closeTripModal();
    } catch (err) {
      alert(`Ошибка удаления: ${err.message}`);
    }
  };
  const cancelTrip = async () => {
    if (!selectedTrip?.id) return;
    if (!confirm("Вы уверены, что хотите отменить рейс?")) return;
    try {
      const res = await fetch(`${API_URL}/logist-order?id=${selectedTrip.id}&status=Закрыт`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Ошибка ${res.status}: ${await res.text()}`);
      await fetchAllOrders();
      closeTripModal();
    } catch (err) {
      alert(`Ошибка отмены: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  const renderTripForm = (trip, isNew = false) => (
    <div className="details-container">
      {/* Погрузка */}
      <div className="details-section">
        <h4>Погрузка</h4>
        <div className="details-grid">
          {["Country", "City", "Street", "Time"].map((f, i) => (
            <div key={i} className="details-item">
              <label>{f === "Time" ? "Время погрузки" : f}</label>
              {f === "Time" ? (
                <input
                  type="datetime-local"
                  className="ui-input"
                  value={handleTime(trip.loadingTime)}
                  onChange={(e) =>
                    handleFieldChange("loadingTime", e.target.value, isNew)
                  }
                />
              ) : (
                <input
                  className="ui-input"
                  value={trip[`loading${f}`] || ""}
                  onChange={(e) =>
                    handleFieldChange(`loading${f}`, e.target.value, isNew)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Разгрузка */}
      <div className="details-section">
        <h4>Разгрузка</h4>
        <div className="details-grid">
          {["Country", "City", "Street", "Time"].map((f, i) => (
            <div key={i} className="details-item">
              <label>{f === "Time" ? "Время разгрузки" : f}</label>
              {f === "Time" ? (
                <input
                  type="datetime-local"
                  className="ui-input"
                  value={handleTime(trip.unloadingTime)}
                  onChange={(e) =>
                    handleFieldChange(`unloadingTime`, e.target.value, isNew)
                  }
                />
              ) : (
                <input
                  className="ui-input"
                  value={trip[`unloading${f}`] || ""}
                  onChange={(e) =>
                    handleFieldChange(`unloading${f}`, e.target.value, isNew)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Груз */}
      <div className="details-section">
        <h4>Груз</h4>
        <div className="details-grid">
          {["weight", "height", "width", "length"].map((f) => (
            <div key={f} className="details-item">
              <label>{f === "weight" ? "Вес (кг)" : f.charAt(0).toUpperCase() + f.slice(1) + " (мм)"}</label>
              <input
                type="number"
                className="ui-input"
                value={trip[f] || ""}
                onChange={(e) => handleFieldChange(f, e.target.value, isNew)}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Заказчик */}
      <div className="details-section">
        <h4>Заказчик</h4>
        <div className="details-grid">
          <div className="details-item">
            <label>Имя клиента</label>
            <input
              className="ui-input"
              value={trip.customerName || ""}
              onChange={(e) =>
                handleFieldChange("customerName", e.target.value, isNew)
              }
            />
          </div>
          <div className="details-item">
            <label>Контакты клиента</label>
            <input
              className="ui-input"
              value={trip.customerContacts || ""}
              onChange={(e) =>
                handleFieldChange("customerContacts", e.target.value, isNew)
              }
            />
          </div>
          <div className="details-item" style={{ gridColumn: "span 2" }}>
            <label>Комментарий</label>
            <textarea
              className="ui-input"
              value={trip.comment || ""}
              onChange={(e) =>
                handleFieldChange("comment", e.target.value, isNew)
              }
            />
          </div>
          <div className="details-item" style={{ gridColumn: "span 2" }}>
            <label>Стоимость</label>
            <input
              type="number"
              step="0.01"
              className="ui-input"
              value={trip.price || ""}
              onChange={(e) => handleFieldChange("price", e.target.value, isNew)}
            />
          </div>
        </div>
      </div>
      
      <div className="actions">
        <UiTableButton
          className="save-button"
          label={isNew ? "Создать рейс" : "Сохранить изменения"}
          onClick={isNew ? createTrip : saveTrip}
        />
        {!isNew && (
          <UiTableButton className="deny-button" label="Удалить рейс" onClick={deleteTrip} />
        )}
        <UiTableButton
          className="save-button"
          label={"Отменить рейс" }
          onClick={cancelTrip}
        />
      </div>
    </div>
  );

  return (
    <div className="racestoday bg-card-light">
      <div className="racestoday-block">
        <h1>
          <FaMap /> Список заказов (рейсов)
        </h1>
        <UiTableButton className="add-button" label="Добавить рейс" onClick={openNewTripModal} />
      </div>

      <div className="racestoday-filter">
        <UiSelect
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Выберите статус"
          options={statuses}
          title="Фильтры по статусу"
        />
      </div>

      <UiTable
        columns={[
          { header: "Маршрут", render: (t) => t.route },
          { header: "Статус", render: (t) => t.status },
          // {
          //   header: "Водитель",
          //   render: (t) =>
          //     t.driverOrder
          //       ? `ID:${t.driverOrder.driver_id} (${t.driverOrder.status})`
          //       : "-",
          // },
          { header: "Заказчик", render: (t) => t.customerName },
          { header: "Контакты", render: (t) => t.customerContacts },
          { header: "Комментарий", render: (t) => t.comment },
          { header: "Цена", render: (t) => t.price },
        ]}
        data={trips.filter(
          (trip) => statusFilter === "" || trip.status === statusFilter
        )}
        onRowClick={(t) => openTripDetails(t)}
      />

      {selectedTrip && <UiModal title={`Рейс #${selectedTrip.id}`} onClose={closeTripModal}>
        {renderTripForm(selectedTrip)}
      </UiModal>}

      {newTripModal && <UiModal title="Добавить новый рейс" onClose={closeNewTripModal}>
        {renderTripForm(newTrip, true)}
      </UiModal>}
    </div>
  );
}
