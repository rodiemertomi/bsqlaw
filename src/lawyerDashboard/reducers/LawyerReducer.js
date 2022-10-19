import Appointment from '../pages/Appointments'
import Folders from '../pages/Folders'
import ClientsList from '../pages/ClientsList'
import MainDashboard from '../pages/MainDashboard'
import LawyerProfile from '../pages/LawyerProfile'
import React from 'react'
import Timesheets from '../pages/Timesheets'

export const ACTIONS = {
  VIEW_DASHBOARD: 'view-dashboard',
  VIEW_CLIENTS: 'view-clients',
  VIEW_APPOINTMENTS: 'view-appointments',
  VIEW_FOLDERS: 'view-folders',
  VIEW_PROFILE: 'view-profile',
  VIEW_TIMESHEETS: 'view-timesheets',
}

const LawyerReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.VIEW_DASHBOARD:
      return { page: <MainDashboard /> }
    case ACTIONS.VIEW_CLIENTS:
      return { page: <ClientsList /> }
    case ACTIONS.VIEW_APPOINTMENTS:
      return { page: <Appointment /> }
    case ACTIONS.VIEW_FOLDERS:
      return { page: <Folders /> }
    case ACTIONS.VIEW_PROFILE:
      return { page: <LawyerProfile /> }
    case ACTIONS.VIEW_TIMESHEETS:
      return { page: <Timesheets /> }
    default:
      return state
  }
}

export default LawyerReducer
