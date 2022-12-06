import React, { useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import AdminControl from './slideModule/AdminControl'
import { ACTIONS } from './reducers/AdminReducer'
import useStylesStore from './reducers/StylesReducer'
import UseUserReducer from '../UserReducer'
import { useEffect } from 'react'

function AdminSideNavBar({
  hideNavBar,
  minSwipeDistance,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  dispatch,
  setHideNavBar,
}) {
  const { hideAdminControl, closeAdminControl } = useStylesStore()
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
    if (password !== 'newadmin') {
      setError(false)
      return
    }
    setError(true)
  }

  const viewProfile = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_PROFILE })
    closeAdminControl()
  }
  const viewDashboard = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_DASHBOARD })
    closeAdminControl()
  }
  const viewCasefolders = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_CASEFOLDERS })
    closeAdminControl()
  }
  const viewTimesheets = () => {
    if (error) return
    dispatch({ type: ACTIONS.VIEW_TIMESHEETS })
    closeAdminControl()
  }
  const viewAppointments = () => {
    if (error) return
    dispatch({ type: ACTIONS.MANAGE_APPOINTMENT })
    closeAdminControl()
  }
  const viewAccounting = () => {
    if (error) return
    dispatch({ type: ACTIONS.MANAGE_ACCOUNTING })
    closeAdminControl()
  }

  useEffect(() => {
    checkPassword()
  })

  return (
    <div>
      {/* Sliding Modules Components*/}
      <AdminControl
        error={error}
        dispatch={dispatch}
        minSwipeDistance={minSwipeDistance}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        setHideNavBar={setHideNavBar}
      />

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
                alt='dashboard icon'
                onClick={() => {
                  if (error) return
                  hideAdminControl()
                }}
                className='w-10 h-10 invert'
                src={require('../assets/adminControl.png')}
              />
            }
          />
          <p className='text-center text-xs pt-0 mb-3 font-poppins'>Admin Control</p>
          <SideBarIcon
            icon={
              <img
                alt='case folder icon'
                onClick={viewCasefolders}
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
          className='text-center fixed flex flex-col items-center justify-center bottom-4 z-10 cursor-pointer'
          onClick={handleSignOut}
        >
          {
            <img
              alt='signout'
              className='w-8 h-8 cursor-pointer'
              src={require('../assets/logout.png')}
            />
          }
          <p className='text-center text-xs pt-0 font-poppins'>Logout</p>
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

export default AdminSideNavBar
