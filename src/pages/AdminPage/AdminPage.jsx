import "./AdminPage.css";
import Chart from "react-apexcharts";
import { FaTelegramPlane, FaWrench, FaUserCog } from "react-icons/fa";

import { TopBlock } from "../../components/ui/organisms/TopBlock";
import { TotalWorkload } from "../../components/ui/molecules/TotalWorkload";
import { InfoItem } from "../../components/ui/molecules/InfoItem";
import UiTableButton from "../../components/ui/atoms/button";
import NavPanel from "../../components/ui/organisms/NavPanel";
import { Header } from "../../components/ui/molecules/Header";
import ErrorReport from "../../components/tables/ErrorReport/ErrorReport";
import UsersTable from "../../components/tables/UsersTable";
import VehiclesTable from "../../components/tables/VehiclesTable";
import UsersSalaryTable from "../../components/tables/UsersSalaryTable";
import DriversSalaryTable from "../../components/tables/DriversSalaryTable";
import MileageTable from "../../components/tables/MileageTable";

export default function AdminPage() {
  return (
    <>
      <div className="admin-panel-container">
        <NavPanel />

        <div className="admin-panel-container__right">
          <Header title="Панель руководителя" />
          <UsersTable />
          <VehiclesTable />
          <ErrorReport />
          <DriversSalaryTable />
          <UsersSalaryTable />
          <MileageTable />
        </div>
      </div>
    </>
  );
}
