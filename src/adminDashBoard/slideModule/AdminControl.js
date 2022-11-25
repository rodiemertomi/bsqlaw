import React, { useState } from 'react'
import useStylesStore from '../reducers/StylesReducer'
import { ACTIONS } from '../reducers/AdminReducer'

function AdminControl({ setHideNavBar, dispatch }) {
  const { hideAdminControl, adminControl } = useStylesStore()
  const [touchEnd, setTouchEnd] = useState(null)
  const [touchStart, setTouchStart] = useState(null)

  const minSwipeDistance = 150

  const onTouchStart = e => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = e => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    if (isLeftSwipe) {
      hideAdminControl()
    }
  }

  const handleManageParters = () => {
    dispatch({ type: ACTIONS.MANAGE_PARTNERS })
    hideAdminControl()
    setHideNavBar(true)
  }

  const handleManageAdmin = () => {
    dispatch({ type: ACTIONS.MANAGE_ADMIN })
    hideAdminControl()
    setHideNavBar(true)
  }
  const handleManageLawyers = () => {
    dispatch({ type: ACTIONS.MANAGE_LAWYER })
    hideAdminControl()
    setHideNavBar(true)
  }
  const handleManageClients = () => {
    dispatch({ type: ACTIONS.MANAGE_CLIENT })
    hideAdminControl()
    setHideNavBar(true)
  }

  return (
    <div className='font-poppins'>
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`bg-[#BABABA] w-[250px] h-screen fixed overflow-scroll flex flex-col items-start pt-4 scrollbar-hide font-poppins top-0 ${
          adminControl ? `left-[88px] lg:left-[91px]` : `left-[-300px]`
        } transition-all duration-300 z-50 `}
      >
        <h1 className='ml-5 mt-5 text-xl font-bold'>Admin Control</h1>

        <div className='flex flex-col gap-5 mt-5 mb-10 ml-10'>
          <details>
            <summary className='font-semibold cursor-pointer'>Manage Partners</summary>
            <div className='mt-5'>
              <ul className='flex flex-col gap-4 cursor-pointer'>
                <li onClick={handleManageParters}>Manage Partners</li>
              </ul>
            </div>
          </details>
          <details>
            <summary className='font-semibold cursor-pointer'>Manage Admins</summary>
            <div className='mt-5'>
              <ul className='flex flex-col gap-4 cursor-pointer'>
                <li onClick={handleManageAdmin}>Manage Admins</li>
              </ul>
            </div>
          </details>
          <details>
            <summary className='font-semibold cursor-pointer'>Manage Lawyers</summary>
            <div className='mt-5'>
              <ul className='flex flex-col gap-4 cursor-pointer'>
                <li onClick={handleManageLawyers}>Manage Lawyers</li>
              </ul>
            </div>
          </details>
          <details>
            <summary className='font-semibold cursor-pointer'>Manage Clients</summary>
            <div className='mt-5'>
              <ul className='flex flex-col gap-4 cursor-pointer'>
                <li onClick={handleManageClients}>Manage Clients</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

export default AdminControl
