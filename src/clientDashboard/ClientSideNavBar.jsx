import React from 'react'
import { UserAuth } from '../context/AuthContext'
import { ACTIONS } from './reducers/ClientReducer'
import UseUserReducer from '../UserReducer'

function ClientSideNavBar({ hideNavBar, dispatch }) {
  const { logOut } = UserAuth()

  const { photoURL } = UseUserReducer()
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

  const viewDashboard = () => {
    dispatch({ type: ACTIONS.VIEW_DASHBOARD })
  }
  const viewLawyers = () => {
    dispatch({ type: ACTIONS.VIEW_LAWYERS })
  }
  const viewAppointments = () => {
    dispatch({ type: ACTIONS.VIEW_APPOINTMENT })
  }
  const viewFolders = () => {
    dispatch({ type: ACTIONS.VIEW_FOLDERS })
  }
  const viewProfile = () => {
    dispatch({ type: ACTIONS.VIEW_PROFILE })
  }
  const viewAccounting = () => {
    dispatch({ type: ACTIONS.VIEW_ACCOUNTING })
  }

  return (
    <div>
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
                alt='user'
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
                alt='lawyers'
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
                alt='appointment'
                onClick={viewAppointments}
                className='w-10 h-10 invert'
                src={require('../assets/appointment.png')}
              />
            }
          />
          <p className=' text-xs pt-0 mb-3 font-poppins'>Appointment</p>
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

export default ClientSideNavBar
