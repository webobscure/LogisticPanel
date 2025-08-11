import React from 'react'
import Header from '../../components/Header/Header'
import ErrorReport from '../../components/tables/ErrorReport/ErrorReport'
import RepairReport from '../../components/tables/RepairReport'
import PlanTO from '../../components/tables/PlanTO/PlanTO'

export default function MechanicPage() {
  return (
    <div className="admin-panel-container">
      <Header />
      <div className="admin-panel-container__right">
      <RepairReport />
      <PlanTO />
      <ErrorReport />
      </div>
      
      </div>
  )
}
