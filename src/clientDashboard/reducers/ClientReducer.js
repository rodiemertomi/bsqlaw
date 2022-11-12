import Appointment from '../pages/Appointment'
import Folders from '../pages/Folders'
import LawyersList from '../pages/LawyersList'
import MainDashBoard from '../pages/MainDashBoard'
import ClientProfile from '../pages/ClientProfile'
import Accounting from '../pages/Accounting'
import React from 'react'

export const ACTIONS = {
  VIEW_DASHBOARD: 'view-dashboard',
  VIEW_LAWYERS: 'view-lawyers',
  VIEW_APPOINTMENT: 'view-appointments',
  VIEW_FOLDERS: 'view-folders',
  VIEW_PROFILE: 'view-profile',
  VIEW_ACCOUNTING: 'view-accounting',
}

const ClientReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.VIEW_DASHBOARD:
      return { page: <MainDashBoard /> }
    case ACTIONS.VIEW_LAWYERS:
      return { page: <LawyersList /> }
    case ACTIONS.VIEW_APPOINTMENT:
      return { page: <Appointment /> }
    case ACTIONS.VIEW_FOLDERS:
      return { page: <Folders /> }
    case ACTIONS.VIEW_PROFILE:
      return { page: <ClientProfile /> }
    case ACTIONS.VIEW_ACCOUNTING:
      return { page: <Accounting /> }
    default:
      return state
  }
}

export default ClientReducer
