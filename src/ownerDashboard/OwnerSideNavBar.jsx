import React from 'react'
import { UserAuth } from '../context/AuthContext'
import { ACTIONS } from './reducers/OwnerReducer'
import UseUserReducer from '../UserReducer'

function OwnerSideNavBar({ dispatch, hideNavBar }) {
  const { logOut } = UserAuth()
  const { photoURL } = UseUserReducer()

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      alert(error)
    }
  }

  const viewProfile = () => {
    dispatch({ type: ACTIONS.VIEW_PROFILE })
  }
  const viewDashboard = () => {
    dispatch({ type: ACTIONS.VIEW_DASHBOARD })
  }
  const viewLawyers = () => {
    dispatch({ type: ACTIONS.VIEW_LAWYERS })
  }
  const viewClients = () => {
    dispatch({ type: ACTIONS.VIEW_CLIENTS })
  }
  const viewFolders = () => {
    dispatch({ type: ACTIONS.VIEW_CASEFOLDERS })
  }
  const viewTimesheets = () => {
    dispatch({ type: ACTIONS.VIEW_TIMESHEETS })
  }
  const viewAppointments = () => {
    dispatch({ type: ACTIONS.VIEW_APPOINTMENTS })
  }

  return (
    <div>
      {/* Sliding Modules Components*/}

      {/* Navigation Bar */}
      <div
        className={`${
          hideNavBar ? 'left-[-300px]' : 'left-0'
        } fixed z-[1000] top-0 xl:left-0 h-screen w-[91px] m-0 flex flex-col items-center bg-[#d9d9d9] shadow-lg transition-all duration-300 `}
      >
        <div className='fixed z-10'>
          <div
            onClick={viewProfile}
            className='relative flex items-center justify-center h-16 w-16 mt-5 mb-10 mx-auto 
    shadow-lg bg-[#632121] hover:bg-[#ab940b]
    rounded-xl hover:rounded-3xl transition-all duration-300 ease-linear cursor-pointer'
          >
            {
              <img
                alt='user icon'
                className='w-14 h-14'
                src={photoURL === '' || !photoURL ? require('../assets/user.png') : `${photoURL}`}
              />
            }
          </div>
        </div>
        <div className=' h-screen w-sreen overflow-scroll scrollbar-hide mt-28 mb-28'>
          <SideBarIcon
            icon={
              <img
                alt='case folder icon'
                onClick={viewLawyers}
                className='w-10 h-10'
                src={require('../assets/caseFolder.png')}
              />
            }
          />
          <p className='text-center text-sm pt-0 mb-3 '>Lawyers</p>
          <SideBarIcon
            icon={
              <img
                alt='client icon'
                onClick={viewClients}
                className='w-8 h-8'
                src={require('../assets/client.jpg')}
              />
            }
          />
          <p className='text-center text-sm pt-0 mb-3 '>Client</p>
          <SideBarIcon
            icon={
              <img
                alt='case folder icon'
                onClick={viewFolders}
                className='w-10 h-10'
                src={require('../assets/caseFolder.png')}
              />
            }
          />
          <p className='text-center text-sm pt-0 mb-3 '>Case Folder</p>
          <SideBarIcon
            icon={
              <img
                alt='timesheet icon'
                onClick={viewTimesheets}
                className='w-8 h-8'
                src={require('../assets/timesheets.png')}
              />
            }
          />
          <p className='text-center text-[13px] pt-0 mb-3 '>Timesheet</p>
          <SideBarIcon
            icon={
              <img
                alt='appointment'
                onClick={viewAppointments}
                className='w-8 h-8 invert'
                src={require('../assets/appointment.png')}
              />
            }
          />
          <p className='text-center text-[13px] pt-0 mb-3 '>Appointment</p>
        </div>
        <div className='text-center fixed bottom-4 z-10'>
          {
            <img
              alt='signout'
              onClick={handleSignOut}
              className='w-8 h-8 invert cursor-pointer'
              src={require('../assets/logout.png')}
            />
          }
        </div>
      </div>
    </div>
  )
}

const SideBarIcon = ({ icon, text = 'tooltip' }) => (
  <div className='sidebar-icon group'>
    {icon}
    {/* <span className="sidebar-tooltip group-hover:scale-100">{text}</span> */}
  </div>
)

export default OwnerSideNavBar
