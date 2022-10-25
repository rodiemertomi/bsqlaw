import React from 'react'
import { UserAuth } from '../context/AuthContext'
import { ACTIONS } from './reducers/ClientReducer'

function ClientSideNavBar({ hideNavBar, dispatch }) {
  const { logOut } = UserAuth()
  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      alert(error)
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
            {<img alt='user' className='w-14 h-14' src={require('../assets/user.png')} />}
          </div>
        </div>
        <div className=' h-screen w-sreen overflow-scroll scrollbar-hide mt-28 mb-28'>
          <p className='text-sm pt-0 mb-3 font-Lora text-center'>Dashboard</p>
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
          <p className='text-center text-sm pt-0 mb-3 font-Lora'>Lawyers</p>
          <SideBarIcon
            icon={
              <img
                alt='folder'
                onClick={viewFolders}
                className='w-10 h-10'
                src={require('../assets/folder.png')}
              />
            }
          />
          <p className='text-center text-sm pt-0 mb-3 font-Lora'>Case Folders</p>
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
          <p className=' text-[13px] pt-0 mb-3 font-Lora'>Appointment</p>
        </div>
        <div className='text fixed bottom-4 z-10'>
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

export default ClientSideNavBar
