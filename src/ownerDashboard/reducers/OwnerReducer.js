import MainDashboard from '../pages/MainDashboard'
import OwnerProfile from '../pages/OwnerProfile'
import ClientsList from '../pages/ClientsList'
import LawyersList from '../pages/LawyersList'
import Appointments from '../pages/Appointments'
import Timesheets from '../pages/Timesheets'
import Accounting from '../pages/Accounting'
import React from 'react'
import CaseFolders from '../pages/CaseFolders'
import Reports from '../pages/Reports'

export const ACTIONS = {
  VIEW_DASHBOARD: 'view-dashboard',
  VIEW_PROFILE: 'view-profile',
  VIEW_LAWYERS: 'view-lawyers',
  VIEW_CLIENTS: 'view-clients',
  VIEW_APPOINTMENTS: 'view-appointments',
  MANAGE_ACCOUNTING: 'view-accounting',
  VIEW_TIMESHEETS: 'view-timesheets',
  VIEW_CASEFOLDERS: 'view-casefolders',
  VIEW_REPORTS: 'view-reports',
}

const OwnerReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.VIEW_DASHBOARD:
      return { page: <MainDashboard /> }
    case ACTIONS.VIEW_PROFILE:
      return { page: <OwnerProfile /> }
    case ACTIONS.VIEW_LAWYERS:
      return { page: <LawyersList /> }
    case ACTIONS.VIEW_CLIENTS:
      return { page: <ClientsList /> }
    case ACTIONS.VIEW_APPOINTMENTS:
      return { page: <Appointments /> }
    case ACTIONS.VIEW_TIMESHEETS:
      return { page: <Timesheets /> }
    case ACTIONS.VIEW_CASEFOLDERS:
      return { page: <CaseFolders /> }
    case ACTIONS.MANAGE_ACCOUNTING:
      return { page: <Accounting /> }
    case ACTIONS.VIEW_REPORTS:
      return { page: <Reports /> }
    default:
      return state
  }
}

export default OwnerReducer
