import Header from '../../components/Header/Header'
import ErrorReport from '../../components/tables/ErrorReport/ErrorReport'
import RepairReport from '../../components/tables/RepairReport'
import PlanTO from '../../components/tables/PlanTO/PlanTO'
import { TopBlock } from "../../components/ui/organisms/TopBlock";
import { InfoItem } from '../../components/ui/molecules/InfoItem';

export default function MechanicPage() {
  return (
    <div className="admin-panel-container">
      <Header />
      <div className="admin-panel-container__right">
        <TopBlock>
          <InfoItem 
            title='Активные ремонты' value='2'
            description='Сейчас в работе' 
            iconType='repair' iconColor='orange'
          />
          <InfoItem 
            title='Плановое ТО' value='1' 
            description='Запланировано' 
            iconType='planTO' iconColor='darkviolet'
          />
          <InfoItem 
            title='Эффективность' value='94' text='%' 
            description='Среднее время выполнения' 
            iconType='efficiency' iconColor='darkblue'
          />
        </TopBlock>
      <RepairReport />
      <PlanTO />
      <ErrorReport />
      </div>
      
      </div>
  )
}
