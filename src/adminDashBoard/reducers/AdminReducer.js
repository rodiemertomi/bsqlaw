import AdminsManagement from '../pages/AdminsManagement'
import LawyersManagement from '../pages/LawyersManagement'
import ClientsManagement from '../pages/ClientsManagement'
import PartnersManagement from '../pages/PartnersManagement'
import SuppliersManagement from '../pages/SuppliersManagement'
import AppointmentManagement from '../pages/AppointmentManagement'
import AdminProfile from '../pages/AdminProfile'
import MainDashboard from '../pages/MainDashboard'
import CaseFolders from '../pages/CaseFolders'
import Accounting from '../pages/Accounting'
import React from 'react'
import Timesheets from '../pages/Timesheets'
import Reports from '../pages/Reports'
import Archives from '../pages/Archives'

export const ACTIONS = {
  MANAGE_ADMIN: 'manage-admin',
  MANAGE_LAWYER: 'manage-lawyer',
  MANAGE_CLIENT: 'manage-client',
  MANAGE_SUPPLIERS: 'manage-suppliers',
  MANAGE_PARTNERS: 'manage-partners',
  MANAGE_APPOINTMENT: 'manage-appointment',
  MANAGE_ACCOUNTING: 'view-accounting',
  VIEW_ARCHIVES: 'view-archives',
  VIEW_PROFILE: 'view-profile',
  VIEW_DASHBOARD: 'view-dashboard',
  VIEW_CASEFOLDERS: 'view-casefolders',
  VIEW_TIMESHEETS: 'view-timesheets',
  VIEW_REPORTS: 'view-reports',
}

const AdminReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.MANAGE_ADMIN:
      return { page: <AdminsManagement /> }
    case ACTIONS.MANAGE_LAWYER:
      return { page: <LawyersManagement /> }
    case ACTIONS.MANAGE_CLIENT:
      return { page: <ClientsManagement /> }
    case ACTIONS.MANAGE_SUPPLIERS:
      return { page: <SuppliersManagement /> }
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
    case ACTIONS.VIEW_REPORTS:
      return { page: <Reports /> }
    case ACTIONS.VIEW_ARCHIVES:
      return { page: <Archives /> }
    case ACTIONS.MANAGE_PARTNERS:
      return { page: <PartnersManagement /> }
    case ACTIONS.MANAGE_ACCOUNTING:
      return { page: <Accounting /> }
    default:
      return state
  }
}

export default AdminReducer
