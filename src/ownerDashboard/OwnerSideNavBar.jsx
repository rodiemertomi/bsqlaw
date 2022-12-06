import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { ACTIONS } from './reducers/OwnerReducer'
import UseUserReducer from '../UserReducer'

function OwnerSideNavBar({ dispatch, hideNavBar }) {
  const { logOut } = UserAuth()
  const { photoURL, password } = UseUserReducer()
  const [error, setError] = useState(false)

  const handleSignOut = async () => {
    if (window.confirm('Sure to log out?') === true) {
      try {
        await logOut()
      } catch (error) {
        alert(error)
      }
    } else {
      return
    }
  }

  const checkPassword = () => {
    if (password !== 'newpartner') {
      setError(false)
      return
    }
    setError(true)
  }

  const viewProfile = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_PROFILE })
  }
  const viewDashboard = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_DASHBOARD })
  }
  const viewLawyers = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_LAWYERS })
  }
  const viewClients = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_CLIENTS })
  }
  const viewFolders = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_CASEFOLDERS })
  }
  const viewTimesheets = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_TIMESHEETS })
  }
  const viewAppointments = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_APPOINTMENTS })
  }

  const viewAccounting = () => {
    if (error) return
    dispatch({ type: ACTIONS.MANAGE_ACCOUNTING })
  }

  useEffect(() => {
    checkPassword()
  }, [])

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
                className='w-[52px] h-[52px] rounded-full'
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
                className='w-10 h-10 invert'
                src={require('../assets/lawyer.png')}
              />
            }
          />
          <p className='text-center text-xs pt-0 mb-3 font-poppins'>Lawyers</p>
          <SideBarIcon
            icon={
              <img
                alt='client icon'
                onClick={viewClients}
                className='w-10 h-10 invert'
                src={require('../assets/client.png')}
              />
            }
          />
          <p className='text-center text-xs pt-0 mb-3 font-poppins'>Client</p>
          <SideBarIcon
            icon={
              <img
                alt='case folder icon'
                onClick={viewFolders}
                className='w-10 h-10 invert'
                src={require('../assets/caseFolder.png')}
              />
            }
          />
          <p className='text-center text-xs pt-0 mb-3 font-poppins'>Case Folders</p>
          <SideBarIcon
            icon={
              <img
                alt='appointment'
                onClick={viewAppointments}
                className='w-10 h-10 invert'
                src={require('../assets/appointment.png')}
              />
            }
          />
          <p className='text-center text-xs pt-0 mb-3 font-poppins'>Appointment</p>
          <SideBarIcon
            icon={
              <img
                alt='appointment'
                onClick={viewTimesheets}
                className='w-10 h-10 invert'
                src={require('../assets/timesheets.png')}
              />
            }
          />
          <p className='text-center text-xs pt-0 mb-3 font-poppins'>Timesheets</p>
          <SideBarIcon
            icon={
              <img
                alt='appointment'
                onClick={viewAccounting}
                className='w-10 h-10 invert'
                src={require('../assets/accounting.png')}
              />
            }
          />
          <p className='text-center text-xs pt-0 mb-3 font-poppins'>Accounting</p>
        </div>
        <div
          className='text-center flex flex-col items-center fixed bottom-4 z-10 cursor-pointer'
          onClick={handleSignOut}
        >
          {
            <img
              alt='signout'
              className='w-8 h-8 cursor-pointer'
              src={require('../assets/logout.png')}
            />
          }
          <p className='text-center text-xs pt-0 mt-1 font-poppins'>Logout</p>
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
