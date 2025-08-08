import React from 'react'
import { NavLink } from 'react-router'
import './Header.css'

export default function Header() {
  return (
    <div className="admin-panel-container__left border-glow">
          <div className="admin-panel-container__left-logo">
            <div className="company-logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-zap h-6 w-6 text-primary-foreground"
               >
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
              </svg>
            </div>
            <div className="admin-panel-container__left-company">
              <h1 className="admin-panel-container__left-logo-title">
                CyberLogistics
              </h1>
              <p className="admin-panel-container__left-logo-descr">
                Админ-панель
              </p>
            </div>
          </div>
          <div className="admin-panel-container__left_nav">
            <div className="admin-panel-container__left_nav-title">
              Панели управления
            </div>
            <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "border-glow active admin-panel-container__left_nav-item"
                : "admin-panel-container__left_nav-item"
            }
            >
              <div className="admin-panel-container__left_nav-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-user-check h-5 w-5 text-primary"
                
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <polyline points="16 11 18 13 22 9"></polyline>
                </svg>
                <div className="admin-panel-user-role">
                  <div className="admin-panel-user-role_title">
                    Руководитель
                  </div>
                  <div className="admin-panel-user-role_descr">
                    Управление и KPI
                  </div>
                </div>
              </div>
            </NavLink>
            <NavLink
            to="/logist"
            className={({ isActive }) =>
              isActive
                ? "border-glow active admin-panel-container__left_nav-item"
                : "admin-panel-container__left_nav-item"
            }>
              <div className="admin-panel-container__left_nav-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-map-pin h-5 w-5 text-muted-foreground"
                
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div className="admin-panel-user-role">
                  <div className="admin-panel-user-role_title">Логист</div>
                  <div className="admin-panel-user-role_descr">
                    Рейсы и маршруты
                  </div>
                </div>
              </div>
            </NavLink>
            <NavLink
            to="/mechanic"
            className={({ isActive }) =>
              isActive
                ? "border-glow active admin-panel-container__left_nav-item"
                : "admin-panel-container__left_nav-item"
            }>
              <div className="admin-panel-container__left_nav-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-wrench h-5 w-5 text-muted-foreground"
                
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                <div className="admin-panel-user-role">
                  <div className="admin-panel-user-role_title">Механик</div>
                  <div className="admin-panel-user-role_descr">Ремонт и ТО</div>
                </div>
              </div>
            </NavLink>
            <NavLink
            to="/user"
            className={({ isActive }) =>
              isActive
                ? "border-glow active admin-panel-container__left_nav-item"
                : "admin-panel-container__left_nav-item"
            }>
              <div className="admin-panel-container__left_nav-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-users h-5 w-5 text-muted-foreground"
              
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <div className="admin-panel-user-role">
                  <div className="admin-panel-user-role_title">
                    Пользователи
                  </div>
                  <div className="admin-panel-user-role_descr">
                    Управление пользователями
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
  )
}
