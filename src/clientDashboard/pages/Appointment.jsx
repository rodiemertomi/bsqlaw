import React from 'react'
import 'react-calendar/dist/Calendar.css'
import UseUserReducer from '../../UserReducer'

export default function Appointment() {
  const { appointments } = UseUserReducer()

  console.log(appointments)

  const formatDate = date => {
    let dateArray = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    return dateArray.join('/')
  }

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>Appointments</h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col gap-2 items-center lg:w-[100%] lg:h-[100%] lg:ml-20 '>
          <div className='w-[100%] h-[100%] pl-5 pt-5 pr-5 flex flex-wrap gap-2 justify-center lg:w-[100%] overflow-auto scrollbar-hide'>
            {appointments.newAppointments?.map(appointment => (
              <div
                key={appointment.id}
                className='bg-[#9C9999] w-[100%] h-60 rounded-md pl-2 flex flex-col gap-2 '
              >
                <div>
                  <span className='font-bold text-2xl'> {appointment.eventName} </span>
                </div>
                <div>
                  <span className='font-bold'>Set by: </span> {appointment.setter}
                </div>
                <div>
                  <span className='font-bold'>Event Desc:</span> {appointment.eventDesc}
                </div>
                <div>
                  <span className='font-bold'>Event Time Start: </span>
                  {appointment.eventTimeStart}
                </div>
                <div>
                  <span className='font-bold'>Event Time End: </span>
                  {appointment.eventTimeEnd}
                </div>
                <div>
                  <span className='font-bold'>Event Date Start: </span>
                  {formatDate(appointment.eventDateStart.toDate())}
                </div>
                <div>
                  <span className='font-bold'>Event Date End: </span>
                  {formatDate(appointment.eventDateEnd.toDate())}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
