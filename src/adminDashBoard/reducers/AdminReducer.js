import AdminsManagement from '../pages/AdminsManagement'
import LawyersManagement from '../pages/LawyersManagement'
import ClientsManagement from '../pages/ClientsManagement'
import PartnersManagement from '../pages/PartnersManagement'
import AppointmentManagement from '../pages/AppointmentManagement'
import AdminProfile from '../pages/AdminProfile'
import MainDashboard from '../pages/MainDashboard'
import CaseFolders from '../pages/CaseFolders'
import React from 'react'
import Timesheets from '../pages/Timesheets'

export const ACTIONS = {
  MANAGE_ADMIN: 'manage-admin',
  MANAGE_LAWYER: 'manage-lawyer',
  MANAGE_CLIENT: 'manage-client',
  MANAGE_PARTNERS: 'manage-partners',
  MANAGE_APPOINTMENT: 'manage-appointment',
  VIEW_PROFILE: 'view-profile',
  VIEW_DASHBOARD: 'view-dashboard',
  VIEW_CASEFOLDERS: 'view-casefolders',
  VIEW_TIMESHEETS: 'view-timesheets',
}

const AdminReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.MANAGE_ADMIN:
      return { page: <AdminsManagement /> }
    case ACTIONS.MANAGE_LAWYER:
      return { page: <LawyersManagement /> }
    case ACTIONS.MANAGE_CLIENT:
      return { page: <ClientsManagement /> }
    case ACTIONS.MANAGE_APPOINTMENT:
      return { page: <AppointmentManagement /> }
    case ACTIONS.VIEW_PROFILE:
      return { page: <AdminProfile /> }
    case ACTIONS.VIEW_DASHBOARD:
      return { page: <MainDashboard /> }
    case ACTIONS.VIEW_CASEFOLDERS:
      return { page: <CaseFolders /> }
    case ACTIONS.VIEW_TIMESHEETS:
      return { page: <Timesheets /> }
    case ACTIONS.MANAGE_PARTNERS:
      return { page: <PartnersManagement /> }
    default:
      return state
  }
}

export default AdminReducer
