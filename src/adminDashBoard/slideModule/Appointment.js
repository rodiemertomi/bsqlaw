import React, { useState } from 'react'
import useStylesStore from '../reducers/StylesReducer'
import { ACTIONS } from '../reducers/AdminReducer'
import UseAppointmentStore from '../reducers/AppointmentReducer'

function Appointment({ dispatch }) {
  const { hideAppointment, appointment } = useStylesStore()
  const [touchEnd, setTouchEnd] = useState(null)
  const [touchStart, setTouchStart] = useState(null)
  const { event } = UseAppointmentStore()

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
      hideAppointment()
    }
  }

  const handleManageAppointment = () => {
    dispatch({ type: ACTIONS.MANAGE_APPOINTMENT })
  }

  return (
    <div>
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`bg-[#BABABA] w-[250px] font-Lora h-screen fixed overflow-scroll flex flex-col pt-4 scrollbar-hide font-poppins top-0 ${
          appointment ? `left-[88px] lg:left-[91px]` : `left-[-300px]`
        } transition-all duration-300 z-50 `}
      >
        <div className='ml-3'>
          <h1 className='text-center'>Appointments</h1>
          <details className='mt-2'>
            <summary onClick={handleManageAppointment}>Click to see Event</summary>
            <p></p>
          </details>
        </div>
        <div className={`pl-20`}>{`Event start  ${event.eventStart}`}</div>
        <div className={`pl-20`}>{`Event end  ${event.eventEnd}`}</div>
        <div className={`pl-20`}>{`Event desc  ${event.eventDesc}`}</div>
        <div className={`pl-20`}>{`Event info  ${event.info}`}</div>
      </div>
    </div>
  )
}

export default Appointment
