import "./LogistPage.css";

import RacesToday from "../../components/tables/RacesToday";
import NavPanel from "../../components/ui/organisms/NavPanel";
import VehiclesTable from "../../components/tables/VehiclesTable";
import { Header } from "../../components/ui/molecules/Header";

export default function LogistPage() {
  return (
    <div className="admin-panel-container">
      <NavPanel />

      <div className="admin-panel-container__right">
        <Header title="Панель логиста" />
        <RacesToday />
        <VehiclesTable />
      </div>
    </div>
  );
}
