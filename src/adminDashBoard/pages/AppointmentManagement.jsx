import { useState } from 'react'
import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Time from './components/Time'
import UseUserReducer from '../../UserReducer'
import Times from './components/Times'

function AppointmentManagement() {
  // const [date, setDate] = useState(new Date())
  // const [showTime, setShowTime] = useState(false)
  // const { appointments } = UseUserReducer()

  const [showAppointment, setShowAppoitnment] = useState(false)

  return (
    <div className='h-screen w-screen md:w-screen md:h-screen lg:w-screen lg:ml-48 '>
      <h1 className='self-start text-[30px] font-bold ml-2 mt-2 lg:ml-5 lg:mt-5'>Appointments</h1>
      <div className='h-full flex flex-col gap-5 items-center overflow-auto lg:overflow-hidden scrollbar-hide md:w-full md:h-full lg:w-full lg:h-full lg:flex lg:flex-row'>
        {/* First Div */}
        <div className='w-[95%] gap-5 mt-5 lg:w-[95%] lg:h-[100%] lg:ml-2'>
          {/* Welcome Text */}
          <div className=' rounded-md  flex flex-col  bg-[#D9D9D9] lg:h-[88%] overflow-scroll scrollbar-hide'>
            <div className='m-5 lg:m-5 text-justify'>
              <div className='flex flex-col items-center justify-center'>
                {/* <div>
                  <Calendar onChange={setDate} value={date} onClickDay={() => setShowTime(true)} />
                </div> */}
                {/* <div>
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
                </div> */}
                <div className='w-full flex flex-col justify-center items-center gap-2'>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                  <div className='bg-[#9C9999] w-[100%] h-[60px] rounded-md pl-2 '>Events</div>
                </div>
                <div className='self-end mt-2'>
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
            </div>
          </div>
        </div>
        {/* Second Div */}
        <div className='w-[95%] h-[100%] lg:h-[100%] lg:w-[30%] lg:mt-5 lg:mr-24'>
          <div className='flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[100%]'>
            <div className=' flex flex-col items-start text-white bg-maroon rounded-md lg:h-[45%] '>
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
