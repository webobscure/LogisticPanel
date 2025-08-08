import React from 'react'
import Header from '../../components/Header/Header'
import ErrorReport from '../../components/ErrorReport'

export default function MechanicPage() {
  return (
    <div className="admin-panel-container">
      <Header />
      <div className="admin-panel-container__right">
      <ErrorReport />
      </div>
      
      </div>
  )
}
