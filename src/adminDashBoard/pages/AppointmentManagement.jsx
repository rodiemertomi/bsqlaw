import { useState } from 'react'
import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Time from './components/Time'
import UseUserReducer from '../../UserReducer'
import Times from './components/Times'

function AppointmentManagement() {
  const [showAppointment, setShowAppoitnment] = useState(false)
  // const [date, setDate] = useState(new Date())
  // const [showTime, setShowTime] = useState(false)
  // const { appointments } = UseUserReducer()
  /* <div>
                  <Calendar onChange={setDate} value={date} onClickDay={() => setShowTime(true)} />
                </div> */
  /* <div>
                  {date.length > 0 ? (
                    <p>
                      <span>Start:</span>
                      {date[0].toDateString()}
                      &nbsp; &nbsp;
                      <span>End:</span>
                      {date[1].toDateString()}
                    </p>
                  ) : (
                    <p>
                      <span>Default selected date: </span>
                      {date.toDateString()}
                    </p>
                  )}
                  {appointments.toString()}
                  <Time showTime={showTime} date={date} />
                </div> */

  return (
    <div className='h-screen w-screen overflow-auto flex flex-col items-center overflow-x-hidden md:h-screen md:w-screen lg:w-screen '>
      <h1 className='self-start text-[30px] mt-3 ml-5 font-bold lg:ml-28'>Appointments</h1>
      <div className='h-full w-full flex flex-col gap-5 overflow-auto p-5 overflow-x-hidden lg:overflow-hidden lg:w-screen lg:h-screen lg:flex lg:flex-row lg:pr-0 lg:mt-0'>
        <div className='w-[100%] h-[1000%] shadow-lg bg-[#D9D9D9] rounded-md flex flex-col gap-2 items-center lg:w-[130%] lg:h-[100%] lg:ml-20 '>
          {/* Card View */}
          <div className='w-[100%] h-[100%] pl-5 pt-5 pr-5 flex flex-wrap gap-2 justify-center lg:w-[100%] overflow-auto scrollbar-hide'>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
            <div className='bg-[#9C9999] w-[100%] h-[80px] rounded-md pl-2 '>Events</div>
          </div>
          <div className='h-[50px] flex flex-col justify-center item-center self-end mb-2 mr-5'>
            <button
              className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-3xl shadow-md bg-maroon hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out'
              onClick={() => {
                setShowAppoitnment(true)
              }}
            >
              Add Appointments
            </button>
          </div>
          {showAppointment && (
            <div className='w-screen h-screen backdrop-blur-sm absolute top-0 left-0 flex justify-center items-center'>
              <Times closeShowAppointment={setShowAppoitnment} />
            </div>
          )}
        </div>
        {/* Second Div */}
        <div className='w-[100%] h-[100%] lg:h-[100%] lg:w-[30%]'>
          <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
            <div className=' flex flex-col items-start shadow-lg  text-white bg-maroon rounded-md lg:h-[50%] '>
              {/* Todo */}
              <div className='flex flex-col m-5 text-justify '>
                <div className='flex'>
                  <h1 className='font-bold'>To-Do</h1>
                  <h1 className='font-bold'>+</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentManagement
