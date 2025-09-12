import "./UserPage.css";

import NavPanel from "../../components/ui/organisms/NavPanel";
import { Header } from "../../components/ui/molecules/Header";
import UsersTable from "../../components/tables/UsersTable";

export default function UserPage() {
  return (
    <div className="admin-panel-container">
      <NavPanel />

      <div className="admin-panel-container__right">
        <Header title="Управление пользователями" />

        <UsersTable />
      </div>
    </div>
  );
}
